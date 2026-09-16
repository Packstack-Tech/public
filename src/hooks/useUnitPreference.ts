import { useEffect, useState } from "react"
import type { Unit } from "../types/item"

export type UnitSystem = "metric" | "imperial"

const STORAGE_KEY = "packstack-unit-pref"

/**
 * Visitor's unit system for the public pack page.
 *
 * The page is server-rendered, so the initial value must be identical on the
 * server and on the client's first render or React reports a hydration
 * mismatch and re-renders the tree. We start from `initial` (the trip owner's
 * preference, passed from the page) and apply the visitor's saved choice in an
 * effect after mount.
 */
export function useUnitPreference(initial: UnitSystem = "metric") {
  const [system, setSystem] = useState<UnitSystem>(initial)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as UnitSystem | null
      if (saved === "metric" || saved === "imperial") setSystem(saved)
    } catch {
      // Storage unavailable (private mode, blocked); keep the owner's units.
    }
  }, [])

  const toggleSystem = () => {
    const next: UnitSystem = system === "metric" ? "imperial" : "metric"
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
    setSystem(next)
  }

  const aggregateUnit: Unit = system === "metric" ? "kg" : "lb"
  const itemUnit: Unit = system === "metric" ? "g" : "oz"

  return { system, aggregateUnit, itemUnit, toggleSystem } as const
}
