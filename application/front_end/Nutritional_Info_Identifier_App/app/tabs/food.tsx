import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function FoodScreen() {
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Apple</Text>

        {/* Breakdown card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Breakdown</Text>
          <View style={styles.piePlaceholder}>
            <Text style={{ textAlign: "center" }}>
              Pie Chart{"\n"}(placeholder)
            </Text>
          </View>
        </View>

        {/* Nutrition card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nutritional Info</Text>

          <View style={styles.row}>
            <Text>Calories</Text>
            <Text>80</Text>
          </View>

          <View style={styles.row}>
            <Text>Carbohydrates</Text>
            <Text>80g</Text>
          </View>


          <View style={styles.row}>
            <Text>Protein</Text>
            <Text>1g</Text>
          </View>

          <View style={styles.row}>
            <Text>Fat</Text>
            <Text>0g</Text>
          </View>

          <View style={styles.row}>
            <Text>Sodium</Text>
            <Text>0g</Text>
          </View>
        </View>

        {/* Recipes card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Related Recipes</Text>

          <View style={styles.recipeItem}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1562007908-17c67e878c88",
              }}
              style={styles.recipeImage}
            />
            <Text>Granny’s Apple Pie</Text>
          </View>

          <View style={styles.recipeItem}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1605478580703-8c4b1d07a2b6",
              }}
              style={styles.recipeImage}
            />
            <Text>Baked Apples</Text>
          </View>

          <View style={styles.recipeItem}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
              }}
              style={styles.recipeImage}
            />
            <Text>Apple Salad</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#E8E2C8",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#F4F1E6",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "500",
  },

  piePlaceholder: {
    height: 140,
    borderRadius: 70,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 140,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  recipeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});