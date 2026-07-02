import { Colors } from "@/constants/theme";
import { UserDetailContext } from "@/context/UserDetailContext";
import ThemeText from "@/src/components/ui/ThemeText";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Crypto from 'expo-crypto';
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ActivityIndicator, Alert, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const router = useRouter()
  const [isSecured, setIsSecured] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const context = useContext(UserDetailContext);

  if (!context) {
    throw new Error("fetchUserProfile harus digunakan di dalam UserDetailContext.Provider");
  }

  const { userDetail, setUserDetail } = context;
  
  const fetchUserProfile = async () => {
    try {
      const {data: { user }, error: authError} = await supabase.auth.getUser()
  
      if (authError || !user) {
        console.error("User belum login atau session habis:", authError);
        return;
      }
    
      const {data: profile, error: profileError} = await supabase.from("profiles").select("id, name, email, phone_number").eq("id", user.id).single()
  
      if (profileError) {
        console.error("Gagal query ke tabel profiles:", profileError);
        return;
      }
  
      if (profile) {
        setUserDetail({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone_number: profile.phone_number || undefined
        });
      }
    }
    catch(error) {
      console.error("Terjadi kesalahan ambil data profil:", error);
    }
  }

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Perhatian", "Semua kolom wajib diisi!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Format Email Salah", "Silakan masukkan alamat email yang valid!");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Password Salah", "Password harus memiliki minimal 6 karakter!");
      return false;
    }

    try {
      setLoading(true)

      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password 
      );

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: hashedPassword,
      });

      if (error) {
        Alert.alert("Gagal Masuk", error.message);
        return;
      }

      if (data.session) {
        await fetchUserProfile()
        Alert.alert("Berhasil", "Selamat datang kembali!");
        router.replace("/home"); 
      }
      
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
        <ThemeText type="subtitle">Masuk ke akun lama</ThemeText>
        <ThemeText type="caption" size="xsm">Ayo login lagi dan bikin masakan kerenmu sendiri!</ThemeText>
      </View>

      <View style={[styles.card, styles.inputBar]}>
        <Ionicons name="person-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={email} onChangeText={(value) => setEmail(value)} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Email" keyboardType="email-address" autoCapitalize="none"/>
      </View>

      <View style={[styles.card, styles.inputBar, {marginTop: 12}]}>
        <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} style={styles.icon}/>
        <TextInput value={password} onChangeText={(value) => setPassword(value)} style={styles.textInput} placeholderTextColor={Colors.muted} placeholder="Password" autoCapitalize="none" secureTextEntry={isSecured}/>
        <TouchableOpacity onPress={() => setIsSecured(!isSecured)}>
          <Ionicons name={isSecured ? "eye-outline" : "eye-off-outline"} size={24} color={Colors.muted} style={styles.icon}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.buttonSubmit, {
              backgroundColor: !loading ? Colors.primary : Colors.muted,
        }]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading && (
          <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8,}} />
        )}
        
        <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
          {loading ? "Sedang Masuk..." : "Masuk"}
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
