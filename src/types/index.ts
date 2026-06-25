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

export interface RecipeResultCardProps {
  productName: string;
  estimatedTime: string;
  estimatedPrice: string;
  insufficientIngridients: string;
  matchPercentage: number;
  onPress?: () => void;
}
