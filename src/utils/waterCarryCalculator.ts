import { miToKm, kmToMi, ftToM, mToFt, lbToKg, kgToLb } from "./calorieCalculator"

export { miToKm, kmToMi, ftToM, mToFt, lbToKg, kgToLb }

export type SweatRate = "low" | "medium" | "high"

export const SWEAT_LABELS: Record<SweatRate, string> = {
  low: "Low (rarely sweat)",
  medium: "Medium (standard)",
  high: "High (heavy sweater)",
}

const SWEAT_MULTIPLIERS: Record<SweatRate, number> = {
  low: 0.85,
  medium: 1.0,
  high: 1.25,
}

const BASELINE_RATE_L_PER_HR = 0.5
const SAFETY_BUFFER_L = 0.3
const DRY_CAMP_ADDITION_L = 2.0
const HEAVY_PACK_THRESHOLD_LB = 30
const HEAVY_PACK_MULTIPLIER = 1.1

export const fToC = (f: number) => (f - 32) * (5 / 9)
export const cToF = (c: number) => c * (9 / 5) + 32
export const mphToKmh = (mph: number) => mph * 1.60934
export const kmhToMph = (kmh: number) => kmh / 1.60934

function getTempMultiplier(tempF: number): number {
  if (tempF < 60) return 0.8
  if (tempF <= 80) return 1.0
  if (tempF <= 90) return 1.5
  return 2.0
}

export interface WaterCalcInputs {
  distanceKm: number
  elevationGainM: number
  temperatureF: number
  sweatRate: SweatRate
  dryCamp: boolean
  packWeightKg: number
  paceKmh: number
}

export interface WaterCalcResults {
  hikingHours: number
  baselineLiters: number
  tempMultiplier: number
  afterTemp: number
  elevationPenaltyL: number
  afterElevation: number
  loadMultiplier: number
  afterLoad: number
  physiologyMultiplier: number
  subtotal: number
  dryCampAddition: number
  safetyBuffer: number
  totalLiters: number
  weightLb: number
  weightKg: number
}

export function calculateWaterCarry(inputs: WaterCalcInputs): WaterCalcResults {
  const {
    distanceKm, elevationGainM, temperatureF,
    sweatRate, dryCamp, packWeightKg, paceKmh,
  } = inputs

  const hikingHours = paceKmh > 0 ? distanceKm / paceKmh : 0

  // Step A: baseline
  const baselineLiters = hikingHours * BASELINE_RATE_L_PER_HR

  // Step B: temperature multiplier
  const tempMultiplier = getTempMultiplier(temperatureF)
  const afterTemp = baselineLiters * tempMultiplier

  // Step C: elevation penalty — 0.1L per 1000ft of gain
  const elevationGainFt = mToFt(elevationGainM)
  const elevationPenaltyL = Math.round((elevationGainFt / 1000) * 0.1 * 100) / 100
  const afterElevation = afterTemp + elevationPenaltyL

  // Step C cont: load penalty — +10% if pack > 30lb
  const packWeightLb = kgToLb(packWeightKg)
  const loadMultiplier = packWeightLb > HEAVY_PACK_THRESHOLD_LB ? HEAVY_PACK_MULTIPLIER : 1.0
  const afterLoad = afterElevation * loadMultiplier

  // Step D: physiology
  const physiologyMultiplier = SWEAT_MULTIPLIERS[sweatRate]
  const subtotal = afterLoad * physiologyMultiplier

  // Dry camp addition
  const dryCampAddition = dryCamp ? DRY_CAMP_ADDITION_L : 0

  // Safety buffer (always)
  const safetyBuffer = SAFETY_BUFFER_L

  const totalLiters = Math.round((subtotal + dryCampAddition + safetyBuffer) * 100) / 100

  return {
    hikingHours: Math.round(hikingHours * 10) / 10,
    baselineLiters: Math.round(baselineLiters * 100) / 100,
    tempMultiplier,
    afterTemp: Math.round(afterTemp * 100) / 100,
    elevationPenaltyL,
    afterElevation: Math.round(afterElevation * 100) / 100,
    loadMultiplier,
    afterLoad: Math.round(afterLoad * 100) / 100,
    physiologyMultiplier,
    subtotal: Math.round(subtotal * 100) / 100,
    dryCampAddition,
    safetyBuffer,
    totalLiters,
    weightLb: Math.round(totalLiters * 2.205 * 100) / 100,
    weightKg: Math.round(totalLiters * 100) / 100,
  }
}
