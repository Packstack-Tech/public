import type { Pack, PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { convertWeight } from "../utils/weight"
import { useUnitPreference } from "../hooks/useUnitPreference"
import { List } from "./List"
import { WeightBreakdownDialog } from "./WeightBreakdownDialog"

interface Props {
  packs: Pack[]
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

  const fmt = (v: number) => `${v.toFixed(2)} ${aggregateUnit}`
  return { base: fmt(base), worn: fmt(worn), consumable: fmt(consumable), total: fmt(total) }
}

export default function PackingLists({ packs }: Props) {
  const { system, aggregateUnit, itemUnit, toggleSystem } = useUnitPreference()

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
