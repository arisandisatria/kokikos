import { Redirect } from "expo-router";

export default function Index() {
  // Mengarahkan user dari "/" (root) langsung ke "/home"
  // Ingat: folder (tabs) tidak ditulis di URL karena menggunakan tanda kurung
  return <Redirect href="/auth/SignIn" />;
}
