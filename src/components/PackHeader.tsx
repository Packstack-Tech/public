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
    <div className="mb-8">
      <h1 className="text-2xl">{trip.location || trip.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-softwhite">
        {trip.start_date && (
          <span className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-label" />
            {dayTrip ? start : `${start} - ${end}`}
          </span>
        )}
        {!!(trip.distance ?? 0) && (
          <span className="flex items-center text-sm">
            <RouteIcon className="mr-2 h-4 w-4 text-label" />
            {trip.distance} {DISTANCE_LABEL[user.unit_distance]}
          </span>
        )}
      </div>
    </div>
  )
}
