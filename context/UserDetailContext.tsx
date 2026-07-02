import { UserProfile } from "@/src/types";
import { createContext } from "react";

export type UserDetailContextType = {
  userDetail: UserProfile | null;
  setUserDetail: (detail: UserProfile | null) => void;
} | null;

export const UserDetailContext = createContext<UserDetailContextType>(null);