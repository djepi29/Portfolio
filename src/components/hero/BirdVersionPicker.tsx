'use client'

import { useEffect, useRef, useState } from 'react'
import {
  BIRD_TRAIN_VERSIONS,
  type BirdTrainVersion,
} from '@/components/hero/birdTrainVersions'

export default function BirdVersionPicker({
  version,
  onChange,
}: {
  version: BirdTrainVersion
  onChange: (v: BirdTrainVersion) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <div ref={rootRef} className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4">
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label="Choose bird training version"
        className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:scale-105 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:h-12 sm:w-12"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current text-[#ffd6aa] drop-shadow-[0_0_8px_rgba(255,214,170,0.35)] transition group-hover:text-white"
          aria-hidden
        >
          <path d="M12 2.5l2.6 6.3 6.9.6-5.2 4.5 1.6 6.7L12 16.8 6.1 20.6l1.6-6.7L2.5 9.4l6.9-.6L12 2.5z" />
        </svg>
      </button>

      {menuOpen ? (
        <div
          role="menu"
          aria-label="Bird training versions"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-white/12 bg-[#0c0e14]/95 py-1 shadow-2xl backdrop-blur-md"
        >
          <p className="px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
            Training versions
          </p>
          {BIRD_TRAIN_VERSIONS.map((v) => {
            const active = v.id === version.id
            return (
              <button
                key={v.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  onChange(v)
                  setMenuOpen(false)
                }}
                className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition ${
                  active
                    ? 'bg-[#e31e24]/20 text-white'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-sm font-medium">{v.label}</span>
                <span className="text-[11px] text-white/45">{v.blurb}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
