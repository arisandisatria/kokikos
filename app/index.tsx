import { Colors } from "@/constants/theme";
import { supabase } from "@/utils/supabase";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [userDetail, setUserDetail] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();
 const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setHasSession(!!session);
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;

    const firstSegment = segments[0] as string;
    const inAuthGroup = firstSegment === "auth";

    if (hasSession && inAuthGroup) {
      fetchUserProfile()
      router.replace("/home");
    } else if (!hasSession && !inAuthGroup) {
      router.replace("/auth/SignIn");
    }
  }, [hasSession, segments, isAuthReady]);

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
  

  if (!isAuthReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }


  // // Mengarahkan user dari "/" (root) langsung ke "/home"
  // // Ingat: folder (tabs) tidak ditulis di URL karena menggunakan tanda kurung
  // return <Redirect href="/auth/SignIn" />;
}
