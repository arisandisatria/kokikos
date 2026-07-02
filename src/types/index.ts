import { TextProps } from "react-native";

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

export interface ThemedTextProps extends TextProps {
  type?: "default" | "title" | "caption" | "subtitle";
  size?: "xsm" | "sm" | "base" | "lg";
}

export interface ThemedTextInputProps extends TextProps {
  type?: "default" | "password";
}

export interface RecipeResultCardProps {
  recipe_name: string,
  estimated_time: number,
  budget: number,
  ingredient_match: number,
  ingredient_shortage: string,
  onPress?: () => void;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
}