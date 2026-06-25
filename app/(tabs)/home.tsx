import { Colors } from "@/constants/theme";
import ThemeText from "@/src/components/ui/ThemeText";
import { Ingredient } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

  function handleAddIngredient() {
    if (ingredient.trim() === "") {
      Alert.alert("Cuy!", "Tulis nama bahannya dulu dong.");
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemeText type="title" size="lg">
          Halo,{" "}
          <ThemeText type="title" size="lg" style={styles.textPrimary}>
            Sandi
          </ThemeText>
          !
        </ThemeText>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={50} color="black" />
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
            <Ionicons name="add-circle" size={32} color="#2A9D8F" />
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
            style={styles.buttonSubmit}
            onPress={() => router.push("/recipe-result")}
          >
            <ThemeText size="base" type="title" style={styles.buttonText}>
              Cari Resep
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
    fontFamily: "os-regular",
    flex: 1,
    color: Colors.body,
  },
  quantityInput: {
    fontFamily: "os-regular",
    width: "30%",
    borderBottomWidth: 1,
    borderBottomColor: Colors.body,
    paddingVertical: 0,
    fontSize: 12,
    color: Colors.body,
  },
  buttonSubmit: {
    backgroundColor: Colors.primary,
    marginHorizontal: 40,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 12,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
  },
});
