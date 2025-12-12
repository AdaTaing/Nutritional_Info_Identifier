from ultralytics import YOLO
import cv2
import matplotlib.pyplot as plt
import os

# --- Configuration ---
model_path = "application/back_end/models/best.pt"        # path to your trained model
input_folder = "application/back_end/test_imgs"  # folder with images to test
output_folder = "application/back_end/test_results"     # folder to save annotated images
display_time = 1000           # milliseconds to display each image (0 = wait for key)

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Load YOLO model
model = YOLO(model_path)

# Get list of images
image_files = [f for f in os.listdir(input_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

for img_file in image_files:
    img_path = os.path.join(input_folder, img_file)

    # Run inference
    results = model(img_path)

    # Annotate image (YOLO automatically draws boxes + class names)
    annotated_img = results[0].plot()

    # Convert BGR (OpenCV) to RGB for Matplotlib
    annotated_img_rgb = cv2.cvtColor(annotated_img, cv2.COLOR_BGR2RGB)

    # Display with Matplotlib
    plt.figure(figsize=(10, 10))
    plt.imshow(annotated_img_rgb)
    plt.title(img_file)
    plt.axis("off")
    plt.show()

    # Save annotated image
    save_path = os.path.join(output_folder, img_file)
    cv2.imwrite(save_path, annotated_img)

print(f"All annotated images saved to '{output_folder}'")
