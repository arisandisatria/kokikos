import { ThemedTextProps } from "@/src/types";
import clsx, { ClassValue } from "clsx";
import { Text } from "react-native";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-xsm", "text-sm", "text-base", "text-lg"],
      "text-color": [
        "text-primary",
        "text-secondary",
        "text-background",
        "text-heading",
        "text-body",
        "text-muted",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export default function ThemeText({
  className,
  size = "base",
  type = "default",
  ...props
}: ThemedTextProps) {
  const typeClasses = {
    caption: "font-os-regular text-muted",
    default: "font-os-regular text-body",
    subtitle: "font-os-semibold text-heading",
    title: "font-os-bold text-heading",
  };

  const sizeClasses = {
    xsm: "text-xsm",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  };

  const finalClass = cn(typeClasses[type], sizeClasses[size], className);

  return <Text className={finalClass} {...props} />;
}
