import type { Pack } from "../types/pack"
import type { Trip } from "../types/trip"
import type { UserInfo } from "../types/user"
import { useUnitPreference } from "../hooks/useUnitPreference"
import { TripSidebar } from "./TripSidebar"
import { PackingLists } from "./PackingLists"

interface Props {
  trip: Trip
  user: UserInfo
  /** Server-fetched; the component never loads data itself. */
  packs: Pack[]
}

export default function PackPageContent({ trip, user, packs }: Props) {
  // Start from the owner's units so the server-rendered numbers match what
  // they entered; the visitor's own saved choice is applied after mount.
  const { system, aggregateUnit, itemUnit, toggleSystem } = useUnitPreference(
    user.unit_weight === "IMPERIAL" ? "imperial" : "metric"
  )

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-border lg:sticky lg:top-[57px] lg:self-start lg:h-[calc(100vh-57px)] lg:overflow-y-auto">
        <TripSidebar
          trip={trip}
          user={user}
          packs={packs}
          aggregateUnit={aggregateUnit}
        />
      </aside>

      <main className="flex-1 min-w-0 px-4 md:px-8 py-8 max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md border border-border text-xs">
            <button
              onClick={toggleSystem}
              className={`px-3 py-1.5 rounded-l-md transition-colors cursor-pointer ${
                system === "metric"
                  ? "bg-primary text-on-primary"
                  : "text-label hover:text-white"
              }`}
            >
              Metric
            </button>
            <button
              onClick={toggleSystem}
              className={`px-3 py-1.5 rounded-r-md transition-colors cursor-pointer ${
                system === "imperial"
                  ? "bg-primary text-on-primary"
                  : "text-label hover:text-white"
              }`}
            >
              Imperial
            </button>
          </div>
        </div>

        {packs.length === 0 ? (
          <p className="text-center text-label py-12">
            This trip doesn't have any gear yet.
          </p>
        ) : (
          <PackingLists
            packs={packs}
            aggregateUnit={aggregateUnit}
            itemUnit={itemUnit}
          />
        )}
      </main>
    </div>
  )
}
