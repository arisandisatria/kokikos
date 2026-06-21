import "../global.css";

import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
  });

  useFonts({
    regular: OpenSans_400Regular,
    "outfit-semibold": OpenSans_600SemiBold,
    "outfit-bold": OpenSans_700Bold,
  });

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    ></Stack>
  );
}
