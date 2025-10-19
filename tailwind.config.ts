import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        screens: {
          lg: '1000px', // Custom max-width for large screens
        },
      },
      colors: {
        primary: {
          light: '#00c853',
          dark: '#01BC7F',
        },
        secondary: {
          main: '#01BC7F',
        },
        customGray: {
          main: '#b5c1d8',
        },
        customDark: {
          main: "#0d0d12"
        }
        // Add more custom colors here
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
export default config;
