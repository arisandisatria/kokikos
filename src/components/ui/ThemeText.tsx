import { ThemedTextProps } from "@/src/types";
import clsx, { ClassValue } from "clsx";
import React from "react";
import { Text } from "react-native";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ThemeText({
  className,
  size = "base",
  type = "default",
  ...props
}: ThemedTextProps) {
  let baseClass = "";

  if (type == "caption") baseClass += " font-os-regular text-muted";
  if (type == "default") baseClass += " font-os-regular text-body";
  if (type == "subtitle") baseClass += " font-os-semibold text-heading";
  if (type == "title") baseClass += " font-os-bold text-heading";

  if (size == "xsm") baseClass += " text-[10px]";
  if (size == "sm") baseClass += " text-[12px]";
  if (size == "base") baseClass += " text-[14px]";
  if (size == "lg") baseClass += " text-[16px]";

  const finalClass = cn(baseClass, className);

  return <Text className={`${finalClass} ${className}`} {...props} />;
}
