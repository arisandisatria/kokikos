import { Colors } from "@/constants/theme";
import ThemeText from "@/src/components/ui/ThemeText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const router = useRouter()
  const [isSecured, setIsSecured] = useState(true)
  
  return (
    <View style={styles.container}>
      <ThemeText type="title" size="lg" style={styles.titleText}>Selamat Datang di <ThemeText type="title" size="lg" style={{color: Colors.primary,}}>Kokikos!</ThemeText></ThemeText>

      <View style={styles.subtitleText}>
        <ThemeText type="subtitle">Masuk ke akun lama</ThemeText>
        <ThemeText type="caption" size="xsm">Ayo login lagi dan bikin masakan kerenmu sendiri!</ThemeText>
      </View>

      <View style={[styles.card, styles.inputBar]}>
        <Ionicons name="person-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Email" autoCapitalize="none"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Password" autoCapitalize="none" secureTextEntry={isSecured}/>
        <TouchableOpacity onPress={() => setIsSecured(!isSecured)}>
          <Ionicons name={isSecured ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.buttonSubmit, {
          backgroundColor: Colors.primary
              // backgroundColor: !loading ? Colors.primary : Colors.muted,
        }]}
        // onPress={handleSearchRecipe}
        // disabled={loading}
      >
        {/* {loading && (
          <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8,}} />
        )} */}
        
        <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
          {/* {loading ? "Mencari Resep..." : "Cari Resep"} */}
          Masuk
        </ThemeText>
      </TouchableOpacity>

      <ThemeText size="xsm">Belum punya akun? <ThemeText onPress={() => router.replace("/auth/SignUp")} size="xsm" style={{color: Colors.primary}}>Klik disini</ThemeText></ThemeText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginHorizontal: 16,
      marginTop: StatusBar.currentHeight || 40,
      alignItems: "center"
  },
  titleText: {
    marginTop: 44,
    marginBottom: 24
  },
  subtitleText: {
    alignItems: "center",
    marginBottom: 30
  },
  textInput: {
    fontFamily: "os-regular",
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    color: Colors.body,
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
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  icon: {
    marginLeft: 4,
    marginRight: 8
  },
  buttonSubmit: {
    marginHorizontal: 40,
    marginTop: 34,
    marginBottom: 30,
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
  },
})
