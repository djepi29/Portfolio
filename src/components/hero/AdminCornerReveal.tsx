'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react'

type Props = {
  href: string
}

const DOUBLE_MS = 380
const HIDE_AFTER_MS = 12_000

export default function AdminCornerReveal({ href }: Props) {
  const [visible, setVisible] = useState(false)
  const lastTapRef = useRef(0)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const show = useCallback(() => {
    setVisible(true)
    clearHideTimer()
    hideTimerRef.current = setTimeout(() => setVisible(false), HIDE_AFTER_MS)
  }, [clearHideTimer])

  useEffect(() => () => clearHideTimer(), [clearHideTimer])

  const onCornerActivate = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      const now = Date.now()
      if (now - lastTapRef.current <= DOUBLE_MS) {
        lastTapRef.current = 0
        show()
        return
      }
      lastTapRef.current = now
    },
    [show]
  )

  const external = href.startsWith('http')

  return (
    <>
      {/* Invisible double-tap / double-click hotspot */}
      <button
        type="button"
        aria-label="Reveal admin control"
        className="pointer-events-auto absolute top-0 right-0 z-20 h-11 w-11 sm:h-12 sm:w-12 cursor-default border-0 bg-transparent p-0"
        onDoubleClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          show()
        }}
        onClick={onCornerActivate}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {visible ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          data-card-link
          aria-label="Open admin dashboard"
          className="pointer-events-auto absolute top-3 right-3 sm:top-5 sm:right-5 z-30 inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white opacity-100 shadow-sm backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/20 cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.19-2.89 8.27-7 9.44-4.11-1.17-7-5.25-7-9.44v-4.7l7-3.12zM11 10h2v6h-2v-6zm0-3h2v2h-2V7z" />
          </svg>
        </a>
      ) : null}
    </>
  )
}
