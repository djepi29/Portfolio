'use client'

import { useEffect, useRef, useState } from 'react'
import { Fraunces } from 'next/font/google'
import NbcsCaseStudy from '@/components/hero/NbcsCaseStudy'

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
})

type MotionSettings = {
  influence: number
  drift: number
  tilt: number
  float: number
  shadow: number
}

const DEFAULT_MOTION: MotionSettings = {
  influence: 0.65,
  drift: 0.45,
  tilt: 8,
  float: 12,
  shadow: 0.6,
}

const BLOBS = [
  {
    className: 'left-[-8%] top-[-18%] h-[70vh] w-[55vw]',
    background:
      'radial-gradient(ellipse, rgba(122,29,58,0.55) 0%, rgba(93,24,49,0.18) 42%, transparent 70%)',
  },
  {
    className: 'right-[-12%] top-[8%] h-[60vh] w-[48vw]',
    background:
      'radial-gradient(ellipse, rgba(255,196,140,0.28) 0%, rgba(255,170,110,0.08) 45%, transparent 72%)',
  },
  {
    className: 'bottom-[-12%] left-[18%] h-[55vh] w-[50vw]',
    background:
      'radial-gradient(ellipse, rgba(90,130,220,0.28) 0%, rgba(70,100,190,0.08) 46%, transparent 72%)',
  },
  {
    className: 'bottom-[10%] right-[8%] h-[40vh] w-[36vw]',
    background:
      'radial-gradient(ellipse, rgba(227,30,36,0.2) 0%, transparent 70%)',
  },
]

const SLIDERS: { key: keyof MotionSettings; label: string; min: number; max: number; step: number }[] = [
  { key: 'influence', label: 'Mouse influence', min: 0, max: 1, step: 0.01 },
  { key: 'drift', label: 'Drift speed', min: 0, max: 1, step: 0.01 },
  { key: 'tilt', label: 'Card tilt', min: 0, max: 16, step: 0.5 },
  { key: 'float', label: 'Float height', min: 0, max: 28, step: 1 },
  { key: 'shadow', label: 'Shadow depth', min: 0, max: 1, step: 0.01 },
]

type Props = {
  /** Set for the fused emblem. The screenshot card leaves this empty. */
  imageSrc?: string
  /** Training sliders and the extra snap beat. Off on the public portfolio. */
  showControls?: boolean
}

