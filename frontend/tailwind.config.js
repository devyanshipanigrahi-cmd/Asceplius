/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: "#121214",
        charcoal: "#1c1c1f",
        cyanHighlight: "#06b6d4",
        emeraldHealthy: "#10b981",
        amberWarning: "#f59e0b",
        redCritical: "#ef4444",
      }
    },
  },
  plugins: [],
}
