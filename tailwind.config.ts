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
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        borderSoft: "var(--border)",
        card: "var(--card)",
        cardBorder: "var(--card-border)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        accent: "var(--accent)",
        accentHover: "var(--accent-hover)",
        accentWarm: "var(--accent-warm)",
        headerBg: "var(--header-bg)",
        headerBorder: "var(--header-border)",
        navBg: "var(--nav-bg)",
        announcementBg: "var(--announcement-bg)",
        // 保留旧名兼容
        background: "var(--bg)",
        foreground: "var(--fg)",
        blueMist: "var(--surface)",
        blueSoft: "var(--surface-2)",
        inkSoft: "var(--muted)"
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
