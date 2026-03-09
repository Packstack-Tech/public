import { useState, useMemo, useCallback, useRef } from "react"
import {
  type SweatRate,
  type WaterCalcInputs,
  calculateWaterCarry,
  miToKm,
  kmToMi,
  ftToM,
  mToFt,
  lbToKg,
  kgToLb,
  fToC,
  cToF,
  mphToKmh,
  kmhToMph,
  SWEAT_LABELS,
} from "../utils/waterCarryCalculator"

type UnitSystem = "imperial" | "metric"

interface FormState {
  distance: number
  elevationGain: number
  pace: number
  temperature: number
  sweatRate: SweatRate
  packWeight: number
  dryCamp: boolean
}

const IMPERIAL_DEFAULTS: FormState = {
  distance: 10,
  elevationGain: 2000,
  pace: 2.5,
  temperature: 75,
  sweatRate: "medium",
  packWeight: 25,
  dryCamp: false,
}

function NumberInput({
  label,
  value,
  onChange,
  unit,
  min = 0,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  unit?: string
  min?: number
  max?: number
  step?: number
}) {
  const [raw, setRaw] = useState(String(value))
  const prevValue = useRef(value)

  if (value !== prevValue.current) {
    prevValue.current = value
    setRaw(String(value))
  }

  return (
    <label className="block">
      <span className="text-sm text-label mb-1 block">{label}</span>
      <div className="flex items-stretch">
        <input
          type="number"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value)
            onChange(e.target.value === "" ? 0 : Number(e.target.value))
          }}
          onBlur={() => {
            if (raw === "" || raw === "-") setRaw("0")
          }}
          min={min}
          max={max}
          step={step}
          className="w-full bg-background border border-border rounded-l-md px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {unit && (
          <span className="bg-surface-light border border-l-0 border-border rounded-r-md px-3 py-2 text-xs text-label flex items-center whitespace-nowrap">
            {unit}
          </span>
        )}
      </div>
    </label>
  )
}

