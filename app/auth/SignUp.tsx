import { Colors } from "@/constants/theme";
import ThemeText from "@/src/components/ui/ThemeText";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Crypto from 'expo-crypto';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const router = useRouter()
  const [isSecured, setIsSecured] = useState(true)
  const [isConfirmSecured, setIsConfirmSecured] = useState(true)
  const [userAccount, setUserAccount] = useState({
    fullname: "",
    email: "",
    "phone_number": "",
    "password": "",
    "confirm_password": "",
  })
  const [loading, setLoading] = useState(false)

  async function handleSignUp() {
    const fullname = userAccount?.fullname?.trim() || "";
    const email = userAccount?.email?.trim() || "";
    const phone = userAccount?.phone_number?.trim() || "";
    const password = userAccount?.password || "";
    const confirmPassword = userAccount?.confirm_password || "";

    if (!fullname || !email || !phone || !password || !confirmPassword) {
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

    if (password.length < 6) {
      Alert.alert("Password Lemah", "Password harus memiliki minimal 6 karakter!");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Perhatian", "Password dan Konfirmasi Password tidak sama!");
      return false
    }

    try {
      setLoading(true)
      
      const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      userAccount.password
    );

      const {data: authData, error: authError} = await supabase.auth.signUp({
        email: userAccount.email.trim(),
        password: hashedPassword
      })

      if (authError) {
        Alert.alert("Gagal Buat Akun!", authError.message);
        return;
      }

      if (authData.user) {
        const {error: profileError} = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            name: userAccount.fullname.trim(),
            email: userAccount.email.trim(),
            phone_number: userAccount.phone_number.trim()
          }
        ])
        if (profileError) {
          console.error("Gagal membuat profil:", profileError)
          Alert.alert("Peringatan", "Akun berhasil dibuat, namun gagal menyimpan profil.");
        }
      }

      Alert.alert("Berhasil!", "Akun Anda berhasil dibuat. Silakan masuk!");

      router.replace("/auth/SignIn")

    } catch (error) {
      console.error("Terjadi kesalahan:", error)
      Alert.alert("Gagal!", "Terjadi kesalahan pada server!");
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <View style={styles.container}>
      <ThemeText type="title" size="lg" style={styles.titleText}>Selamat Datang di <ThemeText type="title" size="lg" style={{color: Colors.primary,}}>Kokikos!</ThemeText></ThemeText>

      <View style={styles.subtitleText}>
        <ThemeText type="subtitle">Buat akun baru</ThemeText>
        <ThemeText type="caption" size="xsm">Bikin makanan sendiri dengan mudah, siap?</ThemeText>
      </View>

      <View style={[styles.card, styles.inputBar]}>
        <Ionicons name="mail-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userAccount.fullname} onChangeText={(value) => setUserAccount(prev => ({...prev, fullname: value}))} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Nama Lengkap"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="person-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userAccount.email} keyboardType="email-address" onChangeText={(value) => setUserAccount(prev => ({...prev, email: value}))} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Email" autoCapitalize="none"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="call-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userAccount.phone_number} onChangeText={(value) => setUserAccount(prev => ({...prev, phone_number: value}))} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Nomor Telfon" autoCapitalize="none" keyboardType="phone-pad"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userAccount.password} onChangeText={(value) => setUserAccount(prev => ({...prev, password: value}))} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Password" autoCapitalize="none" secureTextEntry={isSecured}/>
        <TouchableOpacity onPress={() => setIsSecured(!isSecured)}>
          <Ionicons name={isSecured ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={userAccount.confirm_password} onChangeText={(value) => setUserAccount(prev => ({...prev, confirm_password: value}))} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Konfirmasi Password" autoCapitalize="none" secureTextEntry={isConfirmSecured}/>
        <TouchableOpacity onPress={() => setIsConfirmSecured(!isConfirmSecured)}>
          <Ionicons name={isConfirmSecured ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.buttonSubmit, {
          backgroundColor: !loading ? Colors.primary : Colors.muted,
        }]}
        onPress={() => handleSignUp()}
        disabled={loading}
      >
        {loading && (
          <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8,}} />
        )}
        
        <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
          {loading ? "Membuat Akun..." : "Buat Akun"}
          
        </ThemeText>
      </TouchableOpacity>

      <ThemeText size="xsm">Sudah punya akun? <ThemeText disabled={loading} onPress={() => router.replace("/auth/SignIn")} size="xsm" style={{color: Colors.primary}}>Klik disini</ThemeText></ThemeText>
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
