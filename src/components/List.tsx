import type { PackItem } from "../types/pack"

interface Props {
  items: PackItem[]
}

export default function List({ items }: Props) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.item.name}</li>
      ))}
    </ul>
  )
}
