import { askGemini } from "@/config/AIModel";
import prompt from "@/constants/prompt";
import { Colors } from "@/constants/theme";
import ThemeText from "@/src/components/ui/ThemeText";
import { Ingredient } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationBar } from "expo-navigation-bar";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAddIngredient() {
    if (ingredient.trim() === "") {
      Alert.alert("Cuy!", "Tulis nama bahannya dulu dong!");
      return;
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: ingredient,
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
      Alert.alert("Gagal!", `Tidak ada bahan-bahan!`);
      return;
    }

    setLoading(true)
    setResponse("")

    const userPrompt =`Berikut adalah bahan yang dimiliki pengguna: ${ingredientList + prompt.RECIPE}`

    try {
      const result = await askGemini(userPrompt)

      if (!result|| !result.trim()) {
        Alert.alert("Gagal!", `Resep tidak ditemukan`);
        return;
      }

      setResponse(result)
      setIngredient("")
      setIngredientsList([])
      // router.push("/recipe-result")
    } catch (error) {
      console.error("Gemini Error:", error);
      Alert.alert("Gagal!", `Ada kesalahan dari AI atau server!`);
    } finally {
      setLoading(false)
    }
  }

  console.log(response)

  return (
    <View style={styles.container}>
      <NavigationBar hidden />
      <View style={styles.header}>
        <ThemeText type="title" size="lg">
          Halo,{" "}
          <ThemeText type="title" size="lg" style={styles.textPrimary}>
            Sandi
          </ThemeText>
          !
        </ThemeText>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={50} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <ThemeText type="title" style={styles.textCenter}>
          Lagi laper? Ada bahan apa nih?
        </ThemeText>

        <View style={[styles.card, styles.inputBar]}>
          <TextInput
            style={styles.textInput}
            placeholderTextColor={Colors.muted}
            placeholder="telur, sawi, tempe..."
            value={ingredient}
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
              <ThemeText size="sm" type="caption" style={styles.textCenter}>
                Keranjang masih kosong nih
              </ThemeText>
            </View>
          ) : (
            <ScrollView 
                    style={{flex: 1}} 
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
                  placeholder="2 potong"
                  value={item.quantity}
                  onChangeText={(text) =>
                    handleUpdateIngredientQuantity(text, item.id)
                  }
                />
                <TouchableOpacity
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
              <ActivityIndicator size="small" color="#fff" style={styles.spinner} />
            )}
            
            <ThemeText size="base" type="title" style={styles.buttonText}>
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
  textPrimary: {
    color: Colors.primary,
  },
  mainContent: {
    marginTop: 48,
  },
  textCenter: {
    textAlign: "center",
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
    marginTop: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  ingredientRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ingredientName: {
    flex: 1,
    color: Colors.body,
  },
  quantityInput: {
    width: "30%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.body,
    paddingVertical: 0,
    fontSize: 12,
    color: Colors.body,
  },
  buttonSubmit: {
    marginHorizontal: 40,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});
