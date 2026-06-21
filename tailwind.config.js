/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "os-regular": ["OpenSans_400Regular"],
        "os-semibold": ["OpenSans_600SemiBold"],
        "os-bold": ["OpenSans_700Bold"],
      },
      fontSize: {
        xsm: "10px",
        sm: "12px",
        base: "14px",
        lg: "18px",
      },
      colors: {
        primary: "#FF6B35",
        secondary: "#2A9D8F",
        background: "#FAFAFA",
        heading: "#1F2937",
        body: "#4B5563",
        muted: "#9CA3AF",
        danger: "#FF383C",
      },
    },
  },
  plugins: [],
};
