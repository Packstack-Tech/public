import { useState, useEffect, useMemo, type FC } from "react"
import { ArrowUpDown, Info, Loader2 } from "lucide-react"
import type { CatalogProduct, SubcategoryResponse } from "../../types/catalog"
import type { Unit } from "../../types/item"
import { useUnitPreference } from "../../hooks/useUnitPreference"
import { convertWeight, formatItemWeight } from "../../utils/weight"
import { API_BASE } from "../../utils/catalog"
import { GearRow } from "./GearRow"
import { GearFilters } from "./GearFilters"

type SortField = "weight" | "name"
type SortDir = "asc" | "desc"

interface Props {
  slug: string
  subcategory: string
  category: string
}

function weightToUserUnit(grams: number | null, targetUnit: Unit): number | null {
  if (grams == null) return null
  return convertWeight(grams, "g", targetUnit).weight
}

function computeMedian(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

const GearTable: FC<Props> = ({ slug, subcategory }) => {
  const { system, itemUnit, toggleSystem } = useUnitPreference()

  const [data, setData] = useState<SubcategoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [sortField, setSortField] = useState<SortField>("weight")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [weightMin, setWeightMin] = useState("")
  const [weightMax, setWeightMax] = useState("")

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`${API_BASE}/resources/catalog/browse/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed")
        return r.json()
      })
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  const allBrands = useMemo(() => {
    if (!data) return []
    const set = new Set(data.products.map((p) => p.brand_name))
    return [...set].sort()
  }, [data])

  const medianWeightG = useMemo(() => {
    if (!data) return null
    const weights = data.products
      .map((p) => p.lightest_weight_g)
      .filter((w): w is number => w != null)
    return computeMedian(weights)
  }, [data])

  const weightStats = useMemo(() => {
    if (!data) return null
    const weights = data.products
      .map((p) => p.lightest_weight_g)
      .filter((w): w is number => w != null)
    if (weights.length === 0) return null
    const sorted = [...weights].sort((a, b) => a - b)
    return {
      lightest: sorted[0],
      heaviest: sorted[sorted.length - 1],
      median: computeMedian(weights)!,
    }
  }, [data])

  const filteredProducts = useMemo(() => {
    if (!data) return []
    let products = data.products

    if (selectedBrands.size > 0) {
      products = products.filter((p) => selectedBrands.has(p.brand_name))
    }

    const minVal = weightMin ? parseFloat(weightMin) : null
    const maxVal = weightMax ? parseFloat(weightMax) : null
    if (minVal != null || maxVal != null) {
      products = products.filter((p) => {
        const wUser = weightToUserUnit(p.lightest_weight_g, itemUnit)
        if (wUser == null) return true
        if (minVal != null && wUser < minVal) return false
        if (maxVal != null && wUser > maxVal) return false
        return true
      })
    }

    return products
  }, [data, selectedBrands, weightMin, weightMax, itemUnit])

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    sorted.sort((a, b) => {
      if (sortField === "weight") {
        const aw = a.lightest_weight_g ?? Infinity
        const bw = b.lightest_weight_g ?? Infinity
        return sortDir === "asc" ? aw - bw : bw - aw
      }
      const an = `${a.brand_name} ${a.product_name}`.toLowerCase()
      const bn = `${b.brand_name} ${b.product_name}`.toLowerCase()
      return sortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an)
    })
    return sorted
  }, [filteredProducts, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir(field === "weight" ? "asc" : "asc")
    }
  }

  function toggleExpand(key: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function productKey(p: CatalogProduct) {
    return `${p.brand_name}::${p.product_name}`
  }

  const hasActiveFilters =
    selectedBrands.size > 0 || weightMin !== "" || weightMax !== ""

  function clearFilters() {
    setSelectedBrands(new Set())
    setWeightMin("")
    setWeightMax("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <p className="text-center text-label py-12">
        Unable to load gear data. Please try refreshing the page.
      </p>
    )
  }

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <span className="text-label">
            {sortedProducts.length}
            {hasActiveFilters ? ` of ${data.product_count}` : ""} products
          </span>
          {weightStats && (
            <>
              <span>
                <span className="text-label">Lightest</span>
                <span className="text-accent-green font-semibold ml-1.5">
                  {formatItemWeight(weightStats.lightest, "g", itemUnit)}
                </span>
              </span>
              <span>
                <span className="text-label">Median</span>
                <span className="text-white font-semibold ml-1.5">
                  {formatItemWeight(weightStats.median, "g", itemUnit)}
                </span>
              </span>
              <span>
                <span className="text-label">Heaviest</span>
                <span className="text-softwhite font-semibold ml-1.5">
                  {formatItemWeight(weightStats.heaviest, "g", itemUnit)}
                </span>
              </span>
            </>
          )}
        </div>

        {/* Unit toggle */}
        <div className="flex w-full sm:w-auto rounded-md border border-border text-xs">
          <button
            onClick={toggleSystem}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-l-md transition-colors cursor-pointer ${
              system === "metric"
                ? "bg-primary text-white"
                : "text-label hover:text-white"
            }`}
          >
            Metric
          </button>
          <button
            onClick={toggleSystem}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-r-md transition-colors cursor-pointer ${
              system === "imperial"
                ? "bg-primary text-white"
                : "text-label hover:text-white"
            }`}
          >
            Imperial
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <GearFilters
          brands={allBrands}
          selectedBrands={selectedBrands}
          onBrandsChange={setSelectedBrands}
          weightMin={weightMin}
          weightMax={weightMax}
          onWeightMinChange={setWeightMin}
          onWeightMaxChange={setWeightMax}
          itemUnit={itemUnit}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface">
              <th className="w-[60px] py-2.5 px-3" />
              <th className="py-2.5 px-3">
                <button
                  onClick={() => toggleSort("name")}
                  className="inline-flex items-center gap-1 text-xs text-label hover:text-white transition-colors cursor-pointer font-normal"
                >
                  Product
                  <ArrowUpDown size={12} className={sortField === "name" ? "text-primary" : ""} />
                </button>
              </th>
              <th className="py-2.5 px-3 text-right w-[120px]">
                <button
                  onClick={() => toggleSort("weight")}
                  className="inline-flex items-center gap-1 text-xs text-label hover:text-white transition-colors cursor-pointer font-normal ml-auto"
                >
                  Weight
                  <ArrowUpDown size={12} className={sortField === "weight" ? "text-primary" : ""} />
                </button>
              </th>
              <th className="py-2.5 px-3 w-[80px] hidden sm:table-cell text-right">
                <span
                  className="inline-flex items-center gap-1 text-xs text-label font-normal whitespace-nowrap"
                  title="How much lighter this product is compared to the median weight in this category"
                >
                  vs Median
                  <Info size={13} />
                </span>
              </th>
              <th className="py-2.5 px-3 w-[40px]" />
              <th className="py-2.5 px-3 w-[40px]" />
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => {
              const key = productKey(product)
              return (
                <GearRow
                  key={key}
                  product={product}
                  expanded={expandedIds.has(key)}
                  onToggle={() => toggleExpand(key)}
                  itemUnit={itemUnit}
                  medianWeightG={medianWeightG}
                />
              )
            })}
          </tbody>
        </table>

        {sortedProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-label text-sm">
              {hasActiveFilters
                ? "No products match your filters."
                : "No products found in this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GearTable
