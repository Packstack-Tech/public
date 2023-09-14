import type { Item } from "./item"

export type Pack = {
  id: number
  user_id: number
  trip_id: number
  title: string
  items: PackItem[]
}

export type PackItem = {
  quantity: number
  worn: boolean
  checked: boolean
  sort_order: number
  item_id: number
  pack_id?: number
  item: Item
}
