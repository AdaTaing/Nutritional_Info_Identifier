<<<<<<< HEAD
import React, { useState, useCallback } from "react";
=======
import React from "react";
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
<<<<<<< HEAD
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

=======
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router"; 
import PieChart from 'react-native-pie-chart';

const { width } = Dimensions.get('window');

export default function FoodScreen() {
  const router = useRouter();

  // Using hardcoded macros
  const carbs = 25;
  const protein = 1;
  const fat = 1; 

  const series = [
    { value: carbs, color: '#EB9E64' }, 
    { value: protein, color: '#7DA9F4' },  
    { value: fat, color: '#E8D2A6' }   
  ];

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Apple</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Breakdown</Text>
          
          <View style={{ alignItems: 'center', marginBottom: 15 }}>
            <PieChart
              widthAndHeight={140}
              series={series}
              coverRadius={0.5} 
            />
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#EB9E64' }]} />
              <Text style={styles.legendText}>Carbs</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#7DA9F4' }]} />
              <Text style={styles.legendText}>Protein</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#E8D2A6' }]} />
              <Text style={styles.legendText}>Fat</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nutritional Info</Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>Calories</Text>
            <Text style={styles.rowText}>95</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Carbohydrates</Text>
            <Text style={styles.rowText}>{carbs}g</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Fiber</Text>
            <Text style={styles.rowText}>4g</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Sugar</Text>
            <Text style={styles.rowText}>19g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Protein</Text>
            <Text style={styles.rowText}>{protein}g</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Fat</Text>
            <Text style={styles.rowText}>{fat}g</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Saturated</Text>
            <Text style={styles.rowText}>0g</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Mono</Text>
            <Text style={styles.rowText}>0g</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Cholesterol</Text>
            <Text style={styles.rowText}>0mg</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Sodium</Text>
            <Text style={styles.rowText}>2mg</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <View style={styles.togglePill}>
          <TouchableOpacity 
            style={styles.toggleInactive} 
            onPress={() => router.push("/tabs/camera")}
          >
            <Text style={styles.toggleTextInactive}>Scan</Text>
          </TouchableOpacity>
          <View style={styles.toggleActive}>
            <Text style={styles.toggleTextActive}>Info</Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F9F5E3", 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backArrow: {
    fontSize: 28,
    fontFamily: 'InstrumentSerif',
    color: '#000',
  },
  container: {
    padding: 20,
    paddingBottom: 130, 
  },
  title: {
    fontSize: 48,
    fontFamily: 'InstrumentSerif',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF", 
    borderRadius: 30, 
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    fontFamily: 'InstrumentSerif',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  rowText: {
    fontFamily: 'InstrumentSerif',
    fontSize: 18,
    color: '#1A1A1A',
  },
  indent: {
    paddingLeft: 20,
    fontSize: 16, 
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  togglePill: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: width * 0.85,
    height: 64,
    borderRadius: 32,
    padding: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  toggleActive: {
    flex: 1,
    backgroundColor: '#EB9E64', 
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleInactive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'InstrumentSerif',
  },
  toggleTextInactive: {
    color: '#EB9E64',
    fontSize: 24,
    fontFamily: 'InstrumentSerif',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15, 
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontFamily: 'InstrumentSerif',
    fontSize: 16,
    color: '#333',
  },
>>>>>>> ec664cb35920a3350f4212e618738d6223eb6201
});