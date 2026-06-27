/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        panel: "#12182b",
        cyan: "#38bdf8",
        indigoGlow: "#6366f1",
        mint: "#2dd4bf"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(56, 189, 248, 0.16)"
      }
    }
  },
  plugins: []
};
