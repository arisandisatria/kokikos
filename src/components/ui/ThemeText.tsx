import { ThemedTextProps } from "@/src/types";
import { StyleSheet, Text } from "react-native";
import { Colors, Fonts, FontSizes } from "../../../constants/theme";

export default function ThemeText({
  style,
  size = "base",
  type = "default",
  ...props
}: ThemedTextProps) {
  const finalStyle = [styles[type], styles[size], style];

  return <Text style={finalStyle} {...props} />;
}

const styles = StyleSheet.create({
  caption: {
    fontFamily: Fonts.regular,
    color: Colors.muted || "#64748b",
  },
  default: {
    fontFamily: Fonts.regular,
    color: Colors.body || "#334155",
  },
  subtitle: {
    fontFamily: Fonts.semibold,
    color: Colors.heading || "#0f172a",
  },
  title: {
    fontFamily: Fonts.bold,
    color: Colors.heading || "#0f172a",
  },

  xsm: {
    fontSize: FontSizes.xsm,
  },
  sm: {
    fontSize: FontSizes.sm,
  },
  base: {
    fontSize: FontSizes.base,
  },
  lg: {
    fontSize: FontSizes.lg,
  },
});
