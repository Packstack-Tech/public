import type { Unit } from "../types/item"

export function convertWeight(weight: number, fromUnit: Unit, toUnit: Unit) {
  // Define conversion factors for different weight units
  const conversionFactors: { [K in Unit]: number } = {
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592,
  }

  // Convert the weight to grams (the base unit)
  const weightInGrams = weight * conversionFactors[fromUnit]

  // Convert the weight from grams to the desired output unit
  const convertedWeight = weightInGrams / conversionFactors[toUnit]

  return {
    weight: convertedWeight,
    display: `${convertedWeight.toFixed(2)} ${toUnit}`,
  }
}

export function getAggregateUnit(unit: Unit) {
  const aggregateUnits: { [K in Unit]: Unit } = {
    g: "kg",
    kg: "kg",
    oz: "lb",
    lb: "lb",
  }

  return aggregateUnits[unit]
}

const PROMOTE_THRESHOLDS: Partial<Record<Unit, { threshold: number; to: Unit }>> = {
  g: { threshold: 1000, to: "kg" },
  oz: { threshold: 16, to: "lb" },
}

/**
 * Formats an item weight for display, promoting to the larger unit
 * (g -> kg, oz -> lb) when the value exceeds a natural threshold.
 * Uses 2 decimal places for the larger unit; strips trailing zeros
 * for the smaller unit.
 */
export function formatItemWeight(
  weight: number,
  fromUnit: Unit,
  targetItemUnit: Unit
): string {
  const converted = convertWeight(weight, fromUnit, targetItemUnit)
  const promo = PROMOTE_THRESHOLDS[targetItemUnit]

  if (promo && converted.weight >= promo.threshold) {
    const promoted = convertWeight(weight, fromUnit, promo.to)
    return `${promoted.weight.toFixed(2)} ${promo.to}`
  }

  const rounded = targetItemUnit === "g"
    ? Math.round(converted.weight)
    : parseFloat(converted.weight.toFixed(2))
  return `${rounded} ${targetItemUnit}`
}
