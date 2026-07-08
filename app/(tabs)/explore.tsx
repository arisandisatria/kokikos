import { Colors } from "@/constants/theme";
import RecipeResultCard from "@/src/components/features/RecipeResultCard";
import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function explore() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState("murah");

  const filters = [
    { id: "murah", label: "Termurah" },
    { id: "cepat", label: "Tercepat" },
  ];

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
                  isActive ? styles.textActive : styles.textInactive,
                ]}
              >
                {filter.label}
              </ThemeText>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ marginTop: 12, flexDirection: 'row', flexWrap: "wrap" }} 
        showsVerticalScrollIndicator={false}>
          <View style={{ width: '50%', padding: 4, marginBottom: 10 }}>
            <RecipeResultCard
              isInResultPage={false}
              recipe_name="Nasi Telur Pontianak"
              estimated_time={12}
              budget={1222}
              ingredient_match={30}
              ingredient_shortage=""
            />
          </View>
          <View style={{ width: '50%', padding: 4, marginBottom: 10 }}>
            <RecipeResultCard
              isInResultPage={false}
              recipe_name="Nasi Telur Pontianak"
              estimated_time={12}
              budget={1222}
              ingredient_match={30}
              ingredient_shortage=""
            />
          </View>
      </ScrollView>
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
})