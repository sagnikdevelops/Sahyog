import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "#065F46",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Sahyog Theme Colors (#047857, #34D399, #F9FAF7, #FFFFFF, #142D52, #1F2937)
        brand: {
          emerald: "#047857",
          mint: "#34D399",
          canvas: "#F9FAF7",
          white: "#FFFFFF",
          navy: "#142D52",
          charcoal: "#1F2937",
        },
        // Functional Colors from Sahyog guidelines
        functional: {
          success: "#047857",
          warning: "#D97706",
          error: "#DC2626",
          info: "#142D52",
        },
        sahyog: {
          black: "#142D52",
          hover: "#0E203B",
          navy: "#142D52",
          emerald: "#047857",
          mint: "#34D399",
          bg: "#FFFFFF",
          secBg: "#F9FAF7",
          card: "#FFFFFF",
          border: "#E5E7EB",
          mutedBorder: "#D1D5DB",
          text: "#1F2937",
          secText: "#4B5563",
          mutedText: "#6B7280",
          disabledText: "#9CA3AF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;