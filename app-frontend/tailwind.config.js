/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specifica dove NativeWind deve cercare le classi CSS
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Qui inserirai i colori che ti darà il tuo partner
        primary: "#2D5A27", 
      },
    },
  },
  plugins: [],
};