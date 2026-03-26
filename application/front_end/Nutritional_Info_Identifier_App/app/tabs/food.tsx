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

  const [loading, setLoading] = useState(true);

  const [foodName, setFoodName] = useState("Scan food");

  const [calories, setCalories] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);

  // runs every time screen is opened
  useFocusEffect(
    useCallback(() => {

      analyzePhoto();

    }, [])
  );

  const analyzePhoto = async () => {

    const photoUri = getLatestPhoto();

    if (!photoUri) {

      setLoading(false);
      setFoodName("Scan food");

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

      console.log("NEW SCAN:", data);

      clearLatestPhoto();

      if (!data?.nutrition_result?.ok) {

        setFoodName(data.detected_food ?? "Unknown");

        setCalories(0);
        setCarbs(0);
        setProtein(0);
        setFat(0);

        setLoading(false);

        return;
      }

      const nutrition = data.nutrition_result.nutrition;

      setFoodName(data.detected_food);

      setCalories(nutrition.calories_kcal ?? 0);

      setCarbs(nutrition.carbs_g ?? 0);

      setProtein(nutrition.protein_g ?? 0);

      setFat(nutrition.fat_g ?? 0);

      setLoading(false);

    } catch (err) {

      console.log("SCAN ERROR:", err);

      setFoodName("Server error");

      setLoading(false);

    }

  };

  // prevents crash when values are 0
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

        {!loading && (

          <>

            <View style={styles.card}>

              <Text style={styles.cardTitle}>

                Breakdown

              </Text>

              <View style={{ alignItems: "center", marginBottom: 15 }}>

                <PieChart

                  widthAndHeight={140}

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

            <TouchableOpacity

              style={styles.scanButton}

              onPress={() => router.push("/tabs/camera")}

            >

              <Text style={styles.scanText}>

                Scan Again

              </Text>

            </TouchableOpacity>

          </>

        )}

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

    padding: 20,
    paddingBottom: 120

  },

  title: {

    fontSize: 42,
    fontFamily: "InstrumentSerif",
    marginBottom: 20

  },

  card: {

    backgroundColor: "#fff",

    borderRadius: 28,

    padding: 24,

    marginBottom: 20

  },

  cardTitle: {

    fontSize: 24,

    fontFamily: "InstrumentSerif",

    marginBottom: 15

  },

  row: {

    flexDirection: "row",

    justifyContent: "space-between",

    paddingVertical: 6

  },

  rowText: {

    fontFamily: "InstrumentSerif",

    fontSize: 18

  },

  legendContainer: {

    flexDirection: "row",

    justifyContent: "center",

    gap: 15

  },

  legendItem: {

    flexDirection: "row",

    alignItems: "center"

  },

  colorDot: {

    width: 10,

    height: 10,

    borderRadius: 5,

    marginRight: 6

  },

  legendText: {

    fontFamily: "InstrumentSerif"

  },

  scanButton: {

    backgroundColor: "#EB9E64",

    paddingVertical: 16,

    borderRadius: 30,

    alignItems: "center"

  },

  scanText: {

    color: "white",

    fontSize: 20,

    fontFamily: "InstrumentSerif"

  }

});
