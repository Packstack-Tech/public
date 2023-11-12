import { Flame, Shirt } from "lucide-react"
import type { PackItem } from "../types/pack"
import { useCategorizedPackItems } from "../hooks/useCategorizedPackItems"
import { convertWeight, getAggregateUnit } from "../utils/weight"

interface Props {
  items: PackItem[]
}

export default function List({ items }: Props) {
  const categorizedItems = useCategorizedPackItems(items)

  const weightTotals = (items: PackItem[]) => {
    const baseUnit = items[0].item.unit
    const aggregateUnit = getAggregateUnit(baseUnit)
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
            className="mb-4 border border-surface rounded-sm"
          >
            <div className="flex justify-between items-center bg-surface  p-1.5">
              <h4 className="font-bold text-primary text-xs">
                {category?.category.name || "Uncategorized"}
              </h4>
              <p className="text-right text-primary text-xs">
                {categoryWeight}
              </p>
            </div>
            <table className="table-auto w-full">
              <thead className="text-xs">
                <tr>
                  <th className="w-[33%]">Item</th>
                  <th className="w-[33%]">Product</th>
                  <th className="w-8 text-center">Worn</th>
                  <th className="text-right">Weight</th>
                  <th className="text-right w-8">Qty</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map(({ item, item_id, quantity, worn }) => (
                  <tr key={item_id}>
                    <td>{item.name}</td>
                    <td>
                      {item.brand?.name} {item.product?.name}
                    </td>
                    <td className="text-center">
                      {worn && (
                        <div className="flex justify-center">
                          <Shirt size={16} color="#6a82fb" />
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        {item.consumable && <Flame size={12} color="orange" />}
                        <span>
                          {item.weight} {item.unit}
                        </span>
                      </div>
                    </td>
                    <td className="text-right">{quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
