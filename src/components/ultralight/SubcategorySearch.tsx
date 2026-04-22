import { useState, useEffect, useRef, useMemo } from "react"
import { Search } from "lucide-react"
import type { CategoryGroup } from "../../types/catalog"
import { API_BASE } from "../../utils/catalog"

type FlatEntry = {
  category: string
  name: string
  slug: string
  product_count: number
}

export default function SubcategorySearch() {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API_BASE}/resources/catalog/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  const flat = useMemo<FlatEntry[]>(() => {
    const entries: FlatEntry[] = []
    for (const group of categories) {
      for (const sub of group.subcategories) {
        entries.push({
          category: group.category,
          name: sub.name,
          slug: sub.slug,
          product_count: sub.product_count,
        })
      }
    }
    return entries
  }, [categories])

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return flat.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    )
  }, [flat, query])

  useEffect(() => {
    setActiveIdx(-1)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function navigate(slug: string) {
    window.location.href = `/tools/ultralight-research/${slug}`
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || filtered.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault()
      navigate(filtered[activeIdx].slug)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative max-w-xl">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-label"
        />
        <input
          type="text"
          placeholder="Search gear categories (e.g. tent, stove, sleeping bag)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-label focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-surface border border-border rounded-lg shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          {filtered.map((entry, i) => (
            <button
              key={entry.slug}
              onClick={() => navigate(entry.slug)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm transition-colors cursor-pointer ${
                i === activeIdx
                  ? "bg-primary/10 text-white"
                  : "text-softwhite hover:bg-surface-light"
              }`}
            >
              <span>
                <span className="text-white font-medium">{entry.name}</span>
                <span className="text-label ml-2 text-xs">{entry.category}</span>
              </span>
              <span className="text-xs text-label tabular-nums">
                {entry.product_count} products
              </span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && filtered.length === 0 && categories.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-surface border border-border rounded-lg shadow-xl p-4">
          <p className="text-sm text-label">No matching categories found.</p>
        </div>
      )}
    </div>
  )
}
