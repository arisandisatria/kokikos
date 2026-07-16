import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarIconStyle: {
          height: "100%",
          width: "100%",
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 64 : 60 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          elevation: 4,
          paddingBottom: insets.bottom > 0 ? insets.bottom : (Platform.OS === "android" ? 4 : 0),
          paddingTop: Platform.OS === "ios" ? 12 : 0,
          borderTopRightRadius: 32,
          borderTopLeftRadius: 32,
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={ {
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "compass" : "compass-outline"}
                size={28}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          popToTopOnBlur: true, 
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={28}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}