export default function NbcsProjectStage({ imageSrc, showControls = true }: Props) {
  const emblem = Boolean(imageSrc)
  const src = imageSrc ?? '/case-studies/nbcs/home.png'
  const [motion, setMotion] = useState<MotionSettings>(DEFAULT_MOTION)
  const [open, setOpen] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)
  const motionRef = useRef(motion)
  motionRef.current = motion
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRef = useRef<HTMLButtonElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pointer = { x: 0, y: 0, cx: -1e4, cy: -1e4 }
    const smooth = { x: 0, y: 0 }
    const phases = BLOBS.map((_, index) => index * 1.7)
    const boosts = BLOBS.map(() => 0)
    let last = performance.now()
    const onMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1
      pointer.cx = event.clientX
      pointer.cy = event.clientY
    }
    const onLeave = () => {
      pointer.cx = -1e4
      pointer.cy = -1e4
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)

    let frame = 0
    const tick = (time: number) => {
      const dt = Math.min(0.05, (time - last) / 1000)
      last = time
      const settings = motionRef.current
      const seconds = time / 1000
      smooth.x += (pointer.x - smooth.x) * 0.06
      smooth.y += (pointer.y - smooth.y) * 0.06
      blobRefs.current.forEach((node, index) => {
        if (!node) return
        const rect = node.getBoundingClientRect()
        const dx = (pointer.cx - (rect.left + rect.width / 2)) / (rect.width * 0.5 || 1)
        const dy = (pointer.cy - (rect.top + rect.height / 2)) / (rect.height * 0.5 || 1)
        const over = Math.hypot(dx, dy) < 0.38
        boosts[index] += ((over ? 1 : 0) - boosts[index]) * 0.14
        const boost = boosts[index]
        const speed = 0.55 + settings.drift * 1.15 + boost * 1.8
        phases[index] += dt * speed
        const phase = phases[index]
        const driftX = Math.sin(phase + index) * (56 + settings.drift * 110)
        const driftY = Math.cos(phase * 0.82) * (40 + settings.drift * 80)
        const followX = smooth.x * 50 * settings.influence
        const followY = smooth.y * 36 * settings.influence
        const sx = 1 + Math.sin(phase * 1.3) * 0.05 + boost * 0.28
        const sy = 1 + Math.cos(phase * 1.05) * 0.05 - boost * 0.16
        const rot = Math.sin(phase * 0.6) * 4 + boost * 10
        node.style.transform = `translate3d(${driftX + followX}px, ${driftY + followY}px, 0) rotate(${rot}deg) scale(${sx}, ${sy})`
      })
      const floatY = Math.sin(seconds * (0.7 + settings.drift)) * settings.float
      const tiltX = smooth.y * -settings.tilt
      const tiltY = smooth.x * settings.tilt
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(0, ${floatY}px, 40px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }
      if (shadowRef.current) {
        const lift = Math.abs(floatY) / 28
        const scale = 1 - lift * 0.35
        shadowRef.current.style.opacity = String(0.28 + settings.shadow * 0.55)
        shadowRef.current.style.transform = `translateX(-50%) scale(${scale})`
        shadowRef.current.style.filter = `blur(${18 + settings.shadow * 22}px)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className={`${fraunces.className} absolute inset-0 overflow-hidden bg-[#07080c] text-white`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {BLOBS.map((blob, index) => (
          <div
            key={blob.className}
            ref={(node) => {
              blobRefs.current[index] = node
            }}
            className={`absolute rounded-full ${blob.className}`}
            style={{ background: blob.background, transformOrigin: 'center', willChange: 'transform' }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)',
          }}
        />
      </div>

      {open ? (
        <div className="absolute inset-0 z-10 flex flex-col px-3 pb-16 pt-16 sm:px-5">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mb-3 w-fit rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 font-sans text-xs font-medium tracking-wide text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            Back to the card
          </button>
          <div className="min-h-0 flex-1">
            <NbcsCaseStudy />
          </div>
        </div>
      ) : (
        <>
          <div className="relative z-10 h-full snap-y snap-mandatory overflow-y-auto overscroll-contain">
            <section className="flex h-full snap-center items-center justify-center overflow-hidden px-4 py-8 sm:px-8">
              <div className="relative w-[min(94vw,920px)]" style={{ perspective: '1400px' }}>
                <div
                  ref={shadowRef}
                  aria-hidden
                  className="pointer-events-none absolute -bottom-8 left-1/2 h-14 w-[72%] rounded-full bg-black"
                />
                <button
                  ref={cardRef}
                  type="button"
                  onClick={() => setOpen(true)}
                  className={`relative block w-full overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#14080d] text-left outline-none ring-white/30 focus-visible:ring-2 ${emblem ? 'aspect-[16/10] max-h-[78vh]' : ''}`}
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                  aria-label="Open the National Black Canadians Summit study"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className={
                      emblem
                        ? 'absolute inset-x-0 top-0 h-[82%] w-full translate-y-14 object-contain object-bottom sm:translate-y-16'
                        : 'block aspect-[16/10] max-h-[78vh] w-full object-cover object-[center_28%]'
                    }
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: emblem
                        ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 24%, rgba(0,0,0,0.12) 52%, rgba(0,0,0,0.28) 100%)'
                        : 'linear-gradient(to top, #000 0%, #000 72%, rgba(0,0,0,0.5) 100%)',
                    }}
                    aria-hidden
                  />
                  <div
                    className={
                      emblem
                        ? 'absolute inset-x-0 bottom-0 px-6 pb-6 text-center sm:px-10 sm:pb-7'
                        : 'absolute inset-x-0 top-[40%] px-6 text-left sm:top-[42%] sm:px-10'
                    }
                  >
                    <h1
                      className={
                        emblem
                          ? 'text-3xl leading-tight sm:text-[2.15rem]'
                          : 'text-[1.7rem] leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl'
                      }
                    >
                      National Black Canadians Summit
                    </h1>
                    <p
                      className={
                        emblem
                          ? 'mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-white/65'
                          : 'mt-3 max-w-xl font-sans text-sm leading-relaxed text-white/80 sm:text-base'
                      }
                    >
                      A bilingual Summit site, carried through to registration.
                    </p>
                    {emblem ? null : (
                      <p className="mt-3 font-sans text-sm text-white/60">
                        Winnipeg · September 18–20, 2026
                      </p>
                    )}
                  </div>
                </button>
              </div>
            </section>

            {showControls ? (
              <section className="flex h-full snap-center items-center justify-center px-6">
                <p className="max-w-sm text-center font-sans text-sm leading-relaxed text-white/45">
                  Scroll back. The card returns to the center. The field stays where it is.
                </p>
              </section>
            ) : null}
          </div>

          {showControls ? (
          <div className="absolute left-4 top-4 z-20 font-sans">
            <button
              type="button"
              onClick={() => setControlsOpen((value) => !value)}
              aria-expanded={controlsOpen}
              className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-white/80 backdrop-blur-md transition hover:bg-black/70"
            >
              Motion
            </button>
          {controlsOpen ? (
          <aside className="mt-2 max-h-[46vh] w-52 overflow-y-auto rounded-2xl border border-white/12 bg-black/50 p-3 shadow-lg backdrop-blur-md">
            <div className="space-y-2.5">
              {SLIDERS.map((slider) => (
                <label key={slider.key} className="block">
                  <span className="flex items-center justify-between text-[11px] text-white/70">
                    {slider.label}
                    <span className="tabular-nums text-white/40">
                      {motion[slider.key].toFixed(slider.step < 1 ? 2 : 0)}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={motion[slider.key]}
                    onChange={(event) => {
                      const value = Number(event.target.value)
                      setMotion((current) => ({ ...current, [slider.key]: value }))
                    }}
                    className="mt-1 w-full accent-[#e31e24]"
                  />
                </label>
              ))}
            </div>
          </aside>
          ) : null}
          </div>
          ) : null}
        </>
      )}
    </div>
  )
}
