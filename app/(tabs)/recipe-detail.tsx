import { Colors } from "@/constants/theme";
import ThemeText from "@/src/components/ui/ThemeText";
import { IngredientsAndToolsItem, NutritionItem, RecipeDetail } from "@/src/types";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, BackHandler, Dimensions, Image, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - 32 - 39) / 4;

export default function index() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("bahan-alat");
  const [isBookmarked, setIsBookmarked] = useState(false)

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
  const mockIngredients = [{name: "Telur", quantity: "1 butir"}, {name: "Ikan", quantity: "2 ekor"}, {name: "Nasi", quantity: "1 bakul"}, {name: "Bawang Putih", quantity: "1 siung"}, {name: "Jahe", quantity: "1 buah"}]
  const mockTools = ["Wajan", "Spatula", "Sendok", "Piring", "Pisau"]
  const mockSteps = ["Panaskan wajan", "Siram wajan", "Buang wajan", 'Beli di depan']
  const mockNutrition= [
    {
      type: "Kalori",
      weight: "130 kkal",
      percentage: "15%"
    },
    {
      type: "Karbo",
      weight: "20 gram",
      percentage: "80%"
    },
    {
      type: "Protein",
      weight: "7 gram",
      percentage: "5%"
    },
    {
      type: "Kalori",
      weight: "130 kkal",
      percentage: "15%"
    },
    {
      type: "Karbo",
      weight: "20 gram",
      percentage: "80%"
    },
    {
      type: "Karbo",
      weight: "20 gram",
      percentage: "80%"
    },
  ]

  const {recipeDetailParams} = useLocalSearchParams()

  const recipeParamsString = Array.isArray(recipeDetailParams) 
  ? recipeDetailParams[0] 
  : recipeDetailParams;

  const {id, recipe_name, description, estimated_time, budget, ingredients_and_tools, steps, nutrition, difficulty_rating}: RecipeDetail = JSON.parse(recipeParamsString || "{}")

  const nutritionData: NutritionItem[] = typeof nutrition === 'string' 
  ? JSON.parse(nutrition || "[]") 
  : nutrition;

  const itemsData: IngredientsAndToolsItem[] = typeof ingredients_and_tools === "string"
  ? JSON.parse(ingredients_and_tools || "[]")
  : ingredients_and_tools;

  const stepsData: string[] = typeof steps === 'string' 
  ? JSON.parse(steps || "[]") 
  : steps;

  const currentIngredients = itemsData?.[0]?.ingredients || [];
  const currentTools = itemsData?.[0]?.tools || [];
  const recipeSteps = Array.isArray(stepsData) ? stepsData : [];

  async function checkIfRecipeBookmarked() {
    if (!id) return;

    const previousBookmarkState = isBookmarked;

    setIsBookmarked(!isBookmarked);

    try {
      
    } catch (error) {
      console.error("Terjadi kesalahan jaringan/database:", error);
      setIsBookmarked(previousBookmarkState);
      Alert.alert("Koneksi Gagal", "Gagal menyimpan resep, coba lagi nanti.");
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) return;

    const {data, error: isError} = await supabase.from("profiles").select("bookmarked").eq("id", session.user.id).single()

    if (isError) {
      console.error("Gagal mengambil data bookmark:", isError);
      return;
    }

    const bookmarkedArray: string[] = data?.bookmarked || []

    const isExist = bookmarkedArray.includes(id)

    setIsBookmarked(isExist)
  }

  async function handleToogleBookmarkRecipe() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("bookmarked")
        .eq("id", session.user.id)
        .single();
      
      if (fetchError) {
        console.error("Gagal sinkronisasi data sebelum toggle:", fetchError);
        return;
      }

      let currentBookmarks: string[] = data?.bookmarked || []
      let updatedBookmarks: string[] = []

      if (isBookmarked) {
        updatedBookmarks = currentBookmarks.filter(item => item !== id)
      } else {
        if (!currentBookmarks.includes(id)) {
          updatedBookmarks = [...currentBookmarks, id];
        } else {
          updatedBookmarks = currentBookmarks;
        }
      }

      const {error: updateError} = await supabase.from("profiles").update({bookmarked: updatedBookmarks}).eq("id", session.user.id)

      if (updateError) {
        console.error("Gagal update data:", updateError);
        return;
      }

      setIsBookmarked(!isBookmarked)      
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
    }
  }

  useEffect(() => {
      const handleBackPress = () => {
        router.back();
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress,
      );

      checkIfRecipeBookmarked()
  
      return () => {
        backHandler.remove();
      }; 
  
    }, [id]);

  let content;

  switch (selectedTab) {
    case "langkah":
      content = 
      <View style={styles.tabContent}>
        <ThemeText type="title" style={{ marginBottom: 8 }}>
            Langkah:
          </ThemeText>
          {recipeSteps.map((step, index) => (
            <View key={index} style={[styles.listItem, {alignItems: "flex-start"}]}>
              <ThemeText type="subtitle" size="sm">{index + 1}.{" "}</ThemeText>
              <ThemeText style={styles.listItemText} type="subtitle" size="sm">
                {step}
              </ThemeText>
            </View>
          ))}
      </View>
      break;
    case "nutrisi":
      content = 
      <View style={styles.nutritionContainer}>
        {
          nutritionData && nutritionData.map((item, index) => (
            <View key={index} style={styles.nutritionCard}>
              <ThemeText size="sm" type="subtitle">{item.type}</ThemeText>
              <ThemeText size="xsm" type="caption">{item.weight}</ThemeText>

              <View style={styles.circleBadge}>
                <ThemeText style={styles.circleText} type="subtitle">{item.percentage}%</ThemeText>
              </View>
            </View>
        ))
      }
      </View>
      break;
    default:
      content = 
      <View style={styles.tabContent}>
        <ThemeText type="title" style={{ marginBottom: 8 }}>
            Bahan:
          </ThemeText>
          {currentIngredients.map((ingredient, index) => (
            <View  key={index} style={styles.listItem}>
              <ThemeText style={styles.bullet}>{"\u2022"}</ThemeText>
              <ThemeText style={styles.listItemText} type="subtitle" size="sm">
                {ingredient.name}
              </ThemeText>
              <ThemeText type="subtitle" size="sm" style={{marginRight: 10}}>
                {ingredient.quantity}
              </ThemeText>
            </View>
          ))}

          <ThemeText type="title" style={{ marginTop: 12, marginBottom: 8 }}>
            Alat:
          </ThemeText>
          {currentTools.map((tool, index) => (
            <View key={index} style={styles.listItem}>
              <ThemeText style={styles.bullet}>{"\u2022"}</ThemeText>
              <ThemeText style={styles.listItemText} type="subtitle" size="sm">
                {tool.name}
              </ThemeText>
               <ThemeText type="subtitle" size="sm" style={{marginRight: 10}}>
                {tool.quantity}
              </ThemeText>
            </View>
          ))}
      </View>
      break;
    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
        <ThemeText type="title" size="lg">Detail Pencarian</ThemeText>
        <TouchableOpacity onPress={handleToogleBookmarkRecipe} activeOpacity={0.5}>
          <Ionicons name={isBookmarked ? "bookmark-sharp" : "bookmark-outline"} size={32} color={Colors.primary} />
        </TouchableOpacity>
      </View>

        <View style={styles.imageContainer}>
          <Image source={require("../../assets/images/placeholder.png")} />
          <ThemeText type="title" size="lg" style={{ marginTop: 32 }}>
            {recipe_name}
          </ThemeText>
        </View>

        <ThemeText size="sm" style={styles.description}>
          {description}
        </ThemeText>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={17} color={Colors.secondary} />
            <ThemeText size="sm">{estimated_time} menit</ThemeText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="speedometer-outline" size={17} color={Colors.secondary} />
            <ThemeText size="sm">{difficulty_rating}/10</ThemeText>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab) => {
            const isActive = selectedTab === tab.id;

            return (
              <TouchableOpacity
              activeOpacity={1}
                key={tab.id}
                onPress={() => setSelectedTab(tab.id)}
                style={[
                  styles.tabButton,
                  {
                    borderBottomWidth: 2,
                    borderBottomColor: isActive ? Colors.primary : "transparent",
                  },
                ]}
              >
                <ThemeText
                  type="subtitle"
                  size="sm"
                  style={{ textAlign: "center" }}
                >
                  {tab.label}
                </ThemeText>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView 
        style={{flex: 1, backgroundColor: selectedTab == "nutrisi" ? undefined :"#fff"}} 
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
      >
       
        {content}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 40,
  },
  header: {
    position: "relative",
    marginHorizontal: 16,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16
  },
  description: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  infoContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 64,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tabsContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
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
  tabButton: {
    width: "33.333%",
    paddingVertical: 18,
  },
  tabContent: {
    padding: 16
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 6,
    marginBottom: 4
  },
  listItemText: {
    flex: 1,
    lineHeight: 15,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 15,
    marginRight: 4,
  },
  nutritionContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  nutritionCard: {
    width: CARD_WIDTH + 10,
    backgroundColor: "#fff",
    padding: 12,
    alignItems: "center",
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
  circleBadge: {
    marginTop: 6,
    width: 56,         
    height: 56,        
    borderRadius: 28,  
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",    
  },
  circleText: {
    color: "#fff",
    textAlign: "center",
  }
});