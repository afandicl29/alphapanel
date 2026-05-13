/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        panel: {
          bg: "#dce6f2",
          surface: "#ffffff",
          "surface-muted": "#eef4fb",
          sidebar: "#0b3558",
          "sidebar-hover": "#0e4674",
          "sidebar-active": "#135a94",
          topbar: "#0d4378",
          border: "#9db7d4",
          accent: "#0d6efd",
          "accent-hover": "#0b5ed7",
          muted: "#4d6478",
          heading: "#0a2540",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        panel: "0 1px 3px rgba(11, 53, 88, 0.08)",
      },
    },
  },
  plugins: [],
};
