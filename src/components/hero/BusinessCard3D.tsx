'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import CardFaceCopy from '@/components/hero/CardFaceCopy'
import { CARD_COPY } from '@/components/hero/cardVersions'
import { CardVisualBackground, useHeroVisualIndex } from '@/components/hero/VisualsLoop'

type DragState = {
  active: boolean
  pointerId: number | null
  lastX: number
  lastY: number
  lastT: number
}

const SENSITIVITY = 0.42
const MAX_VEL_X = 4.5
const MAX_VEL_Y = 18
const FRICTION_X = 0.94
const FRICTION_Y = 0.985
const STOP_EPS = 0.008
const TILT_LIMIT = 58

export default function BusinessCard3D() {
  const cardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState>({
    active: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    lastT: 0,
  })
  const rotRef = useRef({ x: 14, y: -22 })
  const velRef = useRef({ x: 0, y: 0 })
  const floatRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)
  const lastFrameRef = useRef<number>(0)

  const [rot, setRot] = useState({ x: 14, y: -22, floatY: 0 })
  const [dragging, setDragging] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const visualIndex = useHeroVisualIndex()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    startRef.current = performance.now()
    lastFrameRef.current = performance.now()

    const tick = (now: number) => {
      const dtMs = Math.min(32, now - lastFrameRef.current)
      lastFrameRef.current = now
      const steps = dtMs / 16.67
      let dirty = false

      if (!reduceMotion) {
        const t = (now - startRef.current) / 1000
        const nextFloat = Math.sin(t * 0.85) * 9
        if (Math.abs(nextFloat - floatRef.current) > 0.02) {
          floatRef.current = nextFloat
          dirty = true
        }
      } else {
        floatRef.current = 0
      }

      if (!dragRef.current.active && !reduceMotion) {
        const fx = Math.pow(FRICTION_X, steps)
        const fy = Math.pow(FRICTION_Y, steps)
        velRef.current.x *= fx
        velRef.current.y *= fy

        const moving =
          Math.abs(velRef.current.x) > STOP_EPS ||
          Math.abs(velRef.current.y) > STOP_EPS

        if (moving) {
          rotRef.current.x += velRef.current.x * steps
          rotRef.current.y += velRef.current.y * steps

          if (rotRef.current.x > TILT_LIMIT) {
            rotRef.current.x = TILT_LIMIT
            velRef.current.x *= -0.35
          } else if (rotRef.current.x < -TILT_LIMIT) {
            rotRef.current.x = -TILT_LIMIT
            velRef.current.x *= -0.35
          }

          dirty = true
        } else {
          velRef.current.x = 0
          velRef.current.y = 0
        }
      }

      if (dirty || dragRef.current.active) {
        setRot({
          x: rotRef.current.x,
          y: rotRef.current.y,
          floatY: floatRef.current,
        })
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reduceMotion])

  const applyRotation = useCallback((dx: number, dy: number, dtMs: number) => {
    const safeDt = Math.max(8, Math.min(40, dtMs))
    const instantVx = (-dy * SENSITIVITY * 16.67) / safeDt
    const instantVy = (dx * SENSITIVITY * 16.67) / safeDt

    velRef.current.x = velRef.current.x * 0.55 + instantVx * 0.45
    velRef.current.y = velRef.current.y * 0.45 + instantVy * 0.55

    velRef.current.x = Math.max(-MAX_VEL_X, Math.min(MAX_VEL_X, velRef.current.x))
    velRef.current.y = Math.max(-MAX_VEL_Y, Math.min(MAX_VEL_Y, velRef.current.y))

    rotRef.current.x = Math.max(
      -TILT_LIMIT,
      Math.min(TILT_LIMIT, rotRef.current.x - dy * SENSITIVITY)
    )
    rotRef.current.y += dx * SENSITIVITY

    setRot({
      x: rotRef.current.x,
      y: rotRef.current.y,
      floatY: floatRef.current,
    })
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement | null
    if (target?.closest('a, button, [data-card-link]')) return

    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
    }
    velRef.current.x *= 0.2
    velRef.current.y *= 0.35
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== e.pointerId) return
    const now = performance.now()
    const dx = e.clientX - drag.lastX
    const dy = e.clientY - drag.lastY
    const dt = now - drag.lastT
    drag.lastX = e.clientX
    drag.lastY = e.clientY
    drag.lastT = now
    if (dx === 0 && dy === 0) return
    applyRotation(dx, dy, dt || 16)
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return
    dragRef.current.active = false
    dragRef.current.pointerId = null
    setDragging(false)

    const speed = Math.hypot(velRef.current.x, velRef.current.y)
    if (speed > 2.5) {
      velRef.current.y *= 1.15
      velRef.current.x *= 1.05
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  const glareX = 50 + rot.y * 0.55
  const glareY = 42 - rot.x * 0.7
  const rimStrength =
    0.35 + Math.min(0.45, Math.abs(rot.y) * 0.004 + Math.abs(rot.x) * 0.004)

  return (
    <div className="relative w-full mx-auto max-w-[440px] select-none">
      <div
        className="pointer-events-none absolute left-1/2 -bottom-10 w-[78%] h-16 rounded-[100%] blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse, rgba(255,210,180,0.22) 0%, rgba(120,160,255,0.08) 45%, transparent 70%)',
          opacity: 0.55 + Math.abs(rot.x) * 0.004,
          transform: `translateX(-50%) translateY(${-rot.floatY * 0.35}px) scaleX(${
            0.85 + Math.abs(rot.y) * 0.001
          })`,
        }}
        aria-hidden
      />

      <div
        className="relative w-full aspect-[1.75/1]"
        style={{ perspective: '1400px' }}
      >
        <div
          ref={cardRef}
          className={`relative w-full h-full touch-none ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            transform: `translateY(${rot.floatY}px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="img"
          aria-label="Kanson Wouj Digital metallic business card — drag to tilt and rotate"
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
            style={{
              boxShadow: `
                0 40px 80px rgba(0,0,0,0.65),
                0 0 0 1px rgba(255,255,255,${0.12 + rimStrength * 0.15}),
                inset 0 1px 0 rgba(255,255,255,0.35),
                inset 0 -1px 0 rgba(0,0,0,0.35)
              `,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    145deg,
                    #3a3d45 0%,
                    #1c1e24 18%,
                    #2a2d36 36%,
                    #14161b 55%,
                    #32363f 78%,
                    #1a1c22 100%
                  )
                `,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  100deg,
                  transparent 0px,
                  transparent 1px,
                  rgba(255,255,255,0.04) 1px,
                  rgba(255,255,255,0.04) 2px,
                  transparent 2px,
                  transparent 4px,
                  rgba(0,0,0,0.06) 4px,
                  rgba(0,0,0,0.06) 5px
                )`,
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(
                  ${125 + rot.y * 0.4}deg,
                  rgba(255,236,210,${0.18 + rimStrength * 0.15}) 0%,
                  transparent 38%,
                  transparent 62%,
                  rgba(140,180,255,${0.08 + rimStrength * 0.1}) 100%
                )`,
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                background: `
                  radial-gradient(
                    ellipse 55% 35% at ${glareX}% ${glareY}%,
                    rgba(255,255,255,0.85) 0%,
                    rgba(255,230,200,0.35) 22%,
                    transparent 58%
                  )
                `,
                opacity: 0.55 + rimStrength * 0.35,
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(
                    ${90 + rot.y}deg,
                    transparent 0%,
                    transparent 70%,
                    rgba(255,255,255,${0.08 + rimStrength * 0.12}) 92%,
                    transparent 100%
                  )
                `,
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e31e24] to-transparent opacity-90" />
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e31e24]/90 via-[#e31e24]/55 to-[#e31e24]/25" />
            <div className="absolute bottom-0 left-0 w-[55%] h-[2px] bg-gradient-to-r from-[#e31e24]/85 via-[#e31e24]/40 to-transparent" />

            <CardVisualBackground current={visualIndex} />
            <CardFaceCopy
              content={CARD_COPY.front}
              rimStrength={rimStrength}
            />
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
            style={{
              transform: 'rotateY(180deg)',
              boxShadow: `
                0 40px 80px rgba(0,0,0,0.65),
                0 0 0 1px rgba(255,255,255,0.1),
                inset 0 1px 0 rgba(255,255,255,0.2)
              `,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(
                    155deg,
                    #4a1216 0%,
                    #1a0a0c 30%,
                    #2e0f14 55%,
                    #0e0708 100%
                  )
                `,
              }}
            />
            <div
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  95deg,
                  transparent 0px,
                  transparent 2px,
                  rgba(255,255,255,0.05) 2px,
                  rgba(255,255,255,0.05) 3px
                )`,
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                background: `
                  radial-gradient(
                    ellipse 50% 40% at ${100 - glareX}% ${100 - glareY}%,
                    rgba(255,200,180,0.55) 0%,
                    transparent 55%
                  )
                `,
              }}
            />
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ff8a8a]/70 via-[#ff5c5c]/45 to-[#ff8a8a]/30" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-[55%] h-[2px] bg-gradient-to-r from-[#ff8a8a]/65 via-[#ff5c5c]/35 to-transparent" />
            <div className="pointer-events-none absolute top-0 left-0 w-[40%] h-[2px] bg-gradient-to-r from-[#ff8a8a]/40 via-[#ff5c5c]/20 to-transparent" />

            <CardVisualBackground current={visualIndex} />
            <CardFaceCopy content={CARD_COPY.back} rimStrength={rimStrength} />
          </div>
        </div>
      </div>
    </div>
  )
}
