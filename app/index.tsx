import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  function goToHomeScreen() {
    router.push({
      pathname: "/(tabs)/home",
    });
  }

  return (
    <View className="flex-1 bg-background">
      <View className="h-full px-8 py-10">
        <TouchableOpacity onPress={goToHomeScreen}>
          <Text className="text-center font-os-semibold">Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
