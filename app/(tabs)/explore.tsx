import { Colors } from "@/constants/theme";
import RecipeResultCard from "@/src/components/shared/RecipeResultCard";
import ThemeText from "@/src/components/ui/ThemeText";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function Explore() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState("murah");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchRecipe, setSearchRecipe] = useState("")
  
  const pageLimit = 8; 
  const [currentLimit, setCurrentLimit] = useState(pageLimit);
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    { id: "murah", label: "Termurah" },
    { id: "cepat", label: "Tercepat" },
  ];

  useEffect(() => {
    setCurrentLimit(pageLimit);
    fetchRecipes(pageLimit, true, searchRecipe);
  }, [selectedFilter]);

  async function fetchRecipes(limitValue: number, isInitial = false, queryText = "") {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      let query = supabase
        .from("recipes")
        .select("*")
      
      if (queryText.trim().length > 3) {
        query = query.ilike("recipe_name", `%${queryText.trim()}%`)
      }

      const {data, error} = await query.range(0, limitValue -1)

      if (error) throw error;

      if (data) {
        setRecipes(data);
        setHasMore(data.length === limitValue);
      }
    } catch (error) {
      Alert.alert("Gagal!", "Gagal mengambil data resep!");
      console.error("Gagal mengambil resep:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    
    const nextLimit = currentLimit + pageLimit;
    setCurrentLimit(nextLimit);
    fetchRecipes(nextLimit, false);
  }

  function handleSearchRecipe() {
    setCurrentLimit(pageLimit);
    fetchRecipes(pageLimit, true, searchRecipe);
  }

  const getFilteredRecipes = () => {
    const recipesCopy = [...recipes];
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
        <ThemeText type="title" size="lg">Eksplor Resep</ThemeText>
      </View>

      <View style={[styles.card, styles.inputBar]}>
        <TextInput
          style={styles.textInput}
          placeholderTextColor={Colors.muted}
          placeholder="Cari resep disini..."
          editable={ true}
          selectTextOnFocus={true}
          value={searchRecipe}
          onChangeText={setSearchRecipe}
          onSubmitEditing={handleSearchRecipe}
        />
        <TouchableOpacity onPress={handleSearchRecipe}>
          <Ionicons name="search" size={32} color={Colors.secondary} />
        </TouchableOpacity>
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
                  {color: isActive ? "#FFFFFF" : Colors.muted}
                ]}
              >
                {filter.label}
              </ThemeText>
            </TouchableOpacity>
          );
        })}
      </View>

      {
        loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View> : <ScrollView contentContainerStyle={{ marginTop: 12, flexDirection: 'row', flexWrap: "wrap" }} 
        showsVerticalScrollIndicator={false}>
          { 
            displayedRecipes.map((recipe, index) => (
              <View key={index} style={{ width: '50%', padding: 4, marginBottom: 10 }}>
                <RecipeResultCard
                  isInResultPage={false}
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
            ))          
          }

          <View style={{ width:"100%", marginTop: 10, marginBottom: 100, marginHorizontal: "auto" }}>
            {!hasMore ? null : loadingMore ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginRight: 8}} />
            ) : (
              <TouchableOpacity
                style={[styles.buttonSubmit, {
                      backgroundColor: !loading ? Colors.primary : Colors.muted,
                }]}
                onPress={handleLoadMore}
                disabled={loadingMore}
              >
               
                <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
                  Tampilkan Lagi
                </ThemeText>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      }
    </View>
  )
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.05,
        shadowRadius: 7,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputBar: {
    marginHorizontal: 40,
    marginTop: 28,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  textInput: {
    fontFamily: "os-regular",
    marginLeft: 4,
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    color: Colors.body,
  },
  filterContainer: {
    marginTop: 20,
    marginBottom: 10,
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
  buttonSubmit: {
    marginHorizontal: 40,
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})