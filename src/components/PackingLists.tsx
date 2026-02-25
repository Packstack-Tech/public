import type { Pack, PackItem } from "../types/pack"
import { convertWeight, getAggregateUnit } from "../utils/weight"
import { List } from "./List"

interface Props {
  packs: Pack[]
}

function computeWeightSummary(items: PackItem[]) {
  if (items.length === 0) return null

  const aggregateUnit = getAggregateUnit(items[0].item.unit)

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
  return (
    <div>
      {packs.map((pack) => {
        const summary = computeWeightSummary(pack.items)
        return (
          <div key={pack.id} className="mb-10">
            <h2 className="border-b border-border pb-2">{pack.title}</h2>
            {summary && (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3 text-xs">
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
            )}
            <List items={pack.items} />
          </div>
        )
      })}
    </div>
  )
}
