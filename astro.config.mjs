import { defineConfig } from "astro/config"
import node from "@astrojs/node"
import react from "@astrojs/react"

import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  adapter: node({ mode: "standalone" }),
})
