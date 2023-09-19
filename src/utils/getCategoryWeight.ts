import type { PackItem } from "../types/pack"

type CategoryWeight = {
  weight: number
  quantity: number
}

export const getCategoryWeight = (items: PackItem[]) =>
  items.reduce(
    (acc, { item, quantity }) => {
      const weight = item.weight
        ? item.unit === "g"
          ? item.weight / 1000
          : item.weight
        : 0
      return {
        weight: acc.weight + weight * quantity,
        quantity: acc.quantity + quantity,
      }
    },
    { weight: 0, quantity: 0 } as CategoryWeight
  )
