import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";

import PieChart from "react-native-pie-chart";

import {
  getLatestPhoto,
  clearLatestPhoto
} from "../../scanStore";

const { width } = Dimensions.get("window");

const API_URL = "http://192.168.2.93:8000/analyze";

export default function FoodScreen() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [foodName, setFoodName] = useState("Take a picture");
  const [hasData, setHasData] = useState(false);

  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);

  useFocusEffect(
    useCallback(() => {

      analyzePhoto();

    }, [])
  );

  const capitalize = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const analyzePhoto = async () => {

    const photoUri = getLatestPhoto();

    // FIRST LOAD (no photo yet)
    if (!photoUri) {

      setFoodName("Take a picture");
      setHasData(false);
      setLoading(false);

      setCalories(0);
      setCarbs(0);
      setProtein(0);
      setFat(0);

      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("image", {

        uri: photoUri,
        name: "photo.jpg",
        type: "image/jpeg"

      } as any);

      const response = await fetch(API_URL, {

        method: "POST",
        body: formData,
        headers: {

          "Content-Type": "multipart/form-data"

        }

      });

      const data = await response.json();

      console.log("SCAN RESULT:", data);

      clearLatestPhoto();

      if (!data?.nutrition_result?.ok) {

        setFoodName(capitalize(data.detected_food ?? "Unknown"));
        setHasData(true);

        setCalories(0);
        setCarbs(0);
        setProtein(0);
        setFat(0);

        setLoading(false);

        return;
      }

      const nutrition = data.nutrition_result.nutrition;

      setFoodName(capitalize(data.detected_food));

      setCalories(nutrition.calories_kcal ?? 0);

      setCarbs(nutrition.carbs_g ?? 0);

      setProtein(nutrition.protein_g ?? 0);

      setFat(nutrition.fat_g ?? 0);

      setHasData(true);

      setLoading(false);

    } catch (err) {

      console.log("SCAN ERROR:", err);

      setFoodName("Server error");
      setHasData(false);

      setLoading(false);

    }

  };

  const total = carbs + protein + fat;

  const series = total === 0

    ? [
        { value: 1, color: "#EB9E64" },
        { value: 1, color: "#7DA9F4" },
        { value: 1, color: "#E8D2A6" }
      ]

    : [
        { value: carbs, color: "#EB9E64" },
        { value: protein, color: "#7DA9F4" },
        { value: fat, color: "#E8D2A6" }
      ];

  return (

    <SafeAreaView style={styles.page}>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>

          {loading ? "Scanning..." : foodName}

        </Text>

        {loading && (

          <ActivityIndicator
            size="large"
            color="#EB9E64"
          />

        )}

        {!loading && !hasData && (

          <View style={styles.placeholderBox}>

            <Text style={styles.placeholderText}>

              📸 Take a photo to see nutrition info

            </Text>

          </View>

        )}

        {!loading && hasData && (

          <>

            <View style={styles.card}>

              <Text style={styles.cardTitle}>

                Breakdown

              </Text>

              <View style={{ alignItems: "center", marginBottom: 20 }}>

                <PieChart

                  widthAndHeight={150}

                  series={series}

                  coverRadius={0.55}

                />

              </View>

              <View style={styles.legendContainer}>

                <Legend color="#EB9E64" label="Carbs" />

                <Legend color="#7DA9F4" label="Protein" />

                <Legend color="#E8D2A6" label="Fat" />

              </View>

            </View>

            <View style={styles.card}>

              <Text style={styles.cardTitle}>

                Nutrition

              </Text>

              <Row label="Calories" value={`${calories.toFixed(1)} kcal`} />

              <Row label="Carbs" value={`${carbs.toFixed(1)} g`} />

              <Row label="Protein" value={`${protein.toFixed(1)} g`} />

              <Row label="Fat" value={`${fat.toFixed(1)} g`} />

            </View>

          </>

        )}

        <TouchableOpacity

          style={styles.scanButton}

          onPress={() => router.push("/tabs/camera")}

        >

          <Text style={styles.scanText}>

            Scan Food

          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );

}

function Row({ label, value }: any) {

  return (

    <View style={styles.row}>

      <Text style={styles.rowText}>{label}</Text>

      <Text style={styles.rowText}>{value}</Text>

    </View>

  );

}

function Legend({ color, label }: any) {

  return (

    <View style={styles.legendItem}>

      <View style={[styles.colorDot, { backgroundColor: color }]} />

      <Text style={styles.legendText}>{label}</Text>

    </View>

  );

}

const styles = StyleSheet.create({

  page: {

    flex: 1,
    backgroundColor: "#F9F5E3"

  },

  container: {

    padding: 25,
    paddingTop: 40,
    paddingBottom: 150

  },

  title: {

    fontSize: 44,
    fontFamily: "InstrumentSerif",
    marginBottom: 25

  },

  placeholderBox: {

    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 40,
    alignItems: "center",
    marginBottom: 20

  },

  placeholderText: {

    fontFamily: "InstrumentSerif",
    fontSize: 20,
    opacity: 0.7

  },

  card: {

    backgroundColor: "#fff",

    borderRadius: 30,

    padding: 26,

    marginBottom: 20

  },

  cardTitle: {

    fontSize: 26,

    fontFamily: "InstrumentSerif",

    marginBottom: 20

  },

  row: {

    flexDirection: "row",

    justifyContent: "space-between",

    paddingVertical: 7

  },

  rowText: {

    fontFamily: "InstrumentSerif",

    fontSize: 19

  },

  legendContainer: {

    flexDirection: "row",

    justifyContent: "center",

    gap: 18

  },

  legendItem: {

    flexDirection: "row",

    alignItems: "center"

  },

  colorDot: {

    width: 11,

    height: 11,

    borderRadius: 6,

    marginRight: 6

  },

  legendText: {

    fontFamily: "InstrumentSerif"

  },

  scanButton: {

    backgroundColor: "#EB9E64",

    paddingVertical: 18,

    borderRadius: 32,

    alignItems: "center"

  },

  scanText: {

    color: "white",

    fontSize: 22,

    fontFamily: "InstrumentSerif"

  }

});
