import { UserDetailContext } from "@/context/UserDetailContext";
import { Redirect } from "expo-router";
import { useContext } from "react";

export default function Index() {
  const context = useContext(UserDetailContext);

  if (!context) {
    return null;
  }

  const { userDetail, setUserDetail } = context;

  if (userDetail)  {
    return (
      <Redirect href="/home" />
    )
  } else {
    <Redirect href={"/auth/SignIn"}/>
  }
}
