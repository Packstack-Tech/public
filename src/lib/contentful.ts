import contentful from "contentful"
import type { EntryFieldTypes } from "contentful"

export interface BlogPost {
  contentTypeId: "blogPost"
  fields: {
    title: EntryFieldTypes.Text
    slug: EntryFieldTypes.Text
    author: EntryFieldTypes.Text
    publishDate: EntryFieldTypes.Date
    heroImage: EntryFieldTypes.AssetLink
    postContent: EntryFieldTypes.RichText
  }
}

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
})
