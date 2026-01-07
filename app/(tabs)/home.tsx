import ThemeText from "@/src/components/ui/ThemeText";
import { Ingredient } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

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
    <View className="mx-4 mt-10 flex-1">
      <View className="flex flex-row items-center justify-between">
        <ThemeText type="title">
          Halo,{" "}
          <ThemeText type="title" className="text-primary">
            Sandi
          </ThemeText>
          !
        </ThemeText>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={50} color="black" />
        </TouchableOpacity>
      </View>

      <View className="mt-12">
        <ThemeText type="title" className="text-center">
          Lagi laper? Ada bahan apa nih?
        </ThemeText>

        <View
          className="mx-12 mt-7 h-14 flex-row items-center justify-between rounded-3xl bg-white px-2"
          style={{
            // --- KHUSUS IOS ---
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.05,
            shadowRadius: 7,

            // --- KHUSUS ANDROID ---
            elevation: 2,
          }}
        >
          <TextInput
            className="ml-1 h-full flex-1 rounded-3xl bg-white font-os-regular text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
            placeholder="telur, sawi, tempe..."
            value={ingredient}
            onChangeText={setIngredient}
            onSubmitEditing={handleAddIngredient}
          />
          <TouchableOpacity>
            <Ionicons
              name="add-circle"
              size={32}
              color="#2A9D8F"
              onPress={handleAddIngredient}
            />
          </TouchableOpacity>
        </View>

        <View
          className="min-h-1/2 mx-12 mt-7 rounded-3xl bg-white p-4"
          style={{
            // --- KHUSUS IOS ---
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.05,
            shadowRadius: 7,

            // --- KHUSUS ANDROID ---
            elevation: 2,
          }}
        >
          <ThemeText size="sm" type="title">
            Bahan-bahanmu:
          </ThemeText>
          {ingredientList.length == 0 ? (
            <View className="mt-8 items-center justify-center opacity-30">
              <Ionicons name="basket-outline" size={40} color="black" />
              <ThemeText size="sm" type="caption" className="text-center">
                Keranjang masih kosong nih
              </ThemeText>
            </View>
          ) : (
            ingredientList.map((item) => (
              <View
                key={item.id}
                className="mt-3 flex flex-row items-center gap-1"
              >
                <ThemeText size="sm" className="flex-1 font-os-regular">
                  {item.name}
                </ThemeText>
                <TextInput
                  className="w-[30%] border-b-[1px] border-b-[#9CA3AF] py-0 font-os-regular text-[12px] text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  placeholder="2 potong"
                  value={item.quantity}
                  onChangeText={(text) =>
                    handleUpdateIngredientQuantity(text, item.id)
                  }
                />
                <TouchableOpacity>
                  <Ionicons
                    name="close-sharp"
                    size={32}
                    color="#FF383C"
                    onPress={() => handleRemoveIngredient(item.id)}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {ingredientList.length > 0 && (
          <TouchableOpacity
            className="mt-7 rounded-2xl bg-primary py-3"
            onPress={() => router.push("/recipe-result")}
          >
            <ThemeText
              size="base"
              type="title"
              className="text-center text-white"
            >
              Cari Resep
            </ThemeText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
