import RecipeResultCard from "@/src/components/features/RecipeResultCard";
import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function index() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("cocok");

  const filters = [
    { id: "cocok", label: "Paling Cocok" },
    { id: "murah", label: "Termurah" },
    { id: "cepat", label: "Tercepat" },
  ];

  return (
    <View className="mx-4 mt-10 flex-1">
      <View className="relative mt-4 flex flex-row items-center justify-center">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="absolute left-0 z-10"
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>

        <ThemeText type="title">Hasil Pencarian</ThemeText>
      </View>

      <View className="mt-5 flex flex-row gap-1">
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.id;

          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              className={`
                w-[30%] items-center justify-center rounded-3xl py-2
                ${isActive ? "border border-primary bg-primary" : "border border-gray-300 bg-white"}
              `}
            >
              <ThemeText
                size="sm"
                type="subtitle"
                className={`text-center font-os-semibold ${isActive ? "text-white" : "text-gray-500"}`}
              >
                {filter.label}
              </ThemeText>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={() => router.push("/recipe-detail")}>
        <View>
          <RecipeResultCard
            productName="Nasi Peler Bakar"
            estimatedPrice="10.000"
            estimatedTime="10"
            insufficientIngridients="Daun bawang, gula, garam"
            matchPercentage={90}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
