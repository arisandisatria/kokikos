import { Colors } from '@/constants/theme';
import { UserDetailContext } from '@/context/UserDetailContext';
import ThemeText from '@/src/components/ui/ThemeText';
import { supabase } from '@/utils/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Image, Modal, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function index() {
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false);
  const context = useContext(UserDetailContext);

  if (!context) {
    return null;
  }

  const { userDetail, setUserDetail } = context;

  const firstName = userDetail?.name ? userDetail?.name.trim().split(" ")[0] : "User Keren";

  async function handleLogout() {
    try {
      setModalVisible(false)

      const { error } = await supabase.auth.signOut();

      if (error) {
        Alert.alert("Gagal Keluar:", error.message);
        return;
      }
      
      setUserDetail(null)

      router.replace("/auth/SignIn")
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
      Alert.alert("Gagal!", "Terjadi kesalahan pada server!");
    } finally {
      setModalVisible(false)
    }
  }
  
  return (
    <View style={styles.container}>
      <ThemeText type="title" size="lg" style={styles.header}>Profil Anda</ThemeText>

      <View style={styles.imageContainer}>
        <Image source={require("../../../assets/images/avatar.png")} style={styles.avatar} resizeMode='cover'/>
      </View>

      <View style={styles.profileInfo}>
        <ThemeText type='subtitle'>{firstName}</ThemeText>
        <ThemeText type='caption' size='xsm'>{userDetail?.email}</ThemeText>
      </View>

      <View style={styles.itemContainer}>
        <View style={styles.innerItem}>
          <TouchableOpacity onPress={() => router.push("/profile/edit-profile")}>
            <Ionicons name="pencil-outline" size={32} color={Colors.primary} style={styles.itemIcon}/>
          </TouchableOpacity>
          <ThemeText style={{marginTop: 4, textAlign: "center"}} size='sm'>Edit Profile</ThemeText>
        </View>
        <View style={styles.innerItem}>
          <TouchableOpacity onPress={() => router.push("/profile/saved-recipe")}>
            <Ionicons name="bookmark-outline" size={32} color={Colors.primary} style={styles.itemIcon}/>
          </TouchableOpacity>
          <ThemeText style={{marginTop: 4, textAlign: "center"}} size='sm'>Resep Tersimpan</ThemeText>
        </View>
      </View>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.buttonLogout}>
        <ThemeText size="base" type="title" style={{ color: "#FFFFFF",}}>
          Logout
        </ThemeText>
      </TouchableOpacity>

       <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemeText type='subtitle' size='lg'>Konfirmasi Keluar</ThemeText>
            <ThemeText style={styles.modalSubtitle}>Apakah Anda yakin ingin keluar dari aplikasi?</ThemeText>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCancel]} 
                onPress={() => setModalVisible(false)}
              >
                <ThemeText size='sm' style={styles.textCancel}>Batal</ThemeText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.btn, styles.btnConfirm]} 
              >
                <ThemeText size='sm' style={styles.textConfirm}>Keluar</ThemeText>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: StatusBar.currentHeight || 40,
    position: 'relative'
  },
   header: {
    marginTop: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
    overflow: "hidden",
    borderRadius: 75
  },
  avatar: {
    borderRadius: 75,
    ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.05,
            shadowRadius: 7,
          },
          android: {
            elevation: 5,
          },
        }),
  },
  profileInfo: {
    marginTop: 16,
    alignItems: "center",
  },
  itemContainer:{
    marginTop: 28,
    flexDirection: "row",
    justifyContent: "center",
    gap: 60
  },
  itemIcon: {
    alignSelf: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: 18,
    borderRadius: 16
  },
  innerItem: {
    alignItems: 'center',
    maxWidth: 80
  },
  buttonLogout: {
    position: "absolute",
    bottom: 100,
    right: 0,
    left: 0,
    backgroundColor: Colors.danger,
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 16
  },
   actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#f0f0f0',
  },
  btnConfirm: {
    backgroundColor: '#ff4d4d',
  },
  textCancel: {
    color: '#333',
    fontWeight: '600',
  },
  textConfirm: {
    color: '#fff',
    fontWeight: '600',
  },
})