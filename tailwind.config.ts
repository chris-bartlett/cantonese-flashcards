import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#c41230",
          hover: "#a80f28",
          gold: "#c9a84c",
          "gold-hover": "#b08a3e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
