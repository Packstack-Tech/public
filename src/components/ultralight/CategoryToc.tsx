import { useState, useEffect } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import type { CategoryGroup } from "../../types/catalog"
import { API_BASE } from "../../utils/catalog"

export default function CategoryToc() {
  const [categories, setCategories] = useState<CategoryGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch(`${API_BASE}/resources/catalog/categories`)
      .then((r) => r.json())
      .then((data) => {
        setCategories(data)
        setExpanded(new Set(data.map((c: CategoryGroup) => c.category)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function toggle(cat: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (categories.length === 0) {
    return <p className="text-label text-sm">Unable to load categories.</p>
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((group) => {
        const isExpanded = expanded.has(group.category)
        const totalProducts = group.subcategories.reduce(
          (sum, s) => sum + s.product_count,
          0
        )

        return (
          <div
            key={group.category}
            className="bg-surface border border-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggle(group.category)}
              className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-light transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm">
                  {group.category}
                </span>
                <span className="text-xs text-label tabular-nums">
                  {totalProducts}
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`text-label transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isExpanded && (
              <div className="border-t border-border">
                {group.subcategories.map((sub) => (
                  <a
                    key={sub.slug}
                    href={`/tools/ultralight-research/${sub.slug}`}
                    className="flex items-center justify-between px-4 py-2 text-sm text-softwhite hover:text-white hover:bg-surface-light transition-colors no-underline"
                  >
                    <span>{sub.name}</span>
                    <span className="text-xs text-label tabular-nums">
                      {sub.product_count}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
