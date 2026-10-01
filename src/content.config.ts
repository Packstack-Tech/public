import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const reviews = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/reviews" }),
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
    updated_at: z.string().nullable().optional(),
    description: z.string(),
    // Version comparison rows rendered by <VariantTable> — written by
    // workshop/catalog_reviews from the catalog (weight-bearing versions only).
    variants: z
      .array(
        z.object({
          name: z.string(),
          weight_grams: z.number().nullable(),
          image_url: z.string().nullable().optional(),
        }),
      )
      .default([]),
    // Catalog products this page covers and their version labels (pipeline bookkeeping).
    covers: z
      .array(z.object({ id: z.number(), label: z.string().nullable() }))
      .default([]),
  }),
})

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published_at: z.string(),
    image: z.string().nullable(),
    image_alt: z.string().nullable(),
  }),
})

export const collections = { reviews, articles }
