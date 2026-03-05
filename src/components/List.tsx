import { Fragment, type FC } from "react"
import { Flame, Shirt } from "lucide-react"
import type { PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { useCategorizedPackItems } from "../hooks/useCategorizedPackItems"
import { convertWeight } from "../utils/weight"
import { ProductName } from "./ProductName"

interface Props {
  items: PackItem[]
  aggregateUnit: Unit
  itemUnit: Unit
}

export const List: FC<Props> = ({ items, aggregateUnit, itemUnit }) => {
  const categorizedItems = useCategorizedPackItems(items)

  const weightTotals = (items: PackItem[]) => {
    const total = items.reduce((acc, { item, quantity }) => {
      const weight = convertWeight(item.weight || 0, item.unit, aggregateUnit)
      return acc + weight.weight * quantity
    }, 0)
    return `${total.toFixed(2)} ${aggregateUnit}`
  }

  return (
    <div>
      {categorizedItems.map(({ category, items }) => {
        const categoryWeight = weightTotals(items)
        return (
          <div
            key={category?.id}
            className="mb-6 border border-surface rounded-md overflow-hidden"
          >
            <div className="flex justify-between items-center bg-surface px-4 py-2.5">
              <h4 className="font-bold text-primary text-sm">
                {category?.category.name || "Uncategorized"}
              </h4>
              <p className="text-right text-primary text-sm font-semibold">
                {categoryWeight}
              </p>
            </div>
            <table className="table-fixed w-full">
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[45%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead className="text-xs">
                <tr>
                  <th className="py-2.5 px-4">Item</th>
                  <th className="py-2.5 px-4">Product</th>
                  <th className="py-2.5 px-4 text-right">Weight</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map(({ item, item_id, quantity, worn }) => (
                  <Fragment key={item_id}>
                    <tr>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2">
                          {item.name}
                          {worn && (
                            <span title="Worn">
                              <Shirt size={14} className="text-primary" />
                            </span>
                          )}
                          {item.consumable && (
                            <span title="Consumable">
                              <Flame size={14} className="text-accent-orange" />
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ProductName item={item} />
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums whitespace-nowrap">
                        {convertWeight(item.weight || 0, item.unit, itemUnit).display}
                        {quantity > 1 && (
                          <span className="ml-2 text-xs text-label bg-surface rounded px-1.5 py-0.5">
                            &times;{quantity}
                          </span>
                        )}
                      </td>
                    </tr>
                    {item.notes && (
                      <tr className="border-none">
                        <td colSpan={3} className="px-4 pb-3 pt-0 text-xs text-softwhite">
                          {item.notes}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
