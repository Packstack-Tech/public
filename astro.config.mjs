import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import vercel from "@astrojs/vercel"
import { existsSync, readFileSync } from "node:fs"

// Retired review URLs -> the one page per product that replaced them. Written by
// workshop/review_consolidation/build.py and workshop/catalog_reviews/run.py.
const reviewRedirectsFile = new URL("./src/data/review-redirects.json", import.meta.url)
const reviewRedirects = existsSync(reviewRedirectsFile)
  ? JSON.parse(readFileSync(reviewRedirectsFile, "utf-8"))
  : {}

export default defineConfig({
  site: "https://www.packstack.io",
  trailingSlash: "never",
  integrations: [react(), mdx(), sitemap()],
  output: "server",
  adapter: vercel(),
  // The "Footware" category (seed typo) was renamed to "Footwear" in Sept 2026.
  redirects: {
    "/reviews/footware": "/reviews/footwear",
    "/reviews/footware/[...slug]": "/reviews/footwear/[...slug]",
    ...reviewRedirects,
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