function SelectInput<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: Record<T, string>
}) {
  return (
    <label className="block">
      <span className="text-sm text-label mb-1 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full bg-background border border-border rounded-md pl-3 pr-8 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
      >
        {(Object.keys(options) as T[]).map((key) => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </select>
    </label>
  )
}

function StepRow({ label, value, op }: { label: string; value: string; op?: string }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 text-sm">
      <span className="text-softwhite">{label}</span>
      <div className="text-right flex items-baseline gap-1.5">
        {op && <span className="text-xs text-label">{op}</span>}
        <span className="text-white font-semibold">{value}</span>
      </div>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">{title}</h3>
      <div className="grid gap-3">
        {children}
      </div>
    </div>
  )
}

export default function WaterCarryEstimator() {
  const [system, setSystem] = useState<UnitSystem>(() => {
    if (typeof window === "undefined") return "imperial"
    return (localStorage.getItem("packstack-unit-pref") as UnitSystem) || "imperial"
  })

  const [form, setForm] = useState<FormState>(IMPERIAL_DEFAULTS)

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const toggleSystem = useCallback(() => {
    setSystem((prev) => {
      const next: UnitSystem = prev === "imperial" ? "metric" : "imperial"
      localStorage.setItem("packstack-unit-pref", next)

      setForm((f) => {
        if (next === "metric") {
          return {
            ...f,
            distance: Math.round(miToKm(f.distance) * 10) / 10,
            elevationGain: Math.round(ftToM(f.elevationGain)),
            pace: Math.round(mphToKmh(f.pace) * 10) / 10,
            temperature: Math.round(fToC(f.temperature)),
            packWeight: Math.round(lbToKg(f.packWeight) * 10) / 10,
          }
        }
        return {
          ...f,
          distance: Math.round(kmToMi(f.distance) * 10) / 10,
          elevationGain: Math.round(mToFt(f.elevationGain)),
          pace: Math.round(kmhToMph(f.pace) * 10) / 10,
          temperature: Math.round(cToF(f.temperature)),
          packWeight: Math.round(kgToLb(f.packWeight) * 10) / 10,
        }
      })

      return next
    })
  }, [])

  const results = useMemo(() => {
    const isMetric = system === "metric"
    const distanceKm = isMetric ? form.distance : miToKm(form.distance)
    const elevationGainM = isMetric ? form.elevationGain : ftToM(form.elevationGain)
    const temperatureF = isMetric ? cToF(form.temperature) : form.temperature
    const packWeightKg = isMetric ? form.packWeight : lbToKg(form.packWeight)
    const paceKmh = isMetric ? form.pace : mphToKmh(form.pace)

    if (distanceKm <= 0 || paceKmh <= 0) return null

    const inputs: WaterCalcInputs = {
      distanceKm,
      elevationGainM,
      temperatureF,
      sweatRate: form.sweatRate,
      dryCamp: form.dryCamp,
      packWeightKg,
      paceKmh,
    }

    return calculateWaterCarry(inputs)
  }, [form, system])

  const isMetric = system === "metric"
  const distanceUnit = isMetric ? "km" : "mi"
  const elevationUnit = isMetric ? "m" : "ft"
  const paceUnit = isMetric ? "km/h" : "mph"
  const tempUnit = isMetric ? "°C" : "°F"
  const weightUnit = isMetric ? "kg" : "lb"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.dryCamp}
            onChange={(e) => update("dryCamp", e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-border rounded-full peer-checked:bg-primary transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
          <span className="text-sm text-softwhite">Dry Camp (no water at site)</span>
        </label>
        <div className="inline-flex rounded-md border border-border text-xs">
          <button
            onClick={toggleSystem}
            className={`px-3 py-1.5 rounded-l-md transition-colors cursor-pointer ${
              system === "imperial" ? "bg-primary text-white" : "text-label hover:text-white"
            }`}
          >
            Imperial
          </button>
          <button
            onClick={toggleSystem}
            className={`px-3 py-1.5 rounded-r-md transition-colors cursor-pointer ${
              system === "metric" ? "bg-primary text-white" : "text-label hover:text-white"
            }`}
          >
            Metric
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 content-start">
          <SectionCard title="Route">
            <NumberInput label="Distance Between Sources" value={form.distance} onChange={(v) => update("distance", v)} min={0} unit={distanceUnit} step={0.1} />
            <NumberInput label="Total Elevation Gain" value={form.elevationGain} onChange={(v) => update("elevationGain", v)} min={0} unit={elevationUnit} />
            <NumberInput label="Pace" value={form.pace} onChange={(v) => update("pace", v)} min={0.1} unit={paceUnit} step={0.1} />
          </SectionCard>

          <SectionCard title="Conditions">
            <NumberInput label="Temperature" value={form.temperature} onChange={(v) => update("temperature", v)} min={-40} max={130} unit={tempUnit} />
            <SelectInput label="Sweat Rate" value={form.sweatRate} onChange={(v) => update("sweatRate", v)} options={SWEAT_LABELS} />
            <NumberInput label="Pack Weight" value={form.packWeight} onChange={(v) => update("packWeight", v)} min={0} unit={weightUnit} step={0.1} />
          </SectionCard>
        </div>

        <div className="lg:sticky lg:top-6 self-start">
          <div className="bg-surface border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">Calculation Breakdown</h3>
            {results ? (
              <>
                <div className="mb-4 border-b border-border/50 pb-3">
                  <StepRow label="Hiking time" value={`${results.hikingHours} hrs`} />
                  <StepRow label="Baseline (0.5 L/hr)" value={`${results.baselineLiters} L`} />
                  <StepRow label={`Temp multiplier`} value={`${results.afterTemp} L`} op={`×${results.tempMultiplier}`} />
                  <StepRow label="Elevation penalty" value={`${results.afterElevation} L`} op={`+${results.elevationPenaltyL} L`} />
                  {results.loadMultiplier > 1 && (
                    <StepRow label="Heavy pack (+10%)" value={`${results.afterLoad} L`} op={`×${results.loadMultiplier}`} />
                  )}
                  <StepRow label="Sweat rate" value={`${results.subtotal} L`} op={`×${results.physiologyMultiplier}`} />
                  {results.dryCampAddition > 0 && (
                    <StepRow label="Dry camp" value={`${(results.subtotal + results.dryCampAddition).toFixed(2)} L`} op={`+${results.dryCampAddition} L`} />
                  )}
                  <StepRow label="Safety buffer" value={`+${results.safetyBuffer} L`} />
                </div>

                <div className="bg-primary-glow border border-primary/30 rounded-lg p-4 mb-4">
                  <div className="text-xs text-primary uppercase tracking-wide mb-1">Total Water to Carry</div>
                  <div className="text-2xl font-bold text-white">{results.totalLiters} <span className="text-sm font-normal text-softwhite">liters</span></div>
                  <div className="text-sm text-softwhite mt-1">
                    Weighs {isMetric
                      ? `${results.weightKg} kg`
                      : `${results.weightLb} lbs`
                    }
                  </div>
                </div>

                <div className="bg-surface-light border border-border rounded-lg p-3 mb-3">
                  <div className="text-xs font-semibold text-accent-green mb-1">Pro Tip: Camel Up</div>
                  <p className="text-xs text-softwhite leading-relaxed">
                    Drink 0.5 L at the water source before you leave to start fully hydrated. This water is free weight — it's in your body, not on your back.
                  </p>
                </div>

                <div className="text-xs text-label mt-3">
                  Includes a hard {results.safetyBuffer} L safety buffer. It's always better to finish with a few sips left than to run dry a mile from the stream.
                </div>
              </>
            ) : (
              <p className="text-sm text-label">Enter a distance and pace to see results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
