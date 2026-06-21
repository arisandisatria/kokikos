import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

function index() {
  const router = useRouter();
  return (
    <View className="mx-4 mt-10 flex-1">
      <View className="relative mt-4 flex flex-row items-center justify-center">
        <TouchableOpacity
          onPress={() => router.push("/recipe-result")}
          className="absolute left-0 z-10"
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>

        <ThemeText type="title">Detail Pencarian</ThemeText>
      </View>

      <View className="mt-5 flex flex-row gap-1">
        <View className="w-full flex-row justify-center">
          <Image source={require("../../assets/images/placeholder.png")} />
        </View>
      </View>
    </View>
  );
}

export default index;
