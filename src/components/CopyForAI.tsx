import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Copy, Loader2, Sparkles } from "lucide-react"

interface Props {
  /** The trip's public identifier (uuid preferred, numeric id as fallback). */
  tripKey: string | number
  /** Only enable once the pack list has rendered, so the two never disagree. */
  ready: boolean
}

/**
 * Prompt prepended to the exported markdown so the user can paste straight
 * into an assistant without writing anything. Kept deliberately open-ended:
 * the user adds their own goals, budget and experience in the conversation.
 */
const PROMPT_PREAMBLE = `Please give this backpacking gear list a shakedown. Review it against the trip details below and tell me:

1. Anything that looks too heavy for its job, and lighter alternatives worth considering
2. Redundant or unnecessary items I could leave behind
3. Gear that seems to be missing for these conditions — especially safety items (navigation, first aid, shelter, insulation, water, fire, light, sun, repair, emergency)
4. Whether the sleep system, shelter and clothing look right for the forecast temperature range and terrain
5. Anything else you'd flag before I head out

Ask me about anything you need to know that isn't listed (budget, experience, non-negotiables, resupply, water sources).

---

`

type Status = "idle" | "loading" | "copied" | "error"

export function CopyForAI({ tripKey, ready }: Props) {
  const [status, setStatus] = useState<Status>("idle")
  const [fallbackText, setFallbackText] = useState<string | null>(null)
  const cache = useRef<Promise<string> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const url = `https://api.packstack.io/trip/${tripKey}/ai-review`

  const load = useCallback(() => {
    if (!cache.current) {
      cache.current = fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load AI review export")
          return res.text()
        })
        .then((md) => PROMPT_PREAMBLE + md)
        .catch((err) => {
          // Let the next click retry rather than caching the failure.
          cache.current = null
          throw err
        })
    }
    return cache.current
  }, [url])

  // Warm the cache once the page is interactive so the click itself is fast
  // and (in Safari) still inside the user-gesture window for the clipboard.
  useEffect(() => {
    if (ready) load().catch(() => {})
  }, [ready, load])

  const copy = useCallback(async () => {
    setStatus("loading")
    let text: string
    try {
      text = await load()
    } catch {
      setStatus("error")
      return
    }

    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard")
      await navigator.clipboard.writeText(text)
      setStatus("copied")
      setTimeout(() => setStatus("idle"), 2500)
    } catch {
      // Clipboard blocked (insecure context, permissions, old browser):
      // show the text so the user can select and copy it themselves.
      setFallbackText(text)
      setStatus("idle")
    }
  }, [load])

  useEffect(() => {
    if (fallbackText && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [fallbackText])

  return (
    <section className="mt-4 border-t border-border pt-6 pb-2">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="max-w-xl">
          <h3 className="text-sm font-semibold inline-flex items-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            Get an AI shakedown
          </h3>
          <p className="text-xs text-label mt-1.5 leading-relaxed">
            Copy this trip and gear list as text formatted for AI assistants,
            then paste it into ChatGPT, Claude, Gemini or any other chatbot.
            It includes the trip details, precomputed base, worn and consumable
            weights, and every item with its weight in grams and ounces — plus a
            prompt asking for a review of heavy items, redundancies, missing
            safety gear and whether the kit fits the conditions. Add your own
            goals, budget and experience to the conversation for a sharper
            answer.
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          disabled={!ready || status === "loading"}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-default"
        >
          {status === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : status === "copied" ? (
            <Check size={16} />
          ) : (
            <Copy size={16} />
          )}
          {status === "copied" ? "Copied!" : "Copy for AI"}
        </button>
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400 mt-3">
          Couldn't build the export right now. Please try again in a moment.
        </p>
      )}

      {fallbackText && (
        <div className="mt-4">
          <p className="text-xs text-label mb-2">
            Your browser blocked automatic copying. Select the text below and
            copy it manually.
          </p>
          <textarea
            ref={textareaRef}
            readOnly
            value={fallbackText}
            rows={12}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-xs text-softwhite font-mono focus:outline-none"
          />
        </div>
      )}
    </section>
  )
}
