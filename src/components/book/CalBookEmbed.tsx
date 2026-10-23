'use client'

import { useEffect, useMemo, useState } from 'react'

export type BookDuration = 15 | 30 | 45

const DURATIONS: { minutes: BookDuration; slug: string; label: string }[] = [
  { minutes: 15, slug: '15min', label: '15 min' },
  { minutes: 30, slug: '30min', label: '30 min' },
  { minutes: 45, slug: '45min', label: '45 min' },
]

type Props = {
  username: string
  /** Default selected duration */
  defaultMinutes?: BookDuration
}

export default function CalBookEmbed({
  username,
  defaultMinutes = 30,
}: Props) {
  const [minutes, setMinutes] = useState<BookDuration>(defaultMinutes)
  const [loading, setLoading] = useState(true)

  const selected = useMemo(
    () => DURATIONS.find((d) => d.minutes === minutes) ?? DURATIONS[1],
    [minutes]
  )

  const calLink = `${username}/${selected.slug}`
  const src = `https://cal.com/${calLink}?embed=true&theme=dark&layout=month_view`

  useEffect(() => {
    setLoading(true)
  }, [src])

  useEffect(() => {
    // Warm DNS / TLS while the page paints
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = 'https://cal.com'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Meeting length"
      >
        {DURATIONS.map((d) => {
          const active = d.minutes === minutes
          return (
            <button
              key={d.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setMinutes(d.minutes)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-[#e31e24] text-white shadow-sm'
                  : 'border border-white/15 bg-white/5 text-white/75 hover:border-white/30 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          )
        })}
      </div>

      <div className="relative min-h-[720px] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        {loading ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#07080c]/90 px-6 text-center"
            aria-live="polite"
          >
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
              aria-hidden
            />
            <p className="text-sm text-white/60">
              Loading {selected.label} calendar…
            </p>
          </div>
        ) : null}
        <iframe
          key={src}
          title={`Book a ${selected.label} session`}
          src={src}
          className="min-h-[720px] w-full border-0 bg-transparent"
          // Eager: lazy delayed first paint and felt like a hang
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allow="camera; microphone; fullscreen; payment"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  )
}
