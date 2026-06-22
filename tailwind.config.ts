import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        muted: "#6f6a60",
        paper: "#fbfaf7",
        line: "#e7e0d6",
        gold: "#b48a4a"
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "Segoe UI", "Arial", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(27, 22, 16, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
