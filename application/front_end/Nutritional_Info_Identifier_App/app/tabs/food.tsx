import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router"; // Keep this for navigation

const { width } = Dimensions.get('window');

export default function FoodScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.page}>
      
      {/* Back Arrow Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Apple</Text>

        {/* Breakdown card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Breakdown</Text>
          <View style={styles.piePlaceholder}>
             {/* Text removed so it looks like the empty circle in Figma */}
          </View>
          <Text style={styles.chartCaption}>this will be a pie chart{"\n"}i'm working on it</Text>
        </View>

        {/* Nutrition card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nutritional Info</Text>

          <View style={styles.row}>
            <Text style={styles.rowText}>Calories</Text>
            <Text style={styles.rowText}>80</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Carbohydrates</Text>
            <Text style={styles.rowText}>80</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Fiber</Text>
            <Text style={styles.rowText}>80</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Sugar</Text>
            <Text style={styles.rowText}>80</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Protein</Text>
            <Text style={styles.rowText}>80</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Fat</Text>
            <Text style={styles.rowText}>80</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Saturated</Text>
            <Text style={styles.rowText}>80</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Mono</Text>
            <Text style={styles.rowText}>80</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={[styles.rowText, styles.indent]}>Cholesterol</Text>
            <Text style={styles.rowText}>80</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Sodium</Text>
            <Text style={styles.rowText}>80</Text>
          </View>
        </View>

        {/* Recipes card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Related Recipes</Text>

          <View style={styles.recipeItem}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1562007908-17c67e878c88" }}
              style={styles.recipeImage}
            />
            <Text style={styles.recipeText}>Granny’s Apple Pie</Text>
            <Text style={styles.arrowIcon}>↗</Text>
          </View>

          <View style={styles.recipeItem}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1605478580703-8c4b1d07a2b6" }}
              style={styles.recipeImage}
            />
            <Text style={styles.recipeText}>Baked Apples</Text>
            <Text style={styles.arrowIcon}>↗</Text>
          </View>

          <View style={styles.recipeItem}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" }}
              style={styles.recipeImage}
            />
            <Text style={styles.recipeText}>Apple Salad</Text>
            <Text style={styles.arrowIcon}>↗</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation */}
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
    backgroundColor: "#F9F5E3", // Updated to match Figma cream
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
    paddingBottom: 130, // Extra padding so the scroll clears the floating nav
  },
  title: {
    fontSize: 48,
    fontFamily: 'InstrumentSerif',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF", // White cards
    borderRadius: 30, // Large border radius
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    fontFamily: 'InstrumentSerif',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  piePlaceholder: {
    height: 140,
    width: 140,
    borderRadius: 70,
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
    marginBottom: 10,
  },
  chartCaption: {
    fontSize: 16,
    fontFamily: 'InstrumentSerif-Italic', // Italic for this specific text
    textAlign: 'right',
    marginTop: -20, // Negative margin to overlap the circle slightly
    marginRight: 10,
    color: '#333'
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
    fontSize: 16, // Slightly smaller for sub-items
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5D5", // Muted tan background for recipes
    borderRadius: 20,
    padding: 10,
    marginBottom: 12,
  },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 15, // Rounder image corners
    marginRight: 15,
  },
  recipeText: {
    flex: 1,
    fontFamily: 'InstrumentSerif',
    fontSize: 20,
  },
  arrowIcon: {
    fontSize: 18,
    fontFamily: 'InstrumentSerif',
    paddingRight: 5,
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
    // Shadow for depth
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  toggleActive: {
    flex: 1,
    backgroundColor: '#EB9E64', // Figma Orange
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
});