export const CATEGORY_ORDER = [
  "Pack",
  "Shelter",
  "Sleep System",
  "Cookware",
  "Water System",
  "Clothing",
  "Electronics",
  "Tools",
  "Miscellaneous",
]

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-")
}
