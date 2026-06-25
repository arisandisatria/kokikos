import { Colors } from "@/constants/theme";
import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

function index() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("bahan-alat");

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
  const mockIngredients = ["Telur", "Ikan", "Nasi", "Bawang Putih", "Jahe"]
  const mockTools = ["Wajan", "Spatula", "Sendok", "Piring", "Pisau"]
  const mockSteps = ["Panaskan wajan", "Siram wajan", "Buang wajan", 'Beli di depan']

  let content;

  switch (selectedTab) {
    case "langkah":
      content = 
      <View style={styles.tabContent}>
        <ThemeText type="title" style={{ marginBottom: 8 }}>
            Langkah:
          </ThemeText>
          {mockSteps.map((step, index) => (
            <View key={index} style={styles.listItem}>
              <ThemeText style={styles.listItemText} type="subtitle" size="sm">
                {index + 1}. {step}
              </ThemeText>
            </View>
          ))}
      </View>
      break
    case "nutrisi":
      content = 
      <View style={{padding: 16}}>
        <View style={styles.nutritionCard}>
          <ThemeText size="sm" type="subtitle">Kalori</ThemeText>
          <ThemeText size="xsm" type="caption">130 kkal</ThemeText>

          <View>
            <ThemeText>25%</ThemeText>
          </View>
        </View>
      </View>
      break
    default:
      content = 
       <View style={styles.tabContent}>
        <ThemeText type="title" style={{ marginBottom: 8 }}>
            Bahan:
          </ThemeText>
          {mockIngredients.map((ingredient, index) => (
            <View key={index} style={styles.listItem}>
              <ThemeText style={styles.bullet}>{"\u2022"}</ThemeText>
              <ThemeText style={styles.listItemText} type="subtitle" size="sm">
                {ingredient}
              </ThemeText>
            </View>
          ))}

          <ThemeText type="title" style={{ marginTop: 12, marginBottom: 8 }}>
            Alat:
          </ThemeText>
          {mockTools.map((tool, index) => (
            <View key={index} style={styles.listItem}>
              <ThemeText style={styles.bullet}>{"\u2022"}</ThemeText>
              <ThemeText style={styles.listItemText} type="subtitle" size="sm">
                {tool}
              </ThemeText>
            </View>
          ))}
      </View>
      break
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/recipe-result")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
        <ThemeText type="title" size="lg">Detail Pencarian</ThemeText>
      </View>

        <View style={styles.imageContainer}>
          <Image source={require("../../assets/images/placeholder.png")} />
          <ThemeText type="title" size="lg" style={{ marginTop: 32 }}>
            Nasi Telur Pontianak
          </ThemeText>
        </View>

        <ThemeText size="sm" style={styles.description}>
          Nasi Telur Pontianak adalah hidangan nasi hangat dengan telur ceplok
          yang disiram saus kecap manis-asin gurih, seringkali dengan aroma ebi
          dan bawang putih.
        </ThemeText>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={17} color={Colors.secondary} />
            <ThemeText size="sm">10 menit</ThemeText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="star-outline" size={17} color={Colors.secondary} />
            <ThemeText size="sm">4.5</ThemeText>
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
        style={{flex: 1}} 
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
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 10,
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
    alignItems: "center"
  },
  tabButton: {
    width: "33.333%",
    paddingVertical: 18,
  },
  tabContent: {
    backgroundColor: "#fff",
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
  nutritionCard: {
    backgroundColor: "#fff",
    borderRadius: 16
  }
});

export default index;