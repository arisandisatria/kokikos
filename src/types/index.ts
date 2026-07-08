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
  isInResultPage: boolean,
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

export interface NutritionItem {
  type: string;
  weight: string;
  percentage: string;
}

export interface RecipeDetail {
  id: string;
  recipe_name: string;
  description: string;
  estimated_time: string;
  budget: string;
  ingredients_and_tools: IngredientsAndToolsItem[];
  steps: string[];
  nutrition: NutritionItem;
  difficulty_rating: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Tool {
  name: string;
  quantity: string;
}

export interface IngredientsAndToolsItem {
  ingredients: Ingredient[];
  tools: Tool[];
}