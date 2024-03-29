import { format } from "date-fns"
import type { Trip } from "../types/trip"
import type { UserInfo } from "../types/user"
import { DISTANCE_LABEL } from "../types/consts"
import { Calendar as CalendarIcon, Route as RouteIcon } from "lucide-react"

const DATE_FORMAT = "MMM dd, yyyy"

interface Props {
  trip: Trip
  user: UserInfo
}

export const PackHeader = ({ trip, user }: Props) => {
  const start = trip.start_date
    ? format(new Date(trip.start_date), DATE_FORMAT)
    : "-"
  const end = trip.end_date ? format(new Date(trip.end_date), DATE_FORMAT) : "-"
  const dayTrip = start === end

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-4">
        <div className="logo w-32">
          <img src="/packstack_logo_white.png" title="Packstack logo" />
        </div>
      </div>
      <div className="my-4 space-y-1">
        <h1>{trip.location || trip.title}</h1>
        {trip.start_date && (
          <p className="flex items-center text-sm">
            <CalendarIcon className="inline-block mr-2 h-4 w-4" />
            {dayTrip ? start : `${start} - ${end}`}
          </p>
        )}
        {!!(trip.distance ?? 0) && (
          <p className="flex items-center text-sm">
            <RouteIcon className="inline-block mr-2 h-4 w-4" />
            {trip.distance} {DISTANCE_LABEL[user.unit_distance]}
          </p>
        )}
      </div>
    </div>
  )
}
