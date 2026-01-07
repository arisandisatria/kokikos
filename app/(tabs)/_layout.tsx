import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarIconStyle: {
          height: "100%",
          width: "100%",
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          elevation: 0,
          paddingBottom: insets.bottom + (Platform.OS === "android" ? 10 : 0),
          paddingTop: 10,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={color}
              />
            </View>
          ),
        }}
      />
      {/* <Tabs.Screen
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
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center">
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={28}
                color={color}
              />
            </View>
          ),
        }}
      /> */}
    </Tabs>
  );
}
