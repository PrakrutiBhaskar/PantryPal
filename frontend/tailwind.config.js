/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {backgroundImage: {"pantry-bg": "url('/src/assets/background.jpg')",},
  },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light", 
      "dark", 
      "retro"   
    ],
  },
};
