/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E5005A",
          redDark: "#B40049",
          blush: "#FFF0F6",
          green: "#63B34C",
          greenSoft: "#F4FBF1",
          dark: "#1F2937",
          gold: "#F59E0B",
          sand: "#FFF7ED",
        },
      },
      boxShadow: {
        card: "0 12px 32px rgba(229, 0, 90, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "brand-hero": "linear-gradient(135deg, rgba(229,0,90,0.98) 0%, rgba(180,0,73,0.96) 58%, rgba(99,179,76,0.92) 100%)",
      },
    },
  },
  plugins: [],
};
