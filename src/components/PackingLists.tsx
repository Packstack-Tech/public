import type { Pack } from "../types/pack"
import List from "./List"

interface Props {
  packs: Pack[]
}

export default function PackingLists({ packs }: Props) {
  return (
    <div className="packing-list">
      <ul>
        {packs.map((pack, index) => (
          <div key={pack.id}>
            <h2 key={index} className="font-bold">
              {pack.title}
            </h2>
            <List items={pack.items} />
          </div>
        ))}
      </ul>
    </div>
  )
}
