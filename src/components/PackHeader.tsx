import type { Trip } from "../types/trip"

interface Props {
  trip: Trip
}

export const PackHeader = ({ trip }: Props) => (
  <div className="mb-4">
    <div className="flex justify-between mb-4">
      <div className="logo w-32">
        <img src="/packstack_logo_white.png" title="Packstack logo" />
      </div>
    </div>
    <div className="border-2 border-surface rounded-md p-4">
      <h1 className="font-bold text-lg">{trip.location || trip.title}</h1>
      <h2></h2>
    </div>
  </div>
)
