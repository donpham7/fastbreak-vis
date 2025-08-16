/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#121212ff",
        },
        primary: {
          DEFAULT: "#000fe1ff", // red
        },
        surface_2: {
          DEFAULT: "#2f2f2fff", // dark gray
        },
        text: {
          DEFAULT: "#E0E0E0", // light gray
        },
      },
    },
  },
  plugins: [],
};
