import { Colors } from "@/constants/theme"
import { UserDetailContext } from "@/context/UserDetailContext"
import ThemeText from "@/src/components/ui/ThemeText"
import { supabase } from "@/utils/supabase"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"
import { useContext, useState } from "react"
import { ActivityIndicator, Alert, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

export default function EditProfile() {
  const router = useRouter()
  const context = useContext(UserDetailContext)
  
  if (!context) {
    return null
  }
  
  const { userDetail, setUserDetail } = context;
  const [userAccount, setUserAccount] = useState({
    name: userDetail?.name || "",
    email: userDetail?.email || "",
    phone_number: userDetail?.phone_number || "",
    password: "",
    confirm_password: ""
  })
  const [loading, setLoading] = useState(false)
  const [isSecured, setIsSecured] = useState(true)
  const [isConfirmSecured, setIsConfirmSecured] = useState(true)

  async function handleEditProfile() {
    const fullname = userAccount?.name?.trim() || "";
    const email = userAccount?.email?.trim() || "";
    const phone = userAccount?.phone_number?.trim() || "";
    const password = userAccount?.password || "";
    const confirmPassword = userAccount?.confirm_password || "";

    if (!fullname || !email || !phone) {
      Alert.alert("Perhatian", "Semua kolom wajib diisi!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Format Email Salah", "Silakan masukkan alamat email yang valid!");
      return false;
    }

    const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert(
        "Nomor Telepon Salah", 
        "Masukkan nomor HP Indonesia yang valid (contoh: 08123456789)!"
      );
      return false;
    }

    if (password) {
      if (password.length < 6) {
        Alert.alert("Password Lemah", "Password harus memiliki minimal 6 karakter!");
        return false;
      }

      if (password !== confirmPassword) {
        Alert.alert("Perhatian", "Password dan Konfirmasi Password tidak sama!");
        return false;
      }
    }
    
    try {
      setLoading(true)

      const updateData: any = { email: email }

      if (password) {
        updateData.password = password
      }

      const { data: authData, error: authError } = await supabase.auth.updateUser(updateData)

      if (authError) {
        console.error("Gagal update data user:", authError);
        Alert.alert("Gagal update data user", authError.message);
        return;
      }

      const userId = authData?.user?.id || userDetail?.id;

      if (!userId) {
        console.error("ID User tidak ditemukan di auth maupun context");
        Alert.alert("Gagal", "Sesi user tidak valid.");
        setLoading(false);
        return;
      }

      const { error: dbError } = await supabase
        .from('profiles') 
        .update({ 
          name: fullname,
          phone_number: phone 
        })
        .eq('id', userId)

      if (dbError) {
        console.error("Gagal update data user:", dbError);
        return;
      }

      setUserDetail({
        id: userId,
        name: fullname,
        email: email,
        phone_number: phone || undefined,
      });

      Alert.alert("Sukses", "Profil Anda berhasil diperbarui!", [
        { text: "OK", onPress: () => router.back() }
      ])
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
      Alert.alert("Gagal!", "Terjadi kesalahan pada server!");
    } finally {
      setLoading(false)
    }
  }

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
        <TextInput value={userAccount.name} onChangeText={(value) => setUserAccount(prev => ({...prev, name: value}))} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Nama Lengkap" editable={!loading}/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="person-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userAccount.email} onChangeText={(value) => setUserAccount(prev => ({...prev, email: value}))} style={styles.textInput} keyboardType="email-address" placeholderTextColor={Colors.muted} placeholder="Email" autoCapitalize="none" editable={!loading}/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="call-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userAccount.phone_number} onChangeText={(value) => setUserAccount(prev => ({...prev, phone_number: value}))} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Nomor Telfon" autoCapitalize="none" keyboardType="phone-pad" editable={!loading}/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput style={styles.textInput} onChangeText={(value) => setUserAccount(prev => ({...prev, password: value}))} placeholderTextColor={Colors.muted} placeholder="Password Baru" autoCapitalize="none" secureTextEntry={isSecured ? true : false} editable={!loading}/>
        <TouchableOpacity onPress={() => setIsSecured(!isSecured)}>
          <Ionicons name={isSecured ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput style={styles.textInput} onChangeText={(value) => setUserAccount(prev => ({...prev, confirm_password: value}))} placeholderTextColor={Colors.muted} placeholder="Konfirmasi Password" autoCapitalize="none" secureTextEntry={isConfirmSecured ? true : false} editable={!loading}/>
        <TouchableOpacity onPress={() => setIsConfirmSecured(!isConfirmSecured)}>
          <Ionicons name={isConfirmSecured ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleEditProfile}
        disabled={loading}
        style={[styles.buttonSubmit, {
          backgroundColor: !loading ? Colors.primary : Colors.muted,
        }]}
      
      >
        {loading && (
          <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8}} />
        )}
        
        <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
          {loading ? "Menyimpan Akun..." : "Simpan Akun"}
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