import { Tabs } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keeps the splash screen open until your custom fonts are ready
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [loaded, error] = useFonts({
    'InstrumentSerif': require('../../assets/fonts/InstrumentSerif-Regular.ttf'),
    'InstrumentSerif-Italic': require('../../assets/fonts/InstrumentSerif-Italic.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  
  if (!loaded && !error) {
    return null; 
  }

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { display: 'none' } 
      }}
    >
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