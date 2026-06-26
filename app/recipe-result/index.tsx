import { Colors } from "@/constants/theme";
import RecipeResultCard from "@/src/components/features/RecipeResultCard";
import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

export default function RecipeResult() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("cocok");

  const filters = [
    { id: "cocok", label: "Paling Cocok" },
    { id: "murah", label: "Termurah" },
    { id: "cepat", label: "Tercepat" },
  ];

  useEffect(() => {
    const handleBackPress = () => {
      router.replace("/home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );

    return () => {
      backHandler.remove();
    };

  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>

        <ThemeText type="title">Hasil Pencarian</ThemeText>
      </View>

      <View style={styles.filterContainer}>
        {filters.map((filter) => {
          const isActive = selectedFilter === filter.id;

          return (
            <TouchableOpacity
              activeOpacity={1}
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={[
                styles.filterTab,
                isActive ? styles.tabActive : styles.tabInactive,
              ]}
            >
              <ThemeText
                size="sm"
                type="subtitle"
                style={[
                  styles.tabText,
                  isActive ? styles.textActive : styles.textInactive,
                ]}
              >
                {filter.label}
              </ThemeText>
            </TouchableOpacity>
          );
        })}
      </View>

      <RecipeResultCard
        productName="Nasi Telur Bakar"
        estimatedPrice="10.000"
        estimatedTime="10"
        insufficientIngridients="Daun bawang, gula, garam"
        matchPercentage={90}
        onPress={() => router.push("/recipe-detail")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
   marginTop: StatusBar.currentHeight || 40,
  },
  header: {
    position: "relative",
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 10,
  },
  filterContainer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 4,
  },
  filterTab: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  tabActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  tabInactive: {
    borderColor: Colors.muted,
    backgroundColor: Colors.background,
  },
  tabText: {
    textAlign: "center",
    fontFamily: "os-semibold",
  },
  textActive: {
    color: "#FFFFFF",
  },
  textInactive: {
    color: Colors.muted,
  },
});
