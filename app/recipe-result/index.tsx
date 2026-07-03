import { Colors } from "@/constants/theme";
import RecipeResultCard from "@/src/components/features/RecipeResultCard";
import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

export default function RecipeResult() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("cocok");
  const {recipesParams} = useLocalSearchParams()
  
  if (!recipesParams) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
       <Ionicons name="help-outline" size={40} color={Colors.secondary} />
        <ThemeText type="title" size="lg" style={{color: Colors.primary}}>Resep tidak ditemukan</ThemeText>
      </View>
    );
  }

  const rawRecipes: any[] = JSON.parse(recipesParams as string);

  const filters = [
    { id: "cocok", label: "Paling Cocok" },
    { id: "murah", label: "Termurah" },
    { id: "cepat", label: "Tercepat" },
  ];

  useEffect(() => {
    const handleBackPress = () => {
      router.back();
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

  const getFilteredRecipes = () => {
    const recipesCopy = [...rawRecipes];
    if (selectedFilter === "murah") {
      return recipesCopy.sort((a, b) => Number(a.budget) - Number(b.budget));
    } else if (selectedFilter === "cepat") {
      return recipesCopy.sort((a, b) => Number(a.estimated_time) - Number(b.estimated_time));
    } else {
      return recipesCopy.sort((a, b) => Number(b.ingredient_match) - Number(a.ingredient_match));
    }
  };

  const displayedRecipes = getFilteredRecipes();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
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

      <ScrollView 
        style={{ flex: 1, marginTop: 12 }} 
        showsVerticalScrollIndicator={false}
      >
        {displayedRecipes.map((recipe, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <RecipeResultCard
              recipe_name={recipe.recipe_name}
              estimated_time={recipe.estimated_time}
              budget={recipe.budget}
              ingredient_match={recipe.ingredient_match}
              ingredient_shortage={recipe.ingredient_shortage}
              onPress={() => router.push({
                pathname: "/recipe-detail",
                params: { recipeDetailParams: JSON.stringify(recipe) }
              })}
            />
          </View>
        ))}
      </ScrollView>
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
