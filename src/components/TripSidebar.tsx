import { useState, useCallback, type FC } from "react"
import { format } from "date-fns"
import { Flame, Scale } from "lucide-react"
import type { Trip } from "../types/trip"
import type { UserInfo } from "../types/user"
import type { Pack, PackItem } from "../types/pack"
import type { Unit } from "../types/item"
import { DISTANCE_LABEL } from "../types/consts"
import { convertWeight } from "../utils/weight"
import {
  displayDistance,
  displayElevation,
  displayTemperature,
} from "../utils/tripUnits"
import { WeightBreakdownDialog } from "./WeightBreakdownDialog"

const TERRAIN_OPTIONS = [
  { value: "paved", label: "Paved" },
  { value: "gravel", label: "Gravel / Dirt" },
  { value: "rugged", label: "Rugged / Rocky" },
  { value: "sand", label: "Sand" },
  { value: "swamp", label: "Swamp / Marsh" },
]

const PACE_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "fast", label: "Fast" },
]

const TEMP_CATEGORY_OPTIONS = [
  { value: "cold", label: "Cold" },
  { value: "moderate", label: "Moderate" },
  { value: "hot", label: "Hot" },
]

function labelFor(
  value: string | undefined,
  options: { value: string; label: string }[]
) {
  if (!value) return null
  return options.find((o) => o.value === value)?.label ?? value
}

function formatDateRange(start?: string, end?: string) {
  if (!start) return null
  const from = format(new Date(start), "MMM dd, yyyy")
  if (!end) return from
  const to = format(new Date(end), "MMM dd, yyyy")
  return from === to ? from : `${from} – ${to}`
}

function computeAggregateSummary(items: PackItem[], aggregateUnit: Unit) {
  let base = 0
  let worn = 0
  let consumable = 0
  let total = 0
  let totalCalories = 0

  for (const { item, quantity, worn: isWorn } of items) {
    const w =
      convertWeight(item.weight || 0, item.unit, aggregateUnit).weight *
      quantity
    total += w
    if (isWorn) worn += w
    else if (item.consumable) consumable += w
    else base += w
    totalCalories += (item.calories || 0) * quantity
  }

  return {
    base,
    worn,
    consumable,
    total,
    totalCalories: Math.round(totalCalories),
  }
}

interface Props {
  trip: Trip
  user: UserInfo
  packs: Pack[] | null
  aggregateUnit: Unit
}

export const TripSidebar: FC<Props> = ({
  trip,
  user,
  packs,
  aggregateUnit,
}) => {
  const elevationLabel = user.unit_distance === "MI" ? "ft" : "m"

  // Stored values are canonical metric (km, m, °C); convert to the owner's
  // display units so this matches the editor rather than mislabeling raw metric.
  const tempMin =
    trip.temp_min != null ? displayTemperature(trip.temp_min, user) : "—"
  const tempMax =
    trip.temp_max != null ? displayTemperature(trip.temp_max, user) : "—"

  const detailRows = [
    { label: "Location", value: trip.location || null },
    {
      label: "Dates",
      value: formatDateRange(trip.start_date, trip.end_date),
    },
    {
      label: "Distance",
      value: trip.distance
        ? `${displayDistance(trip.distance, user)} ${DISTANCE_LABEL[user.unit_distance]}`
        : null,
    },
    {
      label: "Elevation",
      value: trip.daily_elevation_gain
        ? `${displayElevation(trip.daily_elevation_gain, user)} ${elevationLabel}/day`
        : null,
    },
    {
      label: "Temperature",
      value:
        trip.temp_min != null || trip.temp_max != null
          ? `${tempMin}°${user.unit_temperature} – ${tempMax}°${user.unit_temperature}`
          : null,
    },
    { label: "Terrain", value: labelFor(trip.terrain, TERRAIN_OPTIONS) },
    { label: "Pace", value: labelFor(trip.pace, PACE_OPTIONS) },
    {
      label: "Conditions",
      value: labelFor(trip.temp_category, TEMP_CATEGORY_OPTIONS),
    },
  ].filter(
    (r): r is { label: string; value: string } => r.value != null
  )

  const allItems = packs?.flatMap((p) => p.items) ?? []
  const totals =
    allItems.length > 0
      ? computeAggregateSummary(allItems, aggregateUnit)
      : null
  const fmt = (v: number) => `${v.toFixed(2)} ${aggregateUnit}`

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <h1 className="text-lg font-semibold">
          {trip.location || trip.title}
        </h1>
        {trip.location && trip.title !== trip.location && (
          <p className="text-xs text-label mt-0.5">{trip.title}</p>
        )}
        {trip.notes && <NotesField text={trip.notes} />}
      </div>

      {totals && (
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold inline-flex items-center gap-1.5">
              <Scale size={14} className="text-primary" />
              Total Weight
            </h3>
            <WeightBreakdownDialog
              items={allItems}
              aggregateUnit={aggregateUnit}
            />
          </div>
          <div className="text-xs rounded-lg border border-border overflow-hidden">
            <div className="px-3 py-1.5 space-y-0.5">
              <div className="flex justify-between py-0.5">
                <p className="text-label">Base</p>
                <p className="text-softwhite">{fmt(totals.base)}</p>
              </div>
              <div className="flex justify-between py-0.5">
                <p className="text-label">Worn</p>
                <p className="text-softwhite">{fmt(totals.worn)}</p>
              </div>
              <div className="flex justify-between py-0.5">
                <p className="text-label">Consumable</p>
                <p className="text-softwhite">{fmt(totals.consumable)}</p>
              </div>
              <div className="flex justify-between py-0.5 border-t border-border mt-1 pt-1">
                <p className="font-semibold">Total</p>
                <p className="font-semibold text-primary">
                  {fmt(totals.total)}
                </p>
              </div>
            </div>
          </div>
          {totals.totalCalories > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-xs">
              <Flame size={13} className="text-orange-400" />
              <span className="text-label">Calories</span>
              <span className="text-orange-400 font-bold">
                {totals.totalCalories.toLocaleString()} kcal
              </span>
            </div>
          )}
        </div>
      )}

      {detailRows.length > 0 && (
        <div className="px-5 py-4 border-b border-border space-y-3">
          {detailRows.map(({ label, value }) => (
            <div key={label}>
              <p className="text-label text-xs">{label}</p>
              <p className="text-softwhite text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function NotesField({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  const measuredRef = useCallback((node: HTMLParagraphElement | null) => {
    if (node) setClamped(node.scrollHeight > node.clientHeight)
  }, [])

  return (
    <div className="mt-2">
      <p
        ref={measuredRef}
        className={`text-xs text-label ${expanded ? "" : "line-clamp-3"}`}
      >
        {text}
      </p>
      {(clamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-primary hover:underline mt-0.5 cursor-pointer"
        >
          {expanded ? "read less..." : "read more..."}
        </button>
      )}
    </div>
  )
}
