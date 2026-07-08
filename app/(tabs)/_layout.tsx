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
          height: 60 + insets.bottom,
          elevation: 2,
          paddingBottom: insets.bottom + (Platform.OS === "android" ? 10 : 0),
          paddingTop: 10,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
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
      <Tabs.Screen
        name="recipe-result"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="recipe-detail"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}