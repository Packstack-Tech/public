import type { PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { convertWeight } from "./weight"

/**
 * Worn units of a pack item. Same rule as the API
 * (api/app/utils/pack_weight.py `effective_worn`), the web app and mobile —
 * keep them in step. `worn` with no count (an API that predates
 * worn_quantity) reads as one unit.
 */
export function wornQuantity(pi: Pick<PackItem, "quantity" | "worn" | "worn_quantity">): number {
  const q = pi.quantity || 0
  const wq = Number(pi.worn_quantity ?? 0)
  if (wq > 0) return Math.min(wq, q)
  if (pi.worn) return Math.min(1, q)
  return 0
}

export type PackWeightTotals = {
  base: number
  worn: number
  consumable: number
  total: number
  totalCalories: number
}

/**
 * Base / worn / consumable / total for a set of pack items, in `unit`.
 * Worn units are worn; the remaining units are consumable or base.
 */
export function computePackWeights(items: PackItem[], unit: Unit): PackWeightTotals {
  const out: PackWeightTotals = { base: 0, worn: 0, consumable: 0, total: 0, totalCalories: 0 }
  for (const pi of items) {
    const { item, quantity } = pi
    const each = convertWeight(item.weight || 0, item.unit, unit).weight
    const worn = each * wornQuantity(pi)
    const rest = each * quantity - worn
    out.worn += worn
    if (item.consumable) out.consumable += rest
    else out.base += rest
    out.total += each * quantity
    out.totalCalories += (item.calories || 0) * quantity
  }
  out.totalCalories = Math.round(out.totalCalories)
  return out
}
