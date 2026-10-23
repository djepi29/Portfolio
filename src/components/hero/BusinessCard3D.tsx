'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import CardFaceCopy from '@/components/hero/CardFaceCopy'
import { CARD_COPY } from '@/components/hero/cardVersions'
import { CardVisualBackground, useHeroVisualIndex } from '@/components/hero/VisualsLoop'

type DragState = {
  active: boolean
  pointerId: number | null
  pointerType: string
  lastX: number
  lastY: number
  lastT: number
}

type ImpulseSample = {
  x: number
  y: number
  t: number
  speed: number
}

const SENSITIVITY = 0.42
const MAX_VEL_X = 4.5
const MAX_VEL_Y = 18
const FRICTION_X = 0.94
const FRICTION_Y = 0.985
const STOP_EPS = 0.008
const TILT_LIMIT = 58
const IMPULSE_TTL_MS = 320
const IMPULSE_HISTORY_MS = 280
const IMPULSE_MAX = 32
const MIN_THROW_SPEED = 0.45

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function throwVelocityFromImpulses(impulses: ImpulseSample[], now: number) {
  if (impulses.length === 0) return null

  const cutoff = now - IMPULSE_HISTORY_MS
  let best: ImpulseSample | null = null
  for (let i = impulses.length - 1; i >= 0; i--) {
    const sample = impulses[i]
    if (sample.t < cutoff) break
    if (!best || sample.speed > best.speed) best = sample
  }

  if (!best || best.speed < MIN_THROW_SPEED) return null
  if (now - best.t > IMPULSE_TTL_MS) return null
  return { x: best.x, y: best.y }
}

