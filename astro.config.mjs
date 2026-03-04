import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import vercel from "@astrojs/vercel"

export default defineConfig({
  site: "https://packstack.io",
  trailingSlash: "never",
  integrations: [react(), sitemap()],
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
})
