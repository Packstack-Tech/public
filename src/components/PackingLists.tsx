import { Flame } from "lucide-react"
import type { Pack, PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { convertWeight } from "../utils/weight"
import { List } from "./List"
import { WeightBreakdownDialog } from "./WeightBreakdownDialog"

interface Props {
  packs: Pack[]
  aggregateUnit: Unit
  itemUnit: Unit
}

function computeWeightSummary(items: PackItem[], aggregateUnit: Unit) {
  if (items.length === 0) return null

  let base = 0
  let worn = 0
  let consumable = 0
  let total = 0

  for (const { item, quantity, worn: isWorn } of items) {
    const w =
      convertWeight(item.weight || 0, item.unit, aggregateUnit).weight *
      quantity
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
  return {
    base: fmt(base),
    worn: fmt(worn),
    consumable: fmt(consumable),
    total: fmt(total),
    totalCalories: Math.round(totalCalories),
  }
}

export function PackingLists({ packs, aggregateUnit, itemUnit }: Props) {
  return (
    <div>
      {packs.map((pack) => {
        const summary = computeWeightSummary(pack.items, aggregateUnit)
        return (
          <section key={pack.id} className="mb-10">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
              <h2 className="mb-0 truncate">{pack.title}</h2>
              {summary && (
                <WeightBreakdownDialog
                  items={pack.items}
                  aggregateUnit={aggregateUnit}
                />
              )}
            </div>

            {summary && (
              <div className="py-4">
                <dl className="grid grid-cols-4 gap-2 sm:gap-3">
                  <Stat label="Base" value={summary.base} />
                  <Stat label="Worn" value={summary.worn} />
                  <Stat label="Consumable" value={summary.consumable} />
                  <Stat label="Total" value={summary.total} emphasis />
                </dl>
                {summary.totalCalories > 0 && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs leading-none">
                    <Flame size={13} className="text-accent-orange" />
                    <span className="text-label">Calories</span>
                    <span className="text-accent-orange font-semibold tabular-nums">
                      {summary.totalCalories.toLocaleString()} kcal
                    </span>
                  </p>
                )}
              </div>
            )}

            <List
              items={pack.items}
              aggregateUnit={aggregateUnit}
              itemUnit={itemUnit}
            />
          </section>
        )
      })}
    </div>
  )
}

/**
 * One tile of the pack summary. The four tiles share a row on every width so
 * the eye can compare them; on phones the value shrinks rather than wrapping.
 */
function Stat({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div
      className={`rounded-md border px-2.5 py-2 sm:px-3 sm:py-2.5 min-w-0 ${
        emphasis
          ? "border-primary/40 bg-primary-glow"
          : "border-border bg-surface"
      }`}
    >
      <dt className="text-[10px] sm:text-xs uppercase tracking-wider text-label leading-none mb-1.5 truncate">
        {label}
      </dt>
      <dd
        className={`tabular-nums font-semibold leading-none text-sm sm:text-base truncate ${
          emphasis ? "text-primary" : "text-white"
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
