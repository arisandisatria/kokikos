import { askGemini } from "@/config/AIModel";
import prompt from "@/constants/prompt";
import { Colors } from "@/constants/theme";
import { UserDetailContext } from "@/context/UserDetailContext";
import ThemeText from "@/src/components/ui/ThemeText";
import { Ingredient } from "@/src/types";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const [ingredient, setIngredient] = useState("");
  const [ingredientList, setIngredientsList] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(UserDetailContext);

  if (!context) {
    return null;
  }

  const { userDetail, setUserDetail } = context;
  const firstName = userDetail?.name ? userDetail?.name.trim().split(" ")[0] : "User Keren";

  function handleAddIngredient() {
    if (ingredient.trim() === "") {
      Alert.alert("Cuy!", "Tulis nama bahannya dulu dong!");
      return;
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: ingredient.trim(),
      quantity: "",
    };

    setIngredientsList([...ingredientList, newIngredient]);
    setIngredient("");
  }

  function handleRemoveIngredient(id: string) {
    if (!id) {
      Alert.alert("Gagal!", `Item dengan id:${id} tidak ditemukan!`);
      return;
    }

    const updateIngredientList = ingredientList.filter(
      (item) => item.id !== id,
    );
    setIngredientsList(updateIngredientList);
  }

  function handleUpdateIngredientQuantity(quantity: string, id: string) {
    const updateIngredientQuantity = ingredientList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity,
        };
      }
      return item;
    });

    setIngredientsList(updateIngredientQuantity);
  }

  async function handleSearchRecipe() {
    if (ingredientList.length === 0) {
      Alert.alert("Gagal!", "Daftar bahan tidak boleh kosong!");
      return;
    }

    setLoading(true)

    const searchExistingRecipe = ingredientList.map((item)=> item.name.toLowerCase())

    try {
      const {data: existingRecipe, error: dbError} = await supabase.from("recipes").select("*").contains("search_keywords", searchExistingRecipe)

      if (existingRecipe && existingRecipe.length > 0) {
        setLoading(false)
        router.push({
            pathname: "/(tabs)/home/recipe-result",
            params: {
              recipesParams: JSON.stringify(existingRecipe),
            },
          })
        return
      }

      const formattedIngredients = ingredientList
        .map((item) => `${item.name} ${item.quantity ? `(${item.quantity})` : ""}`)
        .join(", ");

      const userPrompt =`Berikut adalah bahan yang dimiliki pengguna: ${formattedIngredients + prompt.RECIPE}`
      
      const result = await askGemini(userPrompt)

      if (!result) {
        Alert.alert("Gagal!", `Resep tidak dapat diproses!`);
        return;
      }

      const firstBracket = result.indexOf("{");
      const lastBracket = result.lastIndexOf("}");

      if (firstBracket === -1 || lastBracket === -1) {
        Alert.alert("Gagal!", "Format resep dari AI tidak valid.");
        return;
      }

      const cleanedJsonString = result.substring(firstBracket, lastBracket + 1);
      const parsedResult = JSON.parse(cleanedJsonString);

      const recipeList = parsedResult.recipe || [];

      if (recipeList.length === 0) {
        Alert.alert("Gagal!", "Format resep AI tidak sesuai.");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        Alert.alert("Gagal!", "Sesi pengguna tidak ditemukan. Silakan login ulang!");
        setUserDetail(null)
        router.replace("/auth/SignIn")
        return;
      }

      const recipesToInsert = recipeList.map((item: any) => ({
        user_id: session.user.id,
        recipe_name: item?.recipe_name || "Resep Tanpa Nama",
        description: item?.description || "",
        estimated_time: item?.estimated_time || 0,
        budget: item?.budget || 0,
        ingredient_match: item?.ingredient_match || 0,
        ingredient_shortage: item?.ingredient_shortage || 0,
        difficulty_rating: item?.difficulty_rating || 0,
        ingredients_and_tools: item?.ingredients_and_tools ? JSON.stringify(item.ingredients_and_tools) : "[]",
        steps: item?.steps ? JSON.stringify(item.steps) : "[]",
        nutrition: item?.nutrition ? JSON.stringify(item.nutrition) : "[]",
        search_keywords: searchExistingRecipe
      }));

      const { data: insertedData, error: insertDataError } = await supabase.from("recipes").insert(recipesToInsert).select();

      if (insertDataError) {
        console.error("Supabase Insert Error:", insertDataError);
        Alert.alert("Gagal!", `Gagal menyimpan daftar resep ke database!`);
        return
      }

      setIngredient("")
      setIngredientsList([])
      router.push({
        pathname: "/(tabs)/home/recipe-result",
        params: {
          recipesParams: JSON.stringify(insertedData), 
        },
      });
    } catch (error) {
      setIngredient("")
      setIngredientsList([])
      console.error("Gemini Error:", error);
      Alert.alert("Gagal!", `Ada kesalahan dari AI atau server!`);
    } finally {
      setIngredient("")
      setIngredientsList([])
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemeText type="title" size="lg">
          Halo,{" "}
          <ThemeText type="title" size="lg" style={{ color: Colors.primary }}>
            {firstName}
          </ThemeText>
          !
        </ThemeText>
        <TouchableOpacity 
          onPress={() => router.push("/profile")} 
          activeOpacity={0.7} 
          style={styles.imageContainer}
        >
          <Image 
            source={require("../../../assets/images/avatar.png")} 
            style={styles.avatar} 
            resizeMode='cover'
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 48 }}>
        <ThemeText type="title" style={{ textAlign: "center", marginBottom: 4 }}>
          Lagi laper? Ada bahan apa nih?
        </ThemeText>

        <View style={[styles.card, styles.inputBar]}>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.muted}
            placeholder="Isi bahan satu per satu disini..."
            value={ingredient}
            editable={!loading}
            selectTextOnFocus={!loading}
            onChangeText={setIngredient}
            onSubmitEditing={handleAddIngredient}
          />
          <TouchableOpacity 
            onPress={handleAddIngredient}
            activeOpacity={0.6}
          >
            <Ionicons name="add-circle" size={32} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.listContainer]}>
          <ThemeText size="sm" type="title" style={{ color: Colors.body, opacity: 0.9 }}>
            Bahan-bahanmu:
          </ThemeText>

          {ingredientList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={44} color={Colors.muted} style={{ marginBottom: 6 }} />
              <ThemeText size="sm" type="caption" style={{ textAlign: "center", color: Colors.muted }}>
                Bahan belum dimasukkan
              </ThemeText>
            </View>
          ) : (
            <ScrollView 
              style={{ flex: 1, marginTop: 12 }} 
              showsVerticalScrollIndicator={false}
            >
              {ingredientList.map((item) => (
                <View key={item.id} style={styles.ingredientRow}>
                  <ThemeText size="sm" style={styles.ingredientName}>
                    {item.name}
                  </ThemeText>
                  
                  <TextInput
                    style={styles.quantityInput}
                    placeholderTextColor={Colors.muted}
                    placeholder="Contoh: 2 butir, 50gr"
                    value={item.quantity}
                    editable={!loading}
                    selectTextOnFocus={!loading}
                    onChangeText={(text) => handleUpdateIngredientQuantity(text, item.id)}
                  />
                  
                  <TouchableOpacity
                    disabled={loading}
                    activeOpacity={0.6}
                    onPress={() => handleRemoveIngredient(item.id)}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name="close-sharp"
                      size={22}
                      color={Colors.danger}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {ingredientList.length > 0 && (
          <TouchableOpacity
            style={[
              styles.buttonSubmit, 
              { backgroundColor: !loading ? Colors.primary : Colors.muted }
            ]}
            onPress={handleSearchRecipe}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading && (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
            )}
            <ThemeText size="base" type="title" style={{ color: "#FFFFFF" }}>
              {loading ? "Mencari Resep..." : "Cari Resep"}
            </ThemeText>
          </TouchableOpacity>
        )}
      </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputBar: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  textInput: {
    fontFamily: "os-regular",
    marginLeft: 4,
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    color: Colors.body,
  },
  listContainer: {
    minHeight: "45%",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.7,
  },
  ingredientRow: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 8,
  },
  ingredientName: {
    flex: 1,
    color: Colors.body,
    fontFamily: "os-semibold",
  },
  quantityInput: {
    width: "60%",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    color: Colors.body,
    fontFamily: "os-regular",
    textAlign: "left",
  },
  buttonSubmit: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});