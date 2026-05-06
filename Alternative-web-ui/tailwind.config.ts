import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./services/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lyraBlue: {
          DEFAULT: "#0055ff",
          dark: "#0044cc",
        },
        // Editorial palette
        editorial: {
          cyan: "#00B4FF",      // electric blue hero
          navy: "#0E1A40",      // deep rich navy
          paper: "#F5F4F0",     // warm off-white
          mint: "#C5E8D8",      // soft pastel mint
          ink: "#000000",       // pure black
          "brand-blue": "#0070BA", // PayPal accent
        },
        slate: {
          950: "#020617",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Editorial display sizes
        "mega": ["clamp(72px, 11vw, 180px)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
        "huge": ["clamp(48px, 7vw, 120px)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "section": ["clamp(40px, 5.5vw, 96px)", { lineHeight: "1", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        pill: "999px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
