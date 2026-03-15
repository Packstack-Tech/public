import { defineMiddleware } from "astro:middleware"
import { getCollection } from "astro:content"

const reviews = await getCollection("reviews")
const redirectMap = new Map<string, string>()
for (const review of reviews) {
  const parts = review.id.split("/")
  if (parts.length === 2) {
    redirectMap.set(parts[1], review.id)
  }
}

export const onRequest = defineMiddleware(({ url }, next) => {
  const match = url.pathname.match(/^\/reviews\/([^/]+)\/?$/)
  if (match) {
    const segment = match[1]
    const fullPath = redirectMap.get(segment)
    if (fullPath) {
      return new Response(null, {
        status: 301,
        headers: { Location: `/reviews/${fullPath}` },
      })
    }
  }
  return next()
})
