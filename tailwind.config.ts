import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blueMist: "var(--blue-mist)",
        blueSoft: "var(--blue-soft)",
        borderSoft: "var(--border-soft)",
        inkSoft: "var(--ink-soft)",
        cardBg: "var(--card-bg)",
        cardBorder: "var(--card-border)",
        accent: "var(--accent)",
        accentLight: "var(--accent-light)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        whisper: "0 18px 50px rgba(105, 137, 182, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
