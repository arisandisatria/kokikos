import { Colors } from "@/constants/color";
import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

function index() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("bahan-alat");

  const tabs = [
    {
      id: "bahan-alat",
      label: "Bahan & Alat",
    },
    {
      id: "langkah",
      label: "Langkah",
    },
    {
      id: "nutrisi",
      label: "Nutrisi",
    },
  ];

  return (
    <View className="mt-10 flex-1">
      <View className="relative mx-4 mt-4 flex flex-row items-center justify-center">
        <TouchableOpacity
          onPress={() => router.push("/recipe-result")}
          className="absolute left-0 z-10"
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>

        <ThemeText type="title">Detail Pencarian</ThemeText>
      </View>

      <View className="mt-8 flex gap-1">
        <View className="flex w-full items-center">
          <Image source={require("../../assets/images/placeholder.png")} />
          <ThemeText type="title" size="lg" className="mt-8">
            Nasi Telur Pontianak
          </ThemeText>
        </View>

        <ThemeText className="mx-4 mt-5">
          Nasi Telur Pontianak adalah hidangan nasi hangat dengan telur ceplok
          yang disiram saus kecap manis-asin gurih, seringkali dengan aroma ebi
          dan bawang putih
        </ThemeText>

        <View
          className="mt-5 flex-row justify-between"
          style={{ marginHorizontal: 64 }}
        >
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={17} color={Colors.secondary} />
            <ThemeText size="sm">10 menit</ThemeText>
          </View>
          <View className="flex-row gap-1">
            <Ionicons name="star-outline" size={17} color={Colors.secondary} />
            <ThemeText size="sm">4.5</ThemeText>
          </View>
        </View>

        <View className="mt-5 w-full flex-row">
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setSelectedTab(tab.id)}
                style={{
                  width: "33%",
                  borderBottomWidth: isActive ? 2 : 0,
                  borderBottomColor: isActive ? Colors.primary : "",
                  paddingBottom: 18,
                }}
              >
                <ThemeText
                  type="subtitle"
                  className="text-center font-os-semibold"
                >
                  {tab.label}
                </ThemeText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default index;
