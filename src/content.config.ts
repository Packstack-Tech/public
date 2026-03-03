import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reviews" }),
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    product_name: z.string(),
    catalog_product_id: z.number(),
    category: z.string(),
    weight_grams: z.number().nullable(),
    product_url: z.string().nullable(),
    image_url: z.string().nullable(),
    rating: z.number().nullable(),
    published_at: z.string(),
    description: z.string(),
  }),
})

export const collections = { reviews }
