import { Colors } from "@/constants/theme"
import { UserDetailContext } from "@/context/UserDetailContext"
import ThemeText from "@/src/components/ui/ThemeText"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"
import { useContext } from "react"
import { Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

export default function EditProfile() {
  const router = useRouter()
  const context = useContext(UserDetailContext)

  if (!context) {
    return null
  }
  
  const { userDetail, setUserDetail } = context;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
        <ThemeText type="title" size="lg">Edit Profil</ThemeText>
      </View>

      <View style={styles.subtitleText}>
        <ThemeText type="subtitle">Edit informasi akun</ThemeText>
        <ThemeText type="caption" size="xsm">Jangan lupa jaga makan dan jaga akun anda!</ThemeText>
      </View>

      <View style={[styles.card, styles.inputBar]}>
        <Ionicons name="mail-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userDetail?.name} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Nama Lengkap"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="person-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userDetail?.email} style={styles.textInput} keyboardType="email-address" placeholderTextColor={Colors.muted} placeholder="Email" autoCapitalize="none"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="call-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userDetail?.phone_number} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Nomor Telfon" autoCapitalize="none" keyboardType="phone-pad"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Password Baru" autoCapitalize="none" secureTextEntry={true}/>
        <TouchableOpacity>
          <Ionicons name="eye-outline" size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Konfirmasi Password" autoCapitalize="none" secureTextEntry={true}/>
        <TouchableOpacity>
          <Ionicons name="eye-outline" size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.buttonSubmit, {
          backgroundColor: Colors.primary
        }]}
      
      >
        {/* {loading && (
          <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8,}} />
        )} */}
        
        <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
          {/* {loading ? "Membuat Akun..." : "Buat Akun"} */}
          Simpan Akun
        </ThemeText>
      </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    left: 0,
    zIndex: 10,
  },
  subtitleText: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 30
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
  textInput: {
    fontFamily: "os-regular",
    marginLeft: 4,
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontSize: 12,
    color: Colors.body,
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
  icon: {
    marginLeft: 4,
    marginRight: 8
  },
})