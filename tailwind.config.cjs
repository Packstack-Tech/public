/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      primary: "#6a82fb",
      white: "#e5e5e8",
      softwhite: "#8096B6",
      label: "#64748b",
      surface: "#111622",
      border: "#1D2C42",
      background: "#030711",
    },
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
