import { Colors } from "@/constants/theme";
import { UserDetailContext } from "@/context/UserDetailContext";
import { UserProfile } from "@/src/types";
import { supabase } from "@/utils/supabase";
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [userDetail, setUserDetail] = useState<UserProfile | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const [fontsLoaded] = useFonts({
    "os-regular": OpenSans_400Regular,
    "os-semibold": OpenSans_600SemiBold,
    "os-bold": OpenSans_700Bold,
  });
  useFonts({
    "os-regular": OpenSans_400Regular,
    "os-semibold": OpenSans_600SemiBold,
    "os-bold": OpenSans_700Bold,
  });

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email, phone_number")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Gagal query ke tabel profiles:", profileError);
        return;
      }

      if (profile) {
        setUserDetail({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone_number: profile.phone_number || undefined,
        });
      }
    } catch (error) {
      console.error("Terjadi kesalahan ambil data profil:", error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setHasSession(!!session);
      
      if (session?.user) {
        // Jika sesi terdeteksi, langsung isi context dari database
        await fetchUserProfile(session.user.id);
      } else {
        // Jika logout, kosongkan context
        setUserDetail(null);
      }
      
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Proteksi Rute (Auth Guard)
  useEffect(() => {
    if (!isAuthReady) return;

    const firstSegment = segments[0] as string;
    const inAuthGroup = firstSegment === "auth";

    if (hasSession && inAuthGroup) {
      router.replace("/home");
    } else if (!hasSession && !inAuthGroup) {
      router.replace("/auth/SignIn");
    }
  }, [hasSession, segments, isAuthReady]);

  if (!isAuthReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#0f172a" }}
        edges={["bottom"]}
      >

        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          ></Stack>
        </UserDetailContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>

  );
}
