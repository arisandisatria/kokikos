import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

export default function Home() {
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
        <Text className="font-os-bold text-primary">
          Halo, <Text className="text-heading">Sandi</Text>!
        </Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={50} color="black" />
        </TouchableOpacity>
      </View>

      <View className="mt-12">
        <Text className="text-center font-os-bold">
          Lagi laper? Ada bahan apa nih?
        </Text>

        <View
          className={`
          h-15 mx-12 mt-7 flex-row items-center justify-between rounded-3xl bg-white px-2
        `}
        >
          <TextInput
            className="h-full flex-1 font-os-regular text-[12px] text-base text-gray-800"
            placeholderTextColor="#9CA3AF"
            placeholder="telur, sawi, tempe..."
            value={ingredient}
            onChangeText={setIngredient}
            onSubmitEditing={handleAddIngredient}
          />
          <TouchableOpacity>
            <Ionicons
              name="add-sharp"
              size={32}
              color="#2A9D8F"
              onPress={handleAddIngredient}
            />
          </TouchableOpacity>
        </View>

        <View className="min-h-1/2 mx-12 mt-7 rounded-3xl bg-white p-4">
          <Text className="font-os-bold text-[12px]">Bahan-bahanmu:</Text>
          {ingredientList.length == 0 ? (
            <View className="mt-8 items-center justify-center opacity-30">
              <Ionicons name="basket-outline" size={40} color="black" />
              <Text className="text-center font-os-regular text-sm">
                Keranjang masih kosong nih
              </Text>
            </View>
          ) : (
            ingredientList.map((item) => (
              <View
                key={item.id}
                className="mt-3 flex flex-row items-center gap-1"
              >
                <Text className="flex-1 font-os-regular text-[12px]">
                  {item.name}
                </Text>
                <TextInput
                  className="w-[30%] border-b-2 border-b-[#9CA3AF] py-0 font-os-regular text-[12px] text-base text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  placeholder="2 potong"
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
          <TouchableOpacity className="mt-7 rounded-2xl bg-primary py-3">
            <Text className="text-center font-os-bold text-white">
              Cari Resep
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
