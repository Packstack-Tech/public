import { Fragment, type FC } from "react"
import { Flame, Shirt } from "lucide-react"
import type { PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { useCategorizedPackItems } from "../hooks/useCategorizedPackItems"
import { convertWeight, formatItemWeight } from "../utils/weight"
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

  const calorieTotals = (items: PackItem[]) =>
    items.reduce(
      (acc, { item, quantity }) => acc + (item.calories || 0) * quantity,
      0
    )

  const hasAnyCalories = items.some(({ item }) => !!item.calories)

  return (
    <div>
      {categorizedItems.map(({ category, items }) => {
        const categoryWeight = weightTotals(items)
        const categoryCals = calorieTotals(items)
        return (
          <div
            key={category?.id}
            className="mb-4 sm:mb-6 border border-surface rounded-md overflow-hidden"
          >
            <div className="flex justify-between items-center bg-surface px-3 sm:px-4 py-2 sm:py-2.5">
              <h4 className="font-bold text-primary text-sm">
                {category?.category.name || "Uncategorized"}
              </h4>
              <div className="flex items-center gap-3 sm:gap-4">
                {categoryCals > 0 && (
                  <p className="text-right text-accent-orange text-xs sm:text-sm font-semibold inline-flex items-center gap-1 tabular-nums">
                    <Flame size={13} />
                    {Math.round(categoryCals).toLocaleString()} kcal
                  </p>
                )}
                <p className="text-right text-primary text-sm font-semibold tabular-nums">
                  {categoryWeight}
                </p>
              </div>
            </div>

            {/*
              Phones: two columns — item with the product underneath, and
              weight. The per-category header row is dropped there too; the
              column meaning is obvious and it repeated on every category.
              sm and up: the original item / product / (kcal) / weight table.
            */}
            <table className="w-full">
              <thead className="text-xs hidden sm:table-header-group">
                <tr>
                  <th className="py-2.5 px-4">Item</th>
                  <th className={`py-2.5 px-4 ${hasAnyCalories ? "w-[35%]" : "w-[45%]"}`}>Product</th>
                  {hasAnyCalories && (
                    <th className="py-2.5 px-4 text-right w-[15%]">kcal</th>
                  )}
                  <th className="py-2.5 px-4 text-right w-[20%]">Weight</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map(({ item, item_id, quantity, worn }) => {
                  const rowCals = (item.calories || 0) * quantity
                  return (
                    <Fragment key={item_id}>
                      <tr>
                        <td className="py-2.5 px-3 sm:py-3 sm:px-4 align-top">
                          <span className="inline-flex items-center gap-1.5 sm:gap-2">
                            <span className="text-white">{item.name}</span>
                            {worn && (
                              <span title="Worn" className="shrink-0">
                                <Shirt size={13} className="text-primary" />
                              </span>
                            )}
                            {item.consumable && (
                              <span title="Consumable" className="shrink-0">
                                <Flame
                                  size={13}
                                  className="text-accent-orange"
                                />
                              </span>
                            )}
                          </span>
                          <div className="sm:hidden text-xs text-softwhite mt-0.5 leading-snug">
                            <ProductName item={item} />
                          </div>
                        </td>
                        <td className={`hidden sm:table-cell py-3 px-4 align-top ${hasAnyCalories ? "sm:w-[35%]" : "sm:w-[45%]"}`}>
                          <ProductName item={item} />
                        </td>
                        {hasAnyCalories && (
                          <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-right tabular-nums whitespace-nowrap align-top text-softwhite w-[20%] sm:w-[15%]">
                            {rowCals > 0 ? Math.round(rowCals).toLocaleString() : ""}
                          </td>
                        )}
                        <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-right tabular-nums whitespace-nowrap align-top w-[32%] sm:w-[20%]">
                          {quantity > 1 && (
                            <span className="mr-1.5 sm:mr-2 text-[11px] sm:text-xs text-label bg-surface rounded px-1 sm:px-1.5 py-0.5">
                              &times;{quantity}
                            </span>
                          )}
                          {formatItemWeight(
                            item.weight || 0,
                            item.unit,
                            itemUnit
                          )}
                        </td>
                      </tr>
                      {item.notes && (
                        <tr className="border-none">
                          <td
                            colSpan={hasAnyCalories ? 4 : 3}
                            className="px-3 sm:px-4 pb-2.5 sm:pb-3 pt-0 text-xs text-label leading-snug"
                          >
                            {item.notes}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