export default function BusinessCard3D() {
  const cardRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const frontShineRef = useRef<HTMLDivElement>(null)
  const frontGlareRef = useRef<HTMLDivElement>(null)
  const frontEdgeRef = useRef<HTMLDivElement>(null)
  const backGlareRef = useRef<HTMLDivElement>(null)
  const actionGlareBandRef = useRef<HTMLDivElement>(null)
  const frontFaceRef = useRef<HTMLDivElement>(null)

  const dragRef = useRef<DragState>({
    active: false,
    pointerId: null,
    pointerType: '',
    lastX: 0,
    lastY: 0,
    lastT: 0,
  })
  const impulsesRef = useRef<ImpulseSample[]>([])
  const rotRef = useRef({ x: 14, y: -22 })
  const velRef = useRef({ x: 0, y: 0 })
  const floatRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(0)
  const lastFrameRef = useRef(0)
  const reduceMotionRef = useRef(false)
  const listenersRef = useRef<{
    move: ((e: PointerEvent) => void) | null
    up: ((e: PointerEvent) => void) | null
    mouseUp: ((e: MouseEvent) => void) | null
  }>({ move: null, up: null, mouseUp: null })

  const [dragging, setDragging] = useState(false)
  const visualIndex = useHeroVisualIndex()

  const paint = useCallback(() => {
    const { x, y } = rotRef.current
    const floatY = floatRef.current
    const glareX = 50 + y * 0.55
    const glareY = 42 - x * 0.7
    const rim = 0.35 + Math.min(0.45, Math.abs(y) * 0.004 + Math.abs(x) * 0.004)

    if (cardRef.current) {
      cardRef.current.style.transform = `translateY(${floatY}px) rotateX(${x}deg) rotateY(${y}deg)`
    }

    if (shadowRef.current) {
      shadowRef.current.style.opacity = String(0.55 + Math.abs(x) * 0.004)
      shadowRef.current.style.transform = `translateX(-50%) translateY(${-floatY * 0.35}px) scaleX(${
        0.85 + Math.abs(y) * 0.001
      })`
    }

    if (frontFaceRef.current) {
      frontFaceRef.current.style.boxShadow = `
        0 40px 80px rgba(0,0,0,0.65),
        0 0 0 1px rgba(255,255,255,${0.12 + rim * 0.15}),
        inset 0 1px 0 rgba(255,255,255,0.35),
        inset 0 -1px 0 rgba(0,0,0,0.35)
      `
    }

    if (frontShineRef.current) {
      frontShineRef.current.style.background = `linear-gradient(
        ${125 + y * 0.4}deg,
        rgba(255,236,210,${0.18 + rim * 0.15}) 0%,
        transparent 38%,
        transparent 62%,
        rgba(140,180,255,${0.08 + rim * 0.1}) 100%
      )`
    }

    if (frontGlareRef.current) {
      frontGlareRef.current.style.background = `
        radial-gradient(
          ellipse 55% 35% at ${glareX}% ${glareY}%,
          rgba(255,255,255,0.85) 0%,
          rgba(255,230,200,0.35) 22%,
          transparent 58%
        )
      `
      frontGlareRef.current.style.opacity = String(0.55 + rim * 0.35)
    }

    if (frontEdgeRef.current) {
      frontEdgeRef.current.style.background = `
        linear-gradient(
          ${90 + y}deg,
          transparent 0%,
          transparent 70%,
          rgba(255,255,255,${0.08 + rim * 0.12}) 92%,
          transparent 100%
        )
      `
    }

    if (backGlareRef.current) {
      backGlareRef.current.style.background = `
        radial-gradient(
          ellipse 50% 40% at ${100 - glareX}% ${100 - glareY}%,
          rgba(255,200,180,0.55) 0%,
          transparent 55%
        )
      `
    }

    if (actionGlareBandRef.current) {
      // Always track rotateY — this is user-driven specular feedback, not
      // decorative autoplay. (prefers-reduced-motion was previously hiding it.)
      const rad = (y * Math.PI) / 180
      const t = (Math.sin(rad) + 1) / 2 // 0 → 1 as y rotates
      const xPct = -70 + t * 160
      actionGlareBandRef.current.style.transform = `translateX(${xPct}%) skewX(-18deg)`
      actionGlareBandRef.current.style.opacity = reduceMotionRef.current
        ? '0.5'
        : String(0.8 + rim * 0.2)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotionRef.current = mq.matches
    const onChange = () => {
      reduceMotionRef.current = mq.matches
      if (mq.matches) floatRef.current = 0
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    startRef.current = performance.now()
    lastFrameRef.current = performance.now()
    paint()

    const tick = (now: number) => {
      const dtMs = Math.min(32, now - lastFrameRef.current)
      lastFrameRef.current = now
      const steps = dtMs / 16.67
      let dirty = false

      if (!reduceMotionRef.current) {
        const t = (now - startRef.current) / 1000
        const nextFloat = Math.sin(t * 0.85) * 9
        if (Math.abs(nextFloat - floatRef.current) > 0.02) {
          floatRef.current = nextFloat
          dirty = true
        }
      } else if (floatRef.current !== 0) {
        floatRef.current = 0
        dirty = true
      }

      if (!dragRef.current.active) {
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
        paint()
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [paint])

  const detachDragListeners = useCallback(() => {
    const { move, up, mouseUp } = listenersRef.current
    if (move) window.removeEventListener('pointermove', move)
    if (up) {
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    if (mouseUp) window.removeEventListener('mouseup', mouseUp)
    listenersRef.current = { move: null, up: null, mouseUp: null }
  }, [])

  useEffect(() => () => detachDragListeners(), [detachDragListeners])

  const recordImpulse = useCallback((vx: number, vy: number, t: number) => {
    const speed = Math.hypot(vx, vy)
    if (speed < MIN_THROW_SPEED) return

    const impulses = impulsesRef.current
    impulses.push({ x: vx, y: vy, t, speed })
    const cutoff = t - IMPULSE_HISTORY_MS
    while (
      impulses.length > IMPULSE_MAX ||
      (impulses.length > 0 && impulses[0].t < cutoff)
    ) {
      impulses.shift()
    }
  }, [])

  const applyRotation = useCallback(
    (dx: number, dy: number, dtMs: number, at: number) => {
      const safeDt = Math.max(8, Math.min(40, dtMs))
      const instantVx = clamp((-dy * SENSITIVITY * 16.67) / safeDt, -MAX_VEL_X, MAX_VEL_X)
      const instantVy = clamp((dx * SENSITIVITY * 16.67) / safeDt, -MAX_VEL_Y, MAX_VEL_Y)

      recordImpulse(instantVx, instantVy, at)

      velRef.current.x = velRef.current.x * 0.55 + instantVx * 0.45
      velRef.current.y = velRef.current.y * 0.45 + instantVy * 0.55
      velRef.current.x = clamp(velRef.current.x, -MAX_VEL_X, MAX_VEL_X)
      velRef.current.y = clamp(velRef.current.y, -MAX_VEL_Y, MAX_VEL_Y)

      rotRef.current.x = clamp(rotRef.current.x - dy * SENSITIVITY, -TILT_LIMIT, TILT_LIMIT)
      rotRef.current.y += dx * SENSITIVITY

      // Imperative paint — no React setState on the drag path (keeps INP low).
      paint()
    },
    [paint, recordImpulse]
  )

  const finishDrag = useCallback(
    (pointerId: number) => {
      const drag = dragRef.current
      if (!drag.active || drag.pointerId !== pointerId) return

      const now = performance.now()
      const isMouse = drag.pointerType === 'mouse'
      const thrown = throwVelocityFromImpulses(impulsesRef.current, now)

      drag.active = false
      drag.pointerId = null
      setDragging(false)
      impulsesRef.current = []
      detachDragListeners()

      if (thrown) {
        const thrownSpeed = Math.hypot(thrown.x, thrown.y)
        const curSpeed = Math.hypot(velRef.current.x, velRef.current.y)
        if (isMouse || curSpeed < thrownSpeed) {
          velRef.current.x = thrown.x
          velRef.current.y = thrown.y
        }
        velRef.current.x = clamp(velRef.current.x, -MAX_VEL_X, MAX_VEL_X)
        velRef.current.y = clamp(velRef.current.y, -MAX_VEL_Y, MAX_VEL_Y)
      }

      const speed = Math.hypot(velRef.current.x, velRef.current.y)
      const boostGate = isMouse ? 0.8 : 2.5
      if (speed > boostGate) {
        velRef.current.y *= isMouse ? 1.28 : 1.15
        velRef.current.x *= isMouse ? 1.12 : 1.05
        velRef.current.x = clamp(velRef.current.x, -MAX_VEL_X, MAX_VEL_X)
        velRef.current.y = clamp(velRef.current.y, -MAX_VEL_Y, MAX_VEL_Y)
      }

      const node = cardRef.current
      if (node?.hasPointerCapture?.(pointerId)) {
        try {
          node.releasePointerCapture(pointerId)
        } catch {
          /* already released */
        }
      }
    },
    [detachDragListeners]
  )

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement | null
    if (target?.closest('a, button, [data-card-link]')) return

    // End a stuck drag before starting a new one.
    if (dragRef.current.active && dragRef.current.pointerId !== null) {
      finishDrag(dragRef.current.pointerId)
    }

    e.preventDefault()

    const pointerId = e.pointerId
    const now = performance.now()
    dragRef.current = {
      active: true,
      pointerId,
      pointerType: e.pointerType,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: now,
    }
    impulsesRef.current = []
    velRef.current.x *= 0.2
    velRef.current.y *= 0.35
    setDragging(true)

    try {
      e.currentTarget.setPointerCapture(pointerId)
    } catch {
      /* window listeners still handle release */
    }

    detachDragListeners()

    const onMove = (ev: PointerEvent) => {
      const drag = dragRef.current
      if (!drag.active || drag.pointerId !== ev.pointerId) return
      const t = performance.now()
      const dx = ev.clientX - drag.lastX
      const dy = ev.clientY - drag.lastY
      const dt = t - drag.lastT
      drag.lastX = ev.clientX
      drag.lastY = ev.clientY
      drag.lastT = t
      if (dx === 0 && dy === 0) return
      applyRotation(dx, dy, dt || 16, t)
    }

    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return
      finishDrag(pointerId)
    }

    const onMouseUp = (ev: MouseEvent) => {
      if (ev.button !== 0) return
      if (dragRef.current.pointerId !== pointerId) return
      finishDrag(pointerId)
    }

    listenersRef.current = { move: onMove, up: onUp, mouseUp: onMouseUp }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <div className="relative w-full mx-auto max-w-[440px] select-none">
      <div
        ref={shadowRef}
        className="pointer-events-none absolute left-1/2 -bottom-10 w-[78%] h-16 rounded-[100%] blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse, rgba(255,210,180,0.22) 0%, rgba(120,160,255,0.08) 45%, transparent 70%)',
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
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          onPointerDown={onPointerDown}
          role="img"
          aria-label="Kanson Wouj Digital metallic business card — drag to tilt and rotate"
        >
          {/* FRONT */}
          <div
            ref={frontFaceRef}
            className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden"
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
              ref={frontShineRef}
              className="absolute inset-0 pointer-events-none"
            />
            <div
              ref={frontGlareRef}
              className="absolute inset-0 pointer-events-none mix-blend-screen"
            />
            <div
              ref={frontEdgeRef}
              className="absolute inset-0 pointer-events-none"
            />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#e31e24] to-transparent opacity-90" />
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e31e24]/90 via-[#e31e24]/55 to-[#e31e24]/25" />
            <div className="absolute bottom-0 left-0 w-[55%] h-[2px] bg-gradient-to-r from-[#e31e24]/85 via-[#e31e24]/40 to-transparent" />

            <CardVisualBackground current={visualIndex} />
            <CardFaceCopy content={CARD_COPY.front} />
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
              ref={backGlareRef}
              className="absolute inset-0 pointer-events-none mix-blend-screen"
            />
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ff8a8a]/70 via-[#ff5c5c]/45 to-[#ff8a8a]/30" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-[55%] h-[2px] bg-gradient-to-r from-[#ff8a8a]/65 via-[#ff5c5c]/35 to-transparent" />
            <div className="pointer-events-none absolute top-0 left-0 w-[40%] h-[2px] bg-gradient-to-r from-[#ff8a8a]/40 via-[#ff5c5c]/20 to-transparent" />

            <CardVisualBackground current={visualIndex} />
            <CardFaceCopy
              content={CARD_COPY.back}
              actionGlareBandRef={actionGlareBandRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
