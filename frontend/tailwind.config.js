/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                surface: {
                    DEFAULT: "#dededeff",
                },
                primary: {
                    DEFAULT: "#000fe1ff", // red
                },
                surface_2: {
                    DEFAULT: "#ffffffff", // dark gray
                },
                text: {
                    DEFAULT: "#2b2b2bff", // light gray
                },
            },
        },
    },
    plugins: [],
};
