import { askGemini } from "@/config/AIModel";
import prompt from "@/constants/prompt";
import { Colors } from "@/constants/theme";
import { UserDetailContext } from "@/context/UserDetailContext";
import ThemeText from "@/src/components/ui/ThemeText";
import { Ingredient } from "@/src/types";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationBar } from "expo-navigation-bar";
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
            pathname: "/recipe-result",
            params: {
              recipesParams: JSON.stringify(existingRecipe),
            },
          })
        return
      }

      const userPrompt =`Berikut adalah bahan yang dimiliki pengguna: ${ingredientList + prompt.RECIPE}`
      
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
        pathname: "/recipe-result",
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
      <NavigationBar hidden />
      <View style={styles.header}>
        <ThemeText type="title" size="lg">
          Halo,{" "}
          <ThemeText type="title" size="lg" style={{color: Colors.primary}}>
            {userDetail?.name}
          </ThemeText>
          !
        </ThemeText>
        <TouchableOpacity onPress={() => router.push("/profile")} activeOpacity={0.8} style={styles.imageContainer}>
          <Image source={require("../../assets/images/avatar.png")} style={styles.avatar} resizeMode='cover'/>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 48,}}>
        <ThemeText type="title" style={{ textAlign: "center",}}>
          Lagi laper? Ada bahan apa nih?
        </ThemeText>

        <View style={[styles.card, styles.inputBar]}>
          <TextInput
            style={[
                    styles.textInput,
                    ingredient === '' ? styles.textInput : styles.textInput
                  ]}
            placeholderTextColor={Colors.muted}
            placeholder="Isi bahan satu per satu disini..."
            value={ingredient}
            editable={loading ? false : true}
            selectTextOnFocus={loading ? false : true}
            onChangeText={setIngredient}
            onSubmitEditing={handleAddIngredient}
          />
          <TouchableOpacity onPress={handleAddIngredient}>
            <Ionicons name="add-circle" size={32} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.listContainer]}>
          <ThemeText size="sm" type="title">
            Bahan-bahanmu:
          </ThemeText>

          {ingredientList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={40} color={Colors.muted} />
              <ThemeText size="sm" type="caption" style={{ textAlign: "center",}}>
                Bahan belum dimasukkan
              </ThemeText>
            </View>
          ) : (
            <ScrollView 
                    style={{flex: 1, marginTop: 10}} 
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
                  placeholder="Isi jumlah bahan"
                  value={item.quantity}
                  editable={loading ? false : true}
                  selectTextOnFocus={loading ? false : true}
                  onChangeText={(text) =>
                    handleUpdateIngredientQuantity(text, item.id)
                  }
                />
                <TouchableOpacity
                  disabled={loading}
                  onPress={() => handleRemoveIngredient(item.id)}
                >
                  <Ionicons
                    name="close-sharp"
                    size={28}
                    color={Colors.danger}
                  />
                </TouchableOpacity>
              </View>
            ))}</ScrollView>
          )}
        </View>

        {ingredientList.length > 0 && (
          <TouchableOpacity
            style={[styles.buttonSubmit, {
                  backgroundColor: !loading ? Colors.primary : Colors.muted,
            }]}
            onPress={handleSearchRecipe}
            disabled={loading}
          >
            {loading && (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8,}} />
            )}
            
            <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
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
  },
  imageContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 75
  },
  avatar: {
  borderRadius: 75,
  ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.05,
        shadowRadius: 7,
      },
      android: {
        elevation: 5,
      },
    }),
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
  listContainer: {
    minHeight: "50%",
    marginHorizontal: 40,
    marginTop: 16,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ingredientRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ingredientName: {
    flex: 1,
    color: Colors.body,
  },
  quantityInput: {
    width: "45%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.body,
    paddingVertical: 0,
    fontSize: 10,
    color: Colors.body,
    fontFamily: "os-regular"
  },
  buttonSubmit: {
    marginHorizontal: 40,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
