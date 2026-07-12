import { Colors } from "@/constants/theme";
import { UserDetailContext } from "@/context/UserDetailContext";
import RecipeResultCard from "@/src/components/shared/RecipeResultCard";
import ThemeText from "@/src/components/ui/ThemeText";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function savedRecipe() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState("murah");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
    const [searchRecipe, setSearchRecipe] = useState("")
  const context = useContext(UserDetailContext);
  
  if (!context) {
    return null;
  }

  const { userDetail, setUserDetail } = context;
  
  const pageLimit = 8; 
  const [currentLimit, setCurrentLimit] = useState(pageLimit);
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    { id: "murah", label: "Termurah" },
    { id: "cepat", label: "Tercepat" },
  ];

  useEffect(() => {
    fetchSavedRecipes(pageLimit, true);
  }, []);

  async function fetchSavedRecipes(limitValue: number, isInitial = false, queryText = "") {
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    const userId = userDetail?.id;
    if (!userId) {
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    try {     
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("bookmarked")
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      const allBookmarkedIds: string[] = profileData?.bookmarked || [];

      if (allBookmarkedIds.length === 0) {
        setRecipes([]);
        setHasMore(false);
        return;
      }

      const limitedIds = allBookmarkedIds.slice(0, limitValue);
      
      let recipeQuery = supabase
      .from("recipes")
      .select("*", { count: "exact" })
      .in("id", limitedIds);

      if (queryText.trim().length > 3) {
        recipeQuery = recipeQuery.ilike("recipe_name", `%${queryText.trim()}%`);
      }

      const { data: recipeData, error: recipeError, count } = await recipeQuery
        .range(0, limitValue - 1);

      if (recipeError) throw recipeError;

      if (recipeData) {
       if (queryText.trim().length <= 3) {
          const sortedRecipes = allBookmarkedIds
            .slice(0, limitValue)
            .map(id => recipeData.find(recipe => recipe.id === id))
            .filter(Boolean);
            
          setRecipes(sortedRecipes);
        } else {
          setRecipes(recipeData);
        }

        const totalMatched = count || 0;
        if (recipeData.length >= totalMatched) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (error) {
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
    fetchSavedRecipes(nextLimit, false);
  }

  function handleSearchRecipe() {
    setCurrentLimit(pageLimit);
    fetchSavedRecipes(pageLimit, true, searchRecipe);
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>

        <ThemeText type="title">Resep Tersimpan</ThemeText>
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
        <TouchableOpacity>
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
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 10,
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