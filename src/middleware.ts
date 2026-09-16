import { defineMiddleware } from "astro:middleware"
import { getCollection } from "astro:content"

// Built on first use, and only for a /reviews/<slug> request. Loading the
// reviews collection (800+ MDX entries) at module scope ran on every cold
// start of the server function, for every route — pack pages included.
let redirectMapPromise: Promise<Map<string, string>> | null = null

function getRedirectMap() {
  if (!redirectMapPromise) {
    redirectMapPromise = getCollection("reviews").then((reviews) => {
      const map = new Map<string, string>()
      for (const review of reviews) {
        const parts = review.id.split("/")
        if (parts.length === 2) {
          map.set(parts[1], review.id)
        }
      }
      return map
    })
  }
  return redirectMapPromise
}

export const onRequest = defineMiddleware(async ({ url }, next) => {
  const match = url.pathname.match(/^\/reviews\/([^/]+)\/?$/)
  if (match) {
    const segment = match[1]
    const fullPath = (await getRedirectMap()).get(segment)
    if (fullPath) {
      return new Response(null, {
        status: 301,
        headers: { Location: `/reviews/${fullPath}` },
      })
    }
  }
  return next()
})
