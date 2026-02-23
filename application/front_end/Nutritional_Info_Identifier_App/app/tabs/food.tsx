import React, {useState} from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import type { PropsWithChildren } from "react";

/*export default function FoodScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detected Food</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text>This will show the name of the food identified</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Calories:</Text>
        <Text>This will show the calories of the food identified</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Nutritioinal Facts:</Text>
        <Text>This will show the nutritional information of the food</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  label: {
    width: 100,
    fontWeight: "500",
    color: "#555",
  },
});*/

const FoodScreen = () => {
  const [activeTab, setActiveTab] = useState('Name');

  return (
    <View style={styles.pagecontainer}>
      <PreviewLayout
        label="Food Info"
        values={[
          'Name',
          'Calories',
          'Nutritional Information',
          'Related Recipes',
        ]}
        selectedValue={activeTab}
        setSelectedValue={setActiveTab}
      />
    </View>
  );
};

type PreviewLayoutProps = PropsWithChildren<{
  label: string;
  values: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}>;

//this has stuff related to the content of each tab
const PreviewLayout = ({
  label,
  values,
  selectedValue,
  setSelectedValue,
}: PreviewLayoutProps) => (
  <View style={{ padding: 10, flex: 1 }}>
    <Text style={styles.label}>{label}</Text>

    <View style={styles.row}>
      {values.map(value => (
        <TouchableOpacity
          key={value}
          onPress={() => setSelectedValue(value)}
          style={[
            styles.button,
            selectedValue === value && styles.selected,
          ]}
        >
          <Text
            style={[
              styles.buttonLabel,
              selectedValue === value && styles.selectedLabel,
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.container}> 
      {selectedValue === 'Name' && (
        <Text>Food Name</Text>
      )}

      {selectedValue === 'Calories' && (
        <Text>calories</Text>
      )}

      {selectedValue === 'Nutritional Information' && (
        <Text>
          food facts
        </Text>
      )}

      {selectedValue === 'Related Recipes' && (
        <Text>
          recipes list
        </Text>
      )}
    </View>
  </View>
  //Content for each tab ^^^^
);

const styles = StyleSheet.create({
  pagecontainer:{
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: 'aliceblue',
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
});

export default FoodScreen;
