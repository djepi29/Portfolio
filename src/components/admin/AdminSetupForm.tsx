'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

export default function AdminSetupForm() {
  const [setupToken, setSetupToken] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setQrDataUrl(null)
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupToken }),
      })
      const data = (await res.json()) as {
        error?: string
        qrDataUrl?: string
        hint?: string
      }
      if (!res.ok) {
        setError(data.error ?? 'Setup failed.')
        return
      }
      setQrDataUrl(data.qrDataUrl ?? null)
      setHint(data.hint ?? null)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-5 text-left">
      {!qrDataUrl ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="setup-token"
              className="block text-xs font-medium uppercase tracking-[0.16em] text-white/50"
            >
              Setup token
            </label>
            <input
              id="setup-token"
              type="password"
              autoComplete="off"
              value={setupToken}
              onChange={(e) => setSetupToken(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#e31e24]/60 focus:ring-2 focus:ring-[#e31e24]/25"
              placeholder="ADMIN_SETUP_TOKEN from .env"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !setupToken.trim()}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#e31e24] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c41920] disabled:opacity-40"
          >
            {loading ? 'Loading…' : 'Show QR code'}
          </button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="mx-auto inline-block rounded-2xl bg-white p-3">
            {/* data: URL from server — native img avoids next/image remote config */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Authenticator QR code" width={280} height={280} />
          </div>
          {hint ? <p className="text-sm text-white/60">{hint}</p> : null}
          <Link
            href="/admin/login"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#e31e24] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c41920]"
          >
            Continue to login
          </Link>
        </div>
      )}

      <p className="text-center text-sm text-white/40">
        <Link href="/" className="hover:text-white hover:underline underline-offset-4">
          Back to card
        </Link>
      </p>
    </div>
  )
}
