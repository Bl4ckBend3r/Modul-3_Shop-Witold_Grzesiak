/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "sm:grid-cols-2",
    "md:grid-cols-2",
    "md:grid-cols-4",
    "lg:grid-cols-2",
    "lg:grid-cols-4",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          orange: "#EE701D",
          orangeHover: "#E05816",
          orangeActive: "#F29145",
          orangeDisabled: "#F7B87A",
        },
      },
    },
  },
  plugins: [],
};
