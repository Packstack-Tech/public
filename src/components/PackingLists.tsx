import { useEffect, useState } from "react"
import { Flame, Loader2 } from "lucide-react"
import type { Pack, PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { convertWeight } from "../utils/weight"
import { useUnitPreference } from "../hooks/useUnitPreference"
import { List } from "./List"
import { WeightBreakdownDialog } from "./WeightBreakdownDialog"

interface Props {
  tripId: number
}

function computeWeightSummary(items: PackItem[], aggregateUnit: Unit) {
  if (items.length === 0) return null

  let base = 0
  let worn = 0
  let consumable = 0
  let total = 0

  for (const { item, quantity, worn: isWorn } of items) {
    const w = convertWeight(item.weight || 0, item.unit, aggregateUnit).weight * quantity
    total += w
    if (isWorn) {
      worn += w
    } else if (item.consumable) {
      consumable += w
    } else {
      base += w
    }
  }

  let totalCalories = 0
  for (const { item, quantity } of items) {
    totalCalories += (item.calories || 0) * quantity
  }

  const fmt = (v: number) => `${v.toFixed(2)} ${aggregateUnit}`
  return { base: fmt(base), worn: fmt(worn), consumable: fmt(consumable), total: fmt(total), totalCalories: Math.round(totalCalories) }
}

export default function PackingLists({ tripId }: Props) {
  const { system, aggregateUnit, itemUnit, toggleSystem } = useUnitPreference()
  const [packs, setPacks] = useState<Pack[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`https://api.packstack.io/pack/trip/${tripId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load packs")
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setPacks(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => { cancelled = true }
  }, [tripId])

  if (error) {
    return (
      <p className="text-center text-label py-12">
        Unable to load pack items. Please try refreshing the page.
      </p>
    )
  }

  if (!packs) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md border border-border text-xs">
          <button
            onClick={toggleSystem}
            className={`px-3 py-1.5 rounded-l-md transition-colors cursor-pointer ${
              system === "metric"
                ? "bg-primary text-white"
                : "text-label hover:text-white"
            }`}
          >
            Metric
          </button>
          <button
            onClick={toggleSystem}
            className={`px-3 py-1.5 rounded-r-md transition-colors cursor-pointer ${
              system === "imperial"
                ? "bg-primary text-white"
                : "text-label hover:text-white"
            }`}
          >
            Imperial
          </button>
        </div>
      </div>

      {packs.map((pack) => {
        const summary = computeWeightSummary(pack.items, aggregateUnit)
        return (
          <div key={pack.id} className="mb-10">
            <h2 className="border-b border-border pb-2">{pack.title}</h2>
            {summary && (
              <div className="flex items-center justify-between py-3 text-xs">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span>
                    <span className="text-label">Base</span>
                    <span className="text-white font-semibold ml-1.5">{summary.base}</span>
                  </span>
                  <span>
                    <span className="text-label">Worn</span>
                    <span className="text-white font-semibold ml-1.5">{summary.worn}</span>
                  </span>
                  <span>
                    <span className="text-label">Consumable</span>
                    <span className="text-white font-semibold ml-1.5">{summary.consumable}</span>
                  </span>
                  <span>
                    <span className="text-label">Total</span>
                    <span className="text-primary font-bold ml-1.5">{summary.total}</span>
                  </span>
                  {summary.totalCalories > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Flame size={13} className="text-orange-400" />
                      <span className="text-label">Calories</span>
                      <span className="text-orange-400 font-bold ml-0.5">{summary.totalCalories.toLocaleString()} kcal</span>
                    </span>
                  )}
                </div>
                <WeightBreakdownDialog items={pack.items} aggregateUnit={aggregateUnit} />
              </div>
            )}
            <List items={pack.items} aggregateUnit={aggregateUnit} itemUnit={itemUnit} />
          </div>
        )
      })}
    </div>
  )
}
