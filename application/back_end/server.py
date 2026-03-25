import os
import json
import sqlite3
from datetime import datetime
from typing import Optional, Dict, Any

import cv2
import numpy as np
import requests
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

# -----------------------
# Config
# -----------------------
# You are running uvicorn from project root:
#   uvicorn application.back_end.server:app ...
# so MODEL_PATH should be relative to project root:
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "application/back_end/Object_Detection/models/best.pt")

USDA_API_KEY = os.getenv("USDA_API_KEY", "")

# Cache stored in the backend folder (relative to project root).
CACHE_DB_PATH = os.getenv("NUTRITION_CACHE_DB", "application/back_end/nutrition_cache.sqlite")

# -----------------------
# App
# -----------------------
app = FastAPI(title="Nutrition Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Cache (SQLite)
# -----------------------
def init_cache():
    # Ensure directory exists for cache DB file
    cache_dir = os.path.dirname(CACHE_DB_PATH)
    if cache_dir:
        os.makedirs(cache_dir, exist_ok=True)

    conn = sqlite3.connect(CACHE_DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS nutrition_cache (
            food TEXT PRIMARY KEY,
            response_json TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()

def cache_get(food: str) -> Optional[Dict[str, Any]]:
    if not os.path.exists(CACHE_DB_PATH):
        return None
    conn = sqlite3.connect(CACHE_DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT response_json FROM nutrition_cache WHERE food = ?", (food,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    return json.loads(row[0])

def cache_set(food: str, payload: Dict[str, Any]) -> None:
    conn = sqlite3.connect(CACHE_DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO nutrition_cache(food, response_json, updated_at)
        VALUES(?, ?, ?)
        ON CONFLICT(food) DO UPDATE SET
            response_json=excluded.response_json,
            updated_at=excluded.updated_at
        """,
        (food, json.dumps(payload), datetime.utcnow().isoformat()),
    )
    conn.commit()
    conn.close()

init_cache()

# -----------------------
# Load YOLO once at startup
# -----------------------
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"YOLO model not found at: {MODEL_PATH}")

model = YOLO(MODEL_PATH)

# -----------------------
# USDA helpers (improved matching)
# -----------------------
def usda_search_food(query: str) -> Optional[int]:
    """
    Returns best-matching FDC ID for the given food name,
    preferring raw/fresh and higher-quality data types.
    """
    if not USDA_API_KEY:
        return None

    url = "https://api.nal.usda.gov/fdc/v1/foods/search"
    params = {"api_key": USDA_API_KEY}

    # Push the search toward raw versions
    boosted_query = f"{query} raw"

    body = {
        "query": boosted_query,
        "pageSize": 15,
        "pageNumber": 1,
    }

    r = requests.post(url, params=params, json=body, timeout=15)
    r.raise_for_status()
    data = r.json()
    foods = data.get("foods", [])
    if not foods:
        return None

    preferred_types = {"Foundation", "SR Legacy"}
    bad_words = {"dried", "chips", "powder", "flour", "candy", "sweetened", "baked", "fried", "dehydrated", "juice", "nectar", "puree"}
    good_words = {"raw", "fresh"}

    best_id = None
    best_score = -10**9

    q = query.lower().strip()

    for f in foods:
        fdc_id = f.get("fdcId")
        if not fdc_id:
            continue

        desc = (f.get("description") or "").lower()
        dtype = (f.get("dataType") or "")

        score = 0

        # Prefer canonical food sources
        if dtype in preferred_types:
            score += 100

        # Prefer raw/fresh keywords
        if any(w in desc for w in good_words):
            score += 30

        # Strongly avoid processed forms
        if any(w in desc for w in bad_words):
            score -= 250

        # Prefer descriptions that start with the food name
        if desc.startswith(q):
            score += 10

        # Mild reward for mentioning the food name at all
        if q in desc:
            score += 5

        if score > best_score:
            best_score = score
            best_id = fdc_id

    return best_id

def usda_get_food_details(fdc_id: int) -> Dict[str, Any]:
    """
    Returns simplified nutrition (kcal, protein, carbs, fat) + USDA description/dataType.
    """
    url = f"https://api.nal.usda.gov/fdc/v1/food/{fdc_id}"
    params = {"api_key": USDA_API_KEY}
    r = requests.get(url, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()

    nutrients = data.get("foodNutrients", [])
    description = data.get("description")
    data_type = data.get("dataType")

    def pick_amount(name_contains: str, prefer_unit: Optional[str] = None) -> Optional[float]:
        best = None
        for n in nutrients:
            nutrient = n.get("nutrient", {})
            n_name = (nutrient.get("name") or n.get("nutrientName") or n.get("nutrient_name") or "").lower()
            if name_contains.lower() not in n_name:
                continue

            amount = n.get("amount")
            unit = (nutrient.get("unitName") or n.get("unitName") or "").lower()

            if amount is None:
                continue

            if prefer_unit and unit == prefer_unit.lower():
                return float(amount)

            if best is None:
                best = float(amount)

        return best

    # Energy in kcal can exist as "Energy" (kcal) or sometimes kJ only.
    calories_kcal = pick_amount("energy", prefer_unit="kcal")
    protein_g = pick_amount("protein", prefer_unit="g")
    carbs_g = pick_amount("carbohydrate", prefer_unit="g")
    fat_g = pick_amount("total lipid", prefer_unit="g")

    return {
        "serving_basis": "100g (as provided by source)",
        "calories_kcal": calories_kcal,
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fat_g": fat_g,
        "usda_description": description,
        "usda_data_type": data_type,
    }

def nutrition_lookup(food: str) -> Dict[str, Any]:
    """
    Cache-first nutrition lookup via USDA.
    """
    food_key = food.strip().lower()

    # If we have a cached successful answer (or 'no match'), use it.
    cached = cache_get(food_key)
    if cached:
        return cached

    # IMPORTANT: don't cache "key missing" errors (so you can set it later).
    if not USDA_API_KEY:
        return {
            "ok": False,
            "error": "USDA_API_KEY not set on server",
            "food": food_key,
        }

    fdc_id = usda_search_food(food_key)
    if not fdc_id:
        payload = {"ok": False, "error": "No USDA match found", "food": food_key}
        cache_set(food_key, payload)
        return payload

    nutrition = usda_get_food_details(fdc_id)
    payload = {
        "ok": True,
        "food": food_key,
        "source": "USDA_FDC",
        "source_id": fdc_id,
        "nutrition": nutrition,
    }
    cache_set(food_key, payload)
    return payload

# -----------------------
# "Chatbot" formatter (deterministic)
# -----------------------
def format_chat_reply(detected_food: str, confidence: float, nutrition_payload: Dict[str, Any]) -> str:
    title = f"🍽️ Detected: {detected_food} ({confidence*100:.1f}% confidence)"

    if not nutrition_payload.get("ok"):
        return (
            f"{title}\n\n"
            f"⚠️ I couldn’t fetch nutrition data.\n"
            f"Reason: {nutrition_payload.get('error', 'Unknown error')}\n"
        )

    n = nutrition_payload["nutrition"]
    kcal = n.get("calories_kcal")
    protein = n.get("protein_g")
    carbs = n.get("carbs_g")
    fat = n.get("fat_g")

    usda_desc = n.get("usda_description") or "N/A"
    usda_type = n.get("usda_data_type") or "N/A"

    def fmt(x):
        return "N/A" if x is None else f"{x:.2f}"

    table = (
        "Nutrition (approx, per 100g):\n"
        f"- Calories: {fmt(kcal)} kcal\n"
        f"- Protein: {fmt(protein)} g\n"
        f"- Carbs: {fmt(carbs)} g\n"
        f"- Fat: {fmt(fat)} g\n"
    )

    tips = []
    if protein is not None and protein >= 10:
        tips.append("✅ Higher-protein item — good for satiety.")
    if carbs is not None and carbs >= 20:
        tips.append("⚡ Carb-forward — consider pairing with protein/fiber for steadier energy.")
    if fat is not None and fat >= 10:
        tips.append("🥑 Higher fat content — more calorie-dense per gram.")
    if not tips:
        tips = ["💡 Balanced macros — great as part of a mixed meal."]

    source_line = (
        f"Source: USDA_FDC (id: {nutrition_payload.get('source_id')})\n"
        f"USDA item: {usda_desc} | dataType: {usda_type}"
    )

    return f"{title}\n\n{table}\nTips:\n- " + "\n- ".join(tips) + f"\n\n{source_line}"

# -----------------------
# YOLO detection helper
# -----------------------
def detect_food_from_image(img_bgr: np.ndarray) -> Dict[str, Any]:
    results = model(img_bgr, verbose=False)
    r0 = results[0]

    if r0.boxes is None or len(r0.boxes) == 0:
        return {"ok": False, "error": "No objects detected"}

    confs = r0.boxes.conf.cpu().numpy()
    clss = r0.boxes.cls.cpu().numpy().astype(int)

    best_i = int(np.argmax(confs))
    best_conf = float(confs[best_i])
    best_cls = int(clss[best_i])

    label = r0.names.get(best_cls, str(best_cls))
    return {"ok": True, "label": label, "confidence": best_conf}

# -----------------------
# Routes
# -----------------------
@app.get("/health")
def health():
    return {"ok": True}

@app.get("/nutrition")
def get_nutrition(food: str):
    return nutrition_lookup(food)

@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    content = await image.read()
    img_arr = np.frombuffer(content, dtype=np.uint8)
    img_bgr = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)

    if img_bgr is None:
        raise HTTPException(status_code=400, detail="Could not decode image. Use jpg/png.")

    det = detect_food_from_image(img_bgr)
    if not det.get("ok"):
        raise HTTPException(status_code=404, detail=det.get("error", "Detection failed"))

    detected_food = str(det["label"]).strip().lower()
    confidence = float(det["confidence"])

    nutrition_payload = nutrition_lookup(detected_food)

    response = {
        "detected_food": detected_food,
        "confidence": confidence,
        "nutrition_result": nutrition_payload,
        "chat_reply": format_chat_reply(detected_food, confidence, nutrition_payload),
    }
    return response