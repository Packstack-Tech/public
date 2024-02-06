import type { Pack } from "../types/pack"
import { List } from "./List"

interface Props {
  packs: Pack[]
}

export default function PackingLists({ packs }: Props) {
  return (
    <div>
      {packs.map((pack, index) => (
        <div key={pack.id} className="mb-8">
          <h2 key={index} className="border-b pb-2">
            {pack.title}
          </h2>
          <List items={pack.items} />
        </div>
      ))}
    </div>
  )
}
