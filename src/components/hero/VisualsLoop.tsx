'use client'

import { useEffect, useState } from 'react'
import OriginalVisual from '@/components/hero/OriginalVisual'
import CalendarVisual from '@/components/hero/CalendarVisual'
import KPIDashboardVisual from '@/components/hero/KPIDashboardVisual'
import InventoryVisual from '@/components/hero/InventoryVisual'
import AudioPlayerVisual from '@/components/hero/AudioPlayerVisual'
import DonationCardVisual from '@/components/hero/DonationCardVisual'
import FlashcardsVisual from '@/components/hero/FlashcardsVisual'
import ChatBubblesVisual from '@/components/hero/ChatBubblesVisual'
import InvoiceSlipVisual from '@/components/hero/InvoiceSlipVisual'
import PricingSliderVisual from '@/components/hero/PricingSliderVisual'
import MapPinVisual from '@/components/hero/MapPinVisual'

export const HERO_VISUALS = [
  OriginalVisual,
  CalendarVisual,
  KPIDashboardVisual,
  InventoryVisual,
  AudioPlayerVisual,
  DonationCardVisual,
  FlashcardsVisual,
  ChatBubblesVisual,
  InvoiceSlipVisual,
  PricingSliderVisual,
  MapPinVisual,
] as const

const LOOP_MS = 5200

export function useHeroVisualIndex() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setCurrent((v) => (v + 1) % HERO_VISUALS.length)
    }, LOOP_MS)
    return () => window.clearInterval(id)
  }, [])

  return current
}

/** Looping product mocks as a soft background layer on the card. */
export function CardVisualBackground({ current }: { current: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0">
        {HERO_VISUALS.map((Visual, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-end transition-opacity duration-700 ${
              current === i
                ? 'animate-hero-in opacity-100'
                : 'animate-hero-out opacity-0'
            }`}
          >
            <div
              className="mr-[2%] w-[70%] max-w-[300px] origin-right scale-[0.5] sm:scale-[0.55]"
              style={{
                filter: 'saturate(0.45) contrast(0.85) brightness(0.65) blur(0.4px)',
                opacity: 0.28,
              }}
            >
              <Visual />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
    </div>
  )
}
