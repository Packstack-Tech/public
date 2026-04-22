export type CatalogVariant = {
  id: number
  variant_name: string | null
  display_name: string
  weight: number | null
  weight_unit: string | null
  image_url: string | null
  description: string | null
  additional_specs: Record<string, string> | null
}

export type CatalogProduct = {
  brand_name: string
  product_name: string
  product_url: string | null
  lightest_weight_g: number | null
  variants: CatalogVariant[]
}

export type SubcategoryResponse = {
  subcategory: string
  category: string
  slug: string
  product_count: number
  products: CatalogProduct[]
}

export type SubcategoryInfo = {
  name: string
  slug: string
  product_count: number
}

export type CategoryGroup = {
  category: string
  subcategories: SubcategoryInfo[]
}
