import { Fragment, type FC } from "react"
import { ChevronDown, ExternalLink, Package } from "lucide-react"
import type { CatalogProduct, CatalogVariant } from "../../types/catalog"
import type { Unit } from "../../types/item"
import { formatItemWeight } from "../../utils/weight"

interface Props {
  product: CatalogProduct
  expanded: boolean
  onToggle: () => void
  itemUnit: Unit
  medianWeightG: number | null
}

function specKeyToLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatWeight(variant: CatalogVariant, itemUnit: Unit): string {
  if (variant.weight == null || !variant.weight_unit) return "—"
  return formatItemWeight(variant.weight, variant.weight_unit as Unit, itemUnit)
}

function deltaLabel(lightestG: number | null, medianG: number | null): string | null {
  if (lightestG == null || medianG == null || medianG === 0) return null
  const pct = ((medianG - lightestG) / medianG) * 100
  if (pct < 10) return null
  return `${Math.round(pct)}% lighter`
}

export const GearRow: FC<Props> = ({
  product,
  expanded,
  onToggle,
  itemUnit,
  medianWeightG,
}) => {
  const hasMultipleVariants = product.variants.length > 1
  const primaryVariant = product.variants[0]
  const primaryImage = product.variants.find((v) => v.image_url)?.image_url
  const delta = deltaLabel(product.lightest_weight_g, medianWeightG)

  const lightestWeight =
    product.lightest_weight_g != null
      ? formatItemWeight(product.lightest_weight_g, "g", itemUnit)
      : "—"

  const allSpecs = product.variants.reduce<Record<string, string>>(
    (acc, v) => ({ ...acc, ...(v.additional_specs || {}) }),
    {}
  )
  const hasSpecs = Object.keys(allSpecs).length > 0
  const hasDescription = product.variants.some((v) => v.description)
  const isExpandable = hasSpecs || hasDescription || hasMultipleVariants

  return (
    <Fragment>
      <tr
        onClick={isExpandable ? onToggle : undefined}
        className={`${isExpandable ? "cursor-pointer" : ""} group`}
      >
        {/* Image */}
        <td className="py-2.5 px-3 w-[48px]">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.product_name}
              className="w-10 h-10 rounded object-cover bg-background"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-background flex items-center justify-center">
              <Package size={16} className="text-label" />
            </div>
          )}
        </td>

        {/* Product name */}
        <td className="py-2.5 px-3">
          <div>
            <span className="text-white text-sm font-medium">
              {product.brand_name}
            </span>
            <span className="text-softwhite text-sm ml-1.5">
              {product.product_name}
            </span>
          </div>
          {hasMultipleVariants && (
            <span className="text-xs text-label">
              {product.variants.length} variants
            </span>
          )}
        </td>

        {/* Weight */}
        <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap text-sm text-white">
          {lightestWeight}
        </td>

        {/* Delta */}
        <td className="py-2.5 px-3 text-right hidden sm:table-cell">
          {delta && (
            <span className="inline-block text-[11px] font-medium text-accent-green bg-accent-green/10 rounded-full px-2 py-0.5">
              {delta}
            </span>
          )}
        </td>

        {/* Link */}
        <td className="py-2.5 px-3 text-center">
          {product.product_url && (
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-label hover:text-primary transition-colors"
              title="View product"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </td>

        {/* Expand */}
        <td className="py-2.5 px-3 text-center w-[40px]">
          {isExpandable && (
            <ChevronDown
              size={14}
              className={`text-label transition-transform inline-block ${
                expanded ? "rotate-180" : ""
              }`}
            />
          )}
        </td>
      </tr>

      {expanded && isExpandable && (
        <tr className="border-none">
          <td colSpan={6} className="px-3 pb-4 pt-0">
            <div className="bg-background rounded-lg p-4 ml-[48px] flex flex-col md:flex-row gap-6">
              {/* Left: larger image */}
              {primaryImage && (
                <div className="shrink-0">
                  <img
                    src={primaryImage}
                    alt={product.product_name}
                    className="w-28 h-28 rounded-lg object-cover bg-surface"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-4">
                {/* Description */}
                {primaryVariant?.description && (
                  <p className="text-sm text-softwhite leading-relaxed">
                    {primaryVariant.description}
                  </p>
                )}

                {/* Variant sub-table */}
                {hasMultipleVariants && (
                  <div>
                    <h4 className="text-xs text-label uppercase tracking-wider mb-2 font-normal">
                      Variants
                    </h4>
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-none">
                          <th className="text-left text-label py-1 font-normal">
                            Variant
                          </th>
                          <th className="text-right text-label py-1 font-normal">
                            Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((v) => (
                          <tr key={v.id} className="border-surface">
                            <td className="py-1 text-softwhite">
                              {v.variant_name || v.display_name}
                            </td>
                            <td className="py-1 text-right tabular-nums text-white">
                              {formatWeight(v, itemUnit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Additional specs */}
                {hasSpecs && (
                  <div>
                    <h4 className="text-xs text-label uppercase tracking-wider mb-2 font-normal">
                      Specs
                    </h4>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                      {Object.entries(allSpecs).map(([key, val]) => (
                        <Fragment key={key}>
                          <dt className="text-label">{specKeyToLabel(key)}</dt>
                          <dd className="text-softwhite">{val}</dd>
                        </Fragment>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Product link */}
                {product.product_url && (
                  <a
                    href={product.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-white transition-colors"
                  >
                    View product
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  )
}
