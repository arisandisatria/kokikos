import { RecipeResultCardProps } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import ThemeText from "../ui/ThemeText";

function RecipeResultCard({
  productName,
  estimatedTime,
  estimatedPrice,
  insufficientIngridients,
  matchPercentage,
}: RecipeResultCardProps) {
  return (
    <TouchableOpacity
      className="mt-5 flex min-h-20 w-full flex-row justify-between rounded-3xl bg-white"
      style={{
        // --- KHUSUS IOS ---
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.05,
        shadowRadius: 7,

        // --- KHUSUS ANDROID ---
        elevation: 2,
      }}
    >
      <Image
        source={require("../../../assets/images/placeholder.png")}
        className="h-full w-1/3 rounded-bl-3xl rounded-tl-3xl object-cover"
      />

      <View className="w-1/2 py-4 pl-2">
        <ThemeText size="sm">{productName}</ThemeText>

        <View className="mt-1 flex flex-row items-center gap-2">
          <View className="flex-row gap-1">
            <Ionicons name="time-outline" size={17} color="#2A9D8F" />
            <ThemeText size="xsm" type="caption">
              {estimatedTime} menit
            </ThemeText>
          </View>
          <View className="my-15 h-5 w-0.5 bg-muted" />
          <View className="flex-row gap-1">
            <Ionicons name="cash-outline" size={17} color="#2A9D8F" />
            <ThemeText size="xsm" type="caption">
              {estimatedPrice}
            </ThemeText>
          </View>
        </View>

        <ThemeText size="xsm" className="mt-1">
          Kurang: {insufficientIngridients}
        </ThemeText>
      </View>

      <View className="mr-4 mt-4 h-7 w-fit rounded-3xl bg-green-500 px-2 py-1">
        <ThemeText type="subtitle" size="xsm" className="h-fit text-white">
          {matchPercentage}%
        </ThemeText>
      </View>
    </TouchableOpacity>
  );
}

export default RecipeResultCard;
