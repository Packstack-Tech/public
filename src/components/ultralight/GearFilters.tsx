import { useState, useRef, useEffect, useMemo, type FC } from "react"
import { Filter, X, ChevronDown, Search } from "lucide-react"
import type { Unit } from "../../types/item"

interface Props {
  brands: string[]
  selectedBrands: Set<string>
  onBrandsChange: (brands: Set<string>) => void
  weightMin: string
  weightMax: string
  onWeightMinChange: (v: string) => void
  onWeightMaxChange: (v: string) => void
  itemUnit: Unit
  onClear: () => void
  hasActiveFilters: boolean
}

export const GearFilters: FC<Props> = ({
  brands,
  selectedBrands,
  onBrandsChange,
  weightMin,
  weightMax,
  onWeightMinChange,
  onWeightMaxChange,
  itemUnit,
  onClear,
  hasActiveFilters,
}) => {
  const [brandOpen, setBrandOpen] = useState(false)
  const [brandSearch, setBrandSearch] = useState("")
  const brandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setBrandOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands
    const q = brandSearch.toLowerCase()
    return brands.filter((b) => b.toLowerCase().includes(q))
  }, [brands, brandSearch])

  function toggleBrand(brand: string) {
    const next = new Set(selectedBrands)
    if (next.has(brand)) next.delete(brand)
    else next.add(brand)
    onBrandsChange(next)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Filter size={14} className="text-label" />

      {/* Brand multi-select */}
      <div ref={brandRef} className="relative">
        <button
          onClick={() => setBrandOpen((o) => !o)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
            selectedBrands.size > 0
              ? "border-primary/50 text-primary bg-primary/5"
              : "border-border text-label hover:text-softwhite"
          }`}
        >
          Brand
          {selectedBrands.size > 0 && (
            <span className="bg-primary text-white rounded-full px-1.5 text-[10px] font-semibold">
              {selectedBrands.size}
            </span>
          )}
          <ChevronDown size={12} />
        </button>

        {brandOpen && (
          <div className="absolute z-50 top-full mt-1 left-0 w-56 bg-surface border border-border rounded-lg shadow-xl overflow-hidden">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-label"
                />
                <input
                  type="text"
                  placeholder="Filter brands..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full bg-background border border-border rounded px-2 py-1.5 pl-7 text-xs text-white placeholder:text-label focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-softwhite hover:bg-surface-light cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.has(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-primary"
                  />
                  {brand}
                </label>
              ))}
              {filteredBrands.length === 0 && (
                <p className="px-3 py-2 text-xs text-label">No brands match.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Weight range */}
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          placeholder="Min"
          value={weightMin}
          onChange={(e) => onWeightMinChange(e.target.value)}
          className="w-20 bg-surface border border-border rounded-md px-2 py-1.5 text-xs text-white placeholder:text-label focus:outline-none focus:border-primary/50 tabular-nums"
          min={0}
          step="any"
        />
        <span className="text-label text-xs">–</span>
        <input
          type="number"
          placeholder="Max"
          value={weightMax}
          onChange={(e) => onWeightMaxChange(e.target.value)}
          className="w-20 bg-surface border border-border rounded-md px-2 py-1.5 text-xs text-white placeholder:text-label focus:outline-none focus:border-primary/50 tabular-nums"
          min={0}
          step="any"
        />
        <span className="text-xs text-label">{itemUnit}</span>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-label hover:text-white transition-colors cursor-pointer"
        >
          <X size={12} />
          Clear
        </button>
      )}
    </div>
  )
}
