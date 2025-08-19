/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  safelist: [
  { pattern: /(bg|text|border)-\[#(EE701D|E05816|F29145|F7B87A|D8DBDF)\]/ },
],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
