'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
  passwordRequired: boolean
}

export default function AdminLoginForm({ passwordRequired }: Props) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Login failed.')
        return
      }
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 text-left">
      {passwordRequired ? (
        <div className="space-y-2">
          <label
            htmlFor="admin-password"
            className="block text-xs font-medium uppercase tracking-[0.16em] text-white/50"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-[#e31e24]/60 focus:ring-2 focus:ring-[#e31e24]/25"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="admin-code"
          className="block text-xs font-medium uppercase tracking-[0.16em] text-white/50"
        >
          Authenticator code
        </label>
        <input
          id="admin-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-center text-2xl tracking-[0.4em] text-white outline-none focus:border-[#e31e24]/60 focus:ring-2 focus:ring-[#e31e24]/25"
        />
        <p className="text-xs text-white/40">
          Open Google Authenticator and enter the 6-digit code for Kanson Wouj
          Digital.
        </p>
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
        disabled={loading || code.length !== 6}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#e31e24] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c41920] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? 'Verifying…' : 'Unlock admin'}
      </button>

      <p className="text-center text-sm text-white/40">
        <Link href="/" className="hover:text-white hover:underline underline-offset-4">
          Back to card
        </Link>
      </p>
    </form>
  )
}
