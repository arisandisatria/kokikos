import { Colors } from "@/constants/theme";
import { RecipeResultCardProps } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import ThemeText from "../ui/ThemeText";

function RecipeResultCard({
  recipe_name,
  estimated_time,
  budget,
  ingredient_match,
  ingredient_shortage,
  onPress
}: RecipeResultCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardContainer}>
      <Image
        source={require("../../../assets/images/placeholder.png")}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.contentContainer} >
        <ThemeText type="subtitle" size="sm" style={{width: "75%"}}>{recipe_name}</ThemeText>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={17} color={Colors.secondary} />
            <ThemeText size="xsm" type="caption">
              {estimated_time} menit
            </ThemeText>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={17} color={Colors.secondary} />
            <ThemeText size="xsm" type="caption">
              {budget}
            </ThemeText>
          </View>
        </View>

        <ThemeText size="xsm" style={{marginTop: 6,}}>
          Kurang: {ingredient_shortage}
        </ThemeText>
      </View>

      <View style={styles.badgeContainer}>
        <ThemeText type="subtitle" size="xsm" style={{color: "#FFFFFF",}}>
          {ingredient_match}%
        </ThemeText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    height: 140,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    
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
  },
  image: {
    width: "33.33%",
    height: "100%",
    borderBottomLeftRadius: 24,
    borderTopLeftRadius: 24,
  },
  contentContainer: {
    width: "65%",
    paddingVertical: 8,
    paddingLeft: 8,
  },
  infoRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  divider: {
    height: 20,
    width: 2,
    backgroundColor: Colors.muted || "#9CA3AF",
    marginVertical: 6,
  },
  badgeContainer: {
    position: "absolute",
    right: 15,
    top: 15,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#22c55e",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default RecipeResultCard;