import { useState } from "react"
import type { Unit } from "../types/item"

export type UnitSystem = "metric" | "imperial"

export function useUnitPreference() {
  const [system, setSystem] = useState<UnitSystem>(() => {
    if (typeof window === "undefined") return "metric"
    return (localStorage.getItem("packstack-unit-pref") as UnitSystem) || "metric"
  })

  const toggleSystem = () => {
    const next: UnitSystem = system === "metric" ? "imperial" : "metric"
    localStorage.setItem("packstack-unit-pref", next)
    setSystem(next)
  }

  const aggregateUnit: Unit = system === "metric" ? "kg" : "lb"
  const itemUnit: Unit = system === "metric" ? "g" : "oz"

  return { system, aggregateUnit, itemUnit, toggleSystem } as const
}
