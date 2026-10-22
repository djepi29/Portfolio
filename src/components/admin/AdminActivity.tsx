'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AdminActivityItem } from '@/lib/admin-types'

export default function AdminActivity() {
  const [items, setItems] = useState<AdminActivityItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/activity')
      const json = (await res.json()) as {
        error?: string
        activity?: AdminActivityItem[]
      }
      if (!res.ok) {
        setError(json.error ?? 'Failed to load activity.')
        return
      }
      setItems(json.activity ?? [])
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Activity</h2>
          <p className="text-xs text-white/40">
            Recent Stripe events (payments, invoices, disputes).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:text-white disabled:opacity-40"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {loading && !items ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/45">
          Loading activity…
        </div>
      ) : null}

      {items && items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-white/45">
          No recent events.
        </div>
      ) : null}

      {items && items.length > 0 ? (
        <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="text-sm text-white/90">{item.summary}</p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {new Date(item.created * 1000).toLocaleString()}
                </p>
              </div>
              {item.dashboardUrl ? (
                <a
                  href={item.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-white/45 hover:text-white hover:underline"
                >
                  Open ↗
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
