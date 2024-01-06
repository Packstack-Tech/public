import type { Trip } from "../types/trip"
import type { UserInfo } from "../types/user"

interface Props {
  trip: Trip
  user: UserInfo
}

export const PackHeader = ({ trip }: Props) => (
  <div className="mb-4">
    <div className="flex justify-between mb-4">
      <div className="logo w-32">
        <img src="/packstack_logo_white.png" title="Packstack logo" />
      </div>
    </div>
    <div className="my-4">
      <h1>{trip.location || trip.title}</h1>
    </div>
  </div>
)
