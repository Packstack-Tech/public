import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import vercel from "@astrojs/vercel"

export default defineConfig({
  site: "https://www.packstack.io",
  trailingSlash: "never",
  integrations: [react(), mdx(), sitemap()],
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
})
