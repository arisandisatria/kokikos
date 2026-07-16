import { Colors } from "@/constants/theme";
import { RecipeResultCardProps } from "@/src/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import ThemeText from "../ui/ThemeText";

function RecipeResultCard({
  isInResultPage = true,
  recipe_name,
  estimated_time,
  budget,
  ingredient_match,
  ingredient_shortage,
  onPress
}: RecipeResultCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.cardContainer, {
      height: isInResultPage ? 140 : 180,
      borderRadius: isInResultPage ? 26 : 16,
      justifyContent: isInResultPage ? "space-around" : "center",
      flexDirection: isInResultPage ? "row" : "column",
    }]}>
      <Image
        source={require("../../../assets/images/placeholder.png")}
        style={{
          width: isInResultPage ? "33.33%" : "50%",
          height: isInResultPage ? "100%" : "50%",
          borderBottomLeftRadius: isInResultPage ? 24 : 0,
          borderTopLeftRadius: isInResultPage ? 24 : 0,
          marginTop:  isInResultPage ? 0 : 8
        }}
        resizeMode="cover"
      />

      <View style={[styles.contentContainer, {
        width: isInResultPage ? "65%" : '100%',
        paddingLeft: isInResultPage ? 8 : 0,
            alignItems: isInResultPage ? "flex-start" : "center"
      }]} >
        <ThemeText type="subtitle" size="sm" style={{width: isInResultPage ? "75%" : "100%", textAlign: !isInResultPage ? "center" : "left"}}>{recipe_name}</ThemeText>

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

        {
          isInResultPage ?
          <ThemeText size="xsm" style={{marginTop: 6,}}>
            Kurang: {ingredient_shortage}
          </ThemeText> : null
        }
      </View>

        {
          isInResultPage ?
          <View style={styles.badgeContainer}>
            <ThemeText type="subtitle" size="xsm" style={{color: "#FFFFFF",}}>
              {ingredient_match}%
            </ThemeText>
          </View> : null
        }
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    alignItems: "center",
    width: "100%",
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
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
  contentContainer: {
    paddingVertical: 8,

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