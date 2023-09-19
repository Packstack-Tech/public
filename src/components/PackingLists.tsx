import type { TripInfo } from "../types/trip"
import List from "./List"

interface Props {
  trip: TripInfo
}

export default function PackingLists({ trip }: Props) {
  return (
    <div className="packing-list">
      <h2>Packing List</h2>
      <ul>
        {trip.packs.map((pack, index) => (
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
