// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Vite scans your src
  ],
  theme: {
    extend: {
      screens: {
        xs: { max: "639px" },   // smaller than sm (640px)
      },
    },
  },
  plugins: [],
};
