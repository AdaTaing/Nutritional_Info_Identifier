import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="camera"
        options={{ title: "Scan" }}
      />
      <Tabs.Screen
        name="food"
        options={{ title: "Food Info" }}
      />
    </Tabs>
  );
}
