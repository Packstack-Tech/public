import { type FC, useMemo, useState, useCallback, useEffect } from "react"
import { PieChart, X } from "lucide-react"
import { ResponsivePie } from "@nivo/pie"
import type { PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { useCategorizedPackItems } from "../hooks/useCategorizedPackItems"
import { convertWeight } from "../utils/weight"

const SM_BREAKPOINT = 640
function useIsSmallScreen() {
  const [isSmall, setIsSmall] = useState(false)
  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < SM_BREAKPOINT)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isSmall
}

const CHART_COLORS = [
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
  "#990099",
  "#0099C6",
  "#DD4477",
  "#66AA00",
  "#B82E2E",
  "#316395",
  "#994499",
  "#22AA99",
  "#AAAA11",
  "#6633CC",
  "#E67300",
  "#8B0707",
  "#651067",
  "#329262",
  "#5574A6",
  "#3B3EAC",
]

interface Props {
  items: PackItem[]
  aggregateUnit: Unit
}

export const WeightBreakdownDialog: FC<Props> = ({ items, aggregateUnit }) => {
  const [open, setOpen] = useState(false)
  const isSmall = useIsSmallScreen()
  const categorized = useCategorizedPackItems(items)

  const categoryWeights = useMemo(
    () =>
      categorized.map(({ category, items: catItems }) => ({
        label: category?.category.name || "Uncategorized",
        value: catItems.reduce((sum, { item, quantity }) => {
          return (
            sum +
            convertWeight(item.weight || 0, item.unit, aggregateUnit).weight *
              quantity
          )
        }, 0),
      })),
    [categorized, aggregateUnit]
  )

  const totalWeight = useMemo(
    () => categoryWeights.reduce((sum, c) => sum + c.value, 0),
    [categoryWeights]
  )

  const chartData = useMemo(
    () =>
      categoryWeights.map(({ label, value }) => ({
        id: label,
        label,
        value,
      })),
    [categoryWeights]
  )

  const valueFormat = useCallback(
    (value: number) => `${value.toFixed(2)} ${aggregateUnit}`,
    [aggregateUnit]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  if (categoryWeights.length === 0) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex gap-1 items-center text-primary hover:text-primary-light transition-colors whitespace-nowrap cursor-pointer"
      >
        <PieChart size={12} /> View Weight Breakdown
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>
                Weight Breakdown
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="transition-colors cursor-pointer"
                style={{ color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row px-6 py-6 gap-4" style={{ color: '#0f172a' }}>
              <div className="min-w-0 h-64 w-full sm:h-96 sm:w-auto sm:flex-1">
                <ResponsivePie
                  data={chartData}
                  margin={isSmall
                    ? { top: 20, right: 20, bottom: 20, left: 20 }
                    : { top: 40, right: 100, bottom: 40, left: 100 }
                  }
                  valueFormat={valueFormat}
                  activeOuterRadiusOffset={8}
                  colors={CHART_COLORS}
                  borderWidth={1}
                  borderColor="#ffffff"
                  enableArcLinkLabels={!isSmall}
                  arcLinkLabelsSkipAngle={8}
                  arcLinkLabelsTextColor="#334155"
                  arcLinkLabelsThickness={1}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLinkLabel={(d) =>
                    `${d.label} (${((d.value / totalWeight) * 100).toFixed(1)}%)`
                  }
                  enableArcLabels={false}
                  theme={{
                    labels: {
                      text: { fontSize: 11 },
                    },
                  }}
                />
              </div>
              <div className="sm:w-56 shrink-0 flex items-center">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr style={{ borderColor: '#e2e8f0' }}>
                      <th className="w-6"></th>
                      <th className="text-left font-semibold pb-1" style={{ color: '#0f172a' }}>
                        Category
                      </th>
                      <th className="text-right font-semibold pb-1" style={{ color: '#0f172a' }}>
                        Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map(({ label, value }, index) => (
                      <tr key={label} style={{ borderColor: '#f1f5f9' }}>
                        <td className="py-1.5">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          />
                        </td>
                        <td className="py-1.5">{label}</td>
                        <td className="text-right tabular-nums py-1.5">
                          {valueFormat(value)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderColor: '#f1f5f9' }}>
                      <td className="py-1.5"></td>
                      <td className="py-1.5 font-semibold">Total</td>
                      <td className="text-right tabular-nums py-1.5 font-semibold">
                        {valueFormat(totalWeight)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
