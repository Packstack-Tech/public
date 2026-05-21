import { useEffect, useState, useCallback } from "react"
import { Loader2, Copy, Check } from "lucide-react"
import type { Pack } from "../types/pack"
import type { Trip } from "../types/trip"
import type { UserInfo } from "../types/user"
import { useUnitPreference } from "../hooks/useUnitPreference"
import { TripSidebar } from "./TripSidebar"
import { PackingLists } from "./PackingLists"

interface Props {
  trip: Trip
  user: UserInfo
}

export default function PackPageContent({ trip, user }: Props) {
  const { system, aggregateUnit, itemUnit, toggleSystem } = useUnitPreference()
  const [packs, setPacks] = useState<Pack[] | null>(null)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  const apiUrl = `https://api.packstack.io/pack/trip/${trip.id}/public`

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(apiUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [apiUrl])

  useEffect(() => {
    let cancelled = false
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load packs")
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setPacks(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [apiUrl])

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
                  ? "bg-primary text-white"
                  : "text-label hover:text-white"
              }`}
            >
              Metric
            </button>
            <button
              onClick={toggleSystem}
              className={`px-3 py-1.5 rounded-r-md transition-colors cursor-pointer ${
                system === "imperial"
                  ? "bg-primary text-white"
                  : "text-label hover:text-white"
              }`}
            >
              Imperial
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-label py-12">
            Unable to load pack items. Please try refreshing the page.
          </p>
        )}

        {!packs && !error && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {packs && (
          <>
            <PackingLists
              packs={packs}
              aggregateUnit={aggregateUnit}
              itemUnit={itemUnit}
            />

            <div className="mt-4 border-t border-border pt-6 pb-2">
              <p className="text-xs text-label mb-2">
                Want the raw data? Retrieve this packing list from the
                endpoint below.
              </p>
              <div className="flex items-stretch">
                <input
                  type="text"
                  readOnly
                  value={apiUrl}
                  className="flex-1 bg-surface border border-border rounded-l-md px-3 py-2 text-xs text-softwhite font-mono select-all focus:outline-none"
                />
                <button
                  onClick={copyUrl}
                  className="flex items-center gap-1.5 bg-surface border border-l-0 border-border rounded-r-md px-3 text-xs text-label hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
