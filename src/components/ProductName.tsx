import type { FC } from "react"
import type { Item } from "../types/item"

interface Props {
  item: Item
}

export const ProductName: FC<Props> = ({
  item: { brand, product, product_variant, product_url },
}) => {
  const displayName = () => {
    if (!brand && !product_variant && !product) {
      return "Not specified"
    }

    if (!product_variant && !product) {
      return brand?.name
    }

    if (!product_variant) {
      return `${brand?.name} ${product?.name}`
    }

    return `${brand?.name} ${product?.name} ${product_variant?.name}`
  }

  if (product_url) {
    return (
      <a href={product_url} target="_blank" rel="noreferrer">
        {displayName()}
      </a>
    )
  }

  return <>{displayName()}</>
}
