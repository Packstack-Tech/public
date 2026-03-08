import { useState, useMemo, useCallback, useRef } from "react"
import {
  type Sex,
  type BodyType,
  type TerrainType,
  type PaceLevel,
  type TempCategory,
  type CalcInputs,
  calculateDailyCalories,
  lbToKg,
  kgToLb,
  inToCm,
  cmToIn,
  miToKm,
  kmToMi,
  ftToM,
  mToFt,
  TERRAIN_LABELS,
  PACE_LABELS,
  TEMP_LABELS,
  BODY_TYPE_LABELS,
} from "../utils/calorieCalculator"

type UnitSystem = "imperial" | "metric"

interface FormState {
  sex: Sex
  age: number
  height: number
  weight: number
  bodyType: BodyType
  totalDays: number
  dailyDistance: number
  dailyElevationGain: number
  packWeight: number
  terrain: TerrainType
  pace: PaceLevel
  temp: TempCategory
  safetyMargin: boolean
}

const IMPERIAL_DEFAULTS: FormState = {
  sex: "male",
  age: 37,
  height: 72,
  weight: 175,
  bodyType: "average",
  totalDays: 3,
  dailyDistance: 10,
  dailyElevationGain: 2000,
  packWeight: 25,
  terrain: "gravel",
  pace: "moderate",
  temp: "moderate",
  safetyMargin: false,
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

function ResultRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-softwhite">{label}</span>
      <div className="text-right">
        <span className="text-white font-semibold">{value}</span>
        {sub && <span className="text-xs text-label ml-1.5">{sub}</span>}
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

export default function CalorieCalculator() {
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
            height: Math.round(inToCm(f.height) * 10) / 10,
            weight: Math.round(lbToKg(f.weight) * 10) / 10,
            dailyDistance: Math.round(miToKm(f.dailyDistance) * 10) / 10,
            dailyElevationGain: Math.round(ftToM(f.dailyElevationGain)),
            packWeight: Math.round(lbToKg(f.packWeight) * 10) / 10,
          }
        }
        return {
          ...f,
          height: Math.round(cmToIn(f.height) * 10) / 10,
          weight: Math.round(kgToLb(f.weight) * 10) / 10,
          dailyDistance: Math.round(kmToMi(f.dailyDistance) * 10) / 10,
          dailyElevationGain: Math.round(mToFt(f.dailyElevationGain)),
          packWeight: Math.round(kgToLb(f.packWeight) * 10) / 10,
        }
      })

      return next
    })
  }, [])

  const results = useMemo(() => {
    const weightKg = system === "imperial" ? lbToKg(form.weight) : form.weight
    const heightCm = system === "imperial" ? inToCm(form.height) : form.height
    const packWeightKg = system === "imperial" ? lbToKg(form.packWeight) : form.packWeight
    const dailyDistanceKm = system === "imperial" ? miToKm(form.dailyDistance) : form.dailyDistance
    const dailyElevationGainM = system === "imperial" ? ftToM(form.dailyElevationGain) : form.dailyElevationGain

    if (weightKg <= 0 || heightCm <= 0 || form.age <= 0 || form.totalDays <= 0) return null

    const inputs: CalcInputs = {
      sex: form.sex,
      age: form.age,
      weightKg,
      heightCm,
      packWeightKg,
      dailyDistanceKm,
      dailyElevationGainM,
      totalDays: form.totalDays,
      terrain: form.terrain,
      pace: form.pace,
      temp: form.temp,
      bodyType: form.bodyType,
      safetyMargin: form.safetyMargin,
    }

    return calculateDailyCalories(inputs)
  }, [form, system])

  const isMetric = system === "metric"
  const weightUnit = isMetric ? "kg" : "lb"
  const heightUnit = isMetric ? "cm" : "in"
  const distanceUnit = isMetric ? "km" : "mi"
  const elevationUnit = isMetric ? "m" : "ft"
  const foodWeightUnit = isMetric ? "kg" : "lb"

  return (
    <div>
      {/* Unit toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.safetyMargin}
              onChange={(e) => update("safetyMargin", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-border rounded-full peer-checked:bg-primary transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
            <span className="text-sm text-softwhite">+10% Safety Margin</span>
          </label>
        </div>
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Input form */}
        <div className="grid gap-4 sm:grid-cols-2 content-start">
          <SectionCard title="Hiker Profile">
            <div>
              <span className="text-sm text-label mb-1.5 block">Sex</span>
              <div className="flex gap-4">
                {(["male", "female"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sex"
                      checked={form.sex === s}
                      onChange={() => update("sex", s)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-white capitalize">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <NumberInput label="Age" value={form.age} onChange={(v) => update("age", v)} min={10} max={100} unit="yrs" />
            <NumberInput label="Height" value={form.height} onChange={(v) => update("height", v)} min={1} unit={heightUnit} step={0.1} />
            <NumberInput label="Body Weight" value={form.weight} onChange={(v) => update("weight", v)} min={1} unit={weightUnit} step={0.1} />
            <SelectInput label="Body Type" value={form.bodyType} onChange={(v) => update("bodyType", v)} options={BODY_TYPE_LABELS} />
          </SectionCard>

          <SectionCard title="Trip Details">
            <NumberInput label="Total Days on Trail" value={form.totalDays} onChange={(v) => update("totalDays", v)} min={1} max={365} unit="days" />
            <NumberInput label="Daily Distance" value={form.dailyDistance} onChange={(v) => update("dailyDistance", v)} min={0.1} unit={distanceUnit} step={0.1} />
            <NumberInput label="Daily Elevation Gain" value={form.dailyElevationGain} onChange={(v) => update("dailyElevationGain", v)} min={0} unit={elevationUnit} />
          </SectionCard>

          <SectionCard title="Gear">
            <NumberInput label="Pack Weight" value={form.packWeight} onChange={(v) => update("packWeight", v)} min={0} unit={weightUnit} step={0.1} />
            <a
              href="https://app.packstack.io"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-1 text-xs text-label hover:text-primary transition-colors no-underline"
            >
              Know your exact pack weight &mdash;{" "}
              <span className="text-primary font-semibold">try Packstack free &rarr;</span>
            </a>
          </SectionCard>

          <SectionCard title="Environment">
            <SelectInput label="Terrain Type" value={form.terrain} onChange={(v) => update("terrain", v)} options={TERRAIN_LABELS} />
            <SelectInput label="Pace" value={form.pace} onChange={(v) => update("pace", v)} options={PACE_LABELS} />
            <SelectInput label="Temperature" value={form.temp} onChange={(v) => update("temp", v)} options={TEMP_LABELS} />
          </SectionCard>
        </div>

        {/* Results panel */}
        <div className="lg:sticky lg:top-6 self-start">
          <div className="bg-surface border border-border rounded-lg p-5">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">Daily Estimate</h3>
            {results ? (
              <>
                <div className="mb-4">
                  <ResultRow label="Hiking Calories" value={results.hikingKcalPerDay.toLocaleString()} sub="kcal" />
                  <ResultRow label="Rest Calories" value={results.restKcalPerDay.toLocaleString()} sub="kcal" />
                  <ResultRow label="Hiking Time" value={`${results.hikingHours}`} sub="hrs" />
                  <ResultRow label="Burn Rate" value={results.hikingKcalPerHour.toLocaleString()} sub="kcal/hr" />
                  <ResultRow label="Water Intake" value={`${results.waterLitersPerDay}`} sub="L / day" />
                </div>

                <div className="bg-primary-glow border border-primary/30 rounded-lg p-4 mb-4">
                  <div className="text-xs text-primary uppercase tracking-wide mb-1">Total Daily Need</div>
                  <div className="text-2xl font-bold text-white">{results.totalDailyKcal.toLocaleString()} <span className="text-sm font-normal text-softwhite">kcal</span></div>
                  <div className="text-sm text-softwhite mt-1">
                    ≈ {isMetric
                      ? `${(results.foodLbPerDay * 0.453592).toFixed(2)} kg`
                      : `${results.foodLbPerDay} lb`
                    } of food / day
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 mt-5">Macros <span className="text-label font-normal">(50 / 30 / 20)</span></h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-background rounded-md p-2 text-center">
                    <div className="text-xs text-label">Carbs</div>
                    <div className="text-white font-semibold text-sm">{results.carbsG}g</div>
                  </div>
                  <div className="bg-background rounded-md p-2 text-center">
                    <div className="text-xs text-label">Fat</div>
                    <div className="text-white font-semibold text-sm">{results.fatG}g</div>
                  </div>
                  <div className="bg-background rounded-md p-2 text-center">
                    <div className="text-xs text-label">Protein</div>
                    <div className="text-white font-semibold text-sm">{results.proteinG}g</div>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3 mt-5">Trip Total ({form.totalDays} {form.totalDays === 1 ? "day" : "days"})</h3>
                <ResultRow label="Total Calories" value={results.totalTripKcal.toLocaleString()} sub="kcal" />
                <ResultRow
                  label="Total Food Weight"
                  value={isMetric
                    ? `${(results.totalTripFoodLb * 0.453592).toFixed(2)}`
                    : `${results.totalTripFoodLb}`
                  }
                  sub={foodWeightUnit}
                />

                {form.safetyMargin && (
                  <div className="mt-3 text-xs text-accent-orange">Includes +10% safety margin</div>
                )}

                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="text-xs text-label">
                    <span className="font-medium text-softwhite">BMR:</span> {results.bmr} kcal &middot;{" "}
                    <span className="font-medium text-softwhite">Baseline:</span> {results.baselineDaily} kcal
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-label">Enter valid inputs to see results.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
