export const API_BASE = "https://api.packstack.io"

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&/]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export const SUBCATEGORIES: Record<string, string[]> = {
  Clothing: [
    "Base Layer", "Mid Layer", "Insulation", "Rain Gear", "Wind Gear",
    "Sock", "Underwear", "Headwear", "Glove", "Pant & Short", "Shirt & Top",
  ],
  Cookware: [
    "Stove", "Fuel", "Pot & Pan", "Utensil", "Drinkware", "Cleaning", "Coffee/Tea",
  ],
  "Sleep System": [
    "Sleeping Bag", "Quilt", "Sleeping Pad", "Pillow", "Liner", "Bivy",
  ],
  Electronics: [
    "Power & Cable", "Lighting", "Navigation/Comm", "Battery", "Solar", "Wearable", "Audio",
  ],
  Pack: ["Main Pack", "Daypack", "Protection", "Organization", "Add-on"],
  Shelter: ["Tent", "Hammock", "Tarp", "Hardware", "Structure"],
  Toiletries: ["Hygiene", "Bathroom", "Sun & Bug", "Personal Care"],
  "Water System": ["Filtration", "Purification", "Bottle", "Hydration", "Storage"],
  Food: ["Meal", "Snack", "Beverage", "Storage", "Hanging"],
  Footware: ["Primary", "Camp Shoe", "Gaiter", "Traction"],
  Tools: ["Knife", "Repair", "Trekking Pole", "Processing"],
  "First Aid": ["Bandage", "Medication", "Blister Care", "Ointment"],
  Safety: ["Survival", "Fire", "Protection"],
  Camera: ["Body & Lens", "Support", "Media", "Power"],
  Climbing: ["Personal", "Hardware", "Protection", "Soft Good"],
}

const DISPLAY_NAMES: Record<string, string> = {
  "Main Pack": "Backpack",
}

export function displayName(subcategory: string): string {
  return DISPLAY_NAMES[subcategory] ?? subcategory
}

export type SubcategoryEntry = {
  category: string
  subcategory: string
  displayName: string
  slug: string
}

export function getAllSubcategories(): SubcategoryEntry[] {
  const entries: SubcategoryEntry[] = []
  for (const [category, subs] of Object.entries(SUBCATEGORIES)) {
    for (const sub of subs) {
      entries.push({ category, subcategory: sub, displayName: displayName(sub), slug: slugify(sub) })
    }
  }
  return entries
}
