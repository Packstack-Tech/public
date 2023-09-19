import { Flame, Shirt } from "lucide-react"
import type { PackItem } from "../types/pack"
import { useCategorizedPackItems } from "../hooks/useCategorizedPackItems"
import { getCategoryWeight } from "../utils/getCategoryWeight"

interface Props {
  items: PackItem[]
}

export default function List({ items }: Props) {
  const categorizedItems = useCategorizedPackItems(items)

  return (
    <div>
      {categorizedItems.map(({ category, items }) => {
        const categoryTotals = getCategoryWeight(items)
        return (
          <div
            key={category?.id}
            className="mb-4 border border-surface rounded-sm"
          >
            <h4 className="bg-surface text-primary p-1.5 font-bold text-xs">
              {category?.category.name || "Uncategorized"}
            </h4>
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
              <tfoot className="text-xs text-primary">
                <tr>
                  <td>Total</td>
                  <td />
                  <td />
                  <td className="text-right">{categoryTotals.weight} kg</td>
                  <td className="text-right">{categoryTotals.quantity}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )
      })}
    </div>
  )
}
