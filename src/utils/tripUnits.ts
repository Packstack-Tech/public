import type { UserInfo } from "../types/user"

// Same constants as the authenticated app's lib/unitConversions.
const kmToMi = (km: number) => km / 1.60934
const mToFt = (m: number) => m / 0.3048
const cToF = (c: number) => (c * 9) / 5 + 32

/**
 * A trip's distance, elevation, and temperature are stored canonically in
 * metric (km, m, °C) — the same source of truth the editor reads. These helpers
 * convert to the trip owner's chosen display units so the public share page
 * shows the exact numbers the owner entered, instead of the raw metric value
 * with an imperial label slapped on it.
 */
export const displayDistance = (km: number, user: UserInfo): number => {
  const value = user.unit_distance === "MI" ? kmToMi(km) : km
  return Math.round(value * 100) / 100
}

export const displayElevation = (m: number, user: UserInfo): number =>
  Math.round(user.unit_distance === "MI" ? mToFt(m) : m)

export const displayTemperature = (c: number, user: UserInfo): number =>
  Math.round(user.unit_temperature === "F" ? cToF(c) : c)
