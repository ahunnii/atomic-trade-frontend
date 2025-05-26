/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@atomic-trade/payments/dist/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Add any other custom colors used by your library
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
export default config;
