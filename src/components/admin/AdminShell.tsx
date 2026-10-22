'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
}

export default function AdminShell({ children }: Props) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function logout() {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.replace('/admin/login')
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            Private
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-white/50 underline-offset-4 hover:text-white hover:underline"
          >
            Site
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
          >
            {loggingOut ? '…' : 'Log out'}
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}
