import "../global.css";

import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
