'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AdminBookingRow } from '@/lib/admin-bookings'
import type { CalBookingStatus } from '@/lib/cal'

type StatusTab = Extract<
  CalBookingStatus,
  'upcoming' | 'past' | 'cancelled' | 'unconfirmed'
>

const TABS: { id: StatusTab; label: string }[] = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'unconfirmed', label: 'Unconfirmed' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
]

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-CA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function AdminBookings() {
  const [tab, setTab] = useState<StatusTab>('upcoming')
  const [rows, setRows] = useState<AdminBookingRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyUid, setBusyUid] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async (status: StatusTab) => {
    setLoading(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch(
        `/api/admin/bookings?status=${encodeURIComponent(status)}`
      )
      const json = (await res.json()) as {
        error?: string
        bookings?: AdminBookingRow[]
      }
      if (!res.ok) {
        setError(json.error ?? 'Failed to load bookings.')
        setRows([])
        return
      }
      setRows(json.bookings ?? [])
    } catch {
      setError('Network error.')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(tab)
  }, [tab, load])

  async function cancelBooking(uid: string) {
    if (
      !window.confirm(
        'Cancel this booking? The attendee will be notified by Cal.com.'
      )
    ) {
      return
    }
    setBusyUid(uid)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(json.error ?? 'Cancel failed.')
        return
      }
      setNotice('Booking cancelled.')
      await load(tab)
    } catch {
      setError('Network error while cancelling.')
    } finally {
      setBusyUid(null)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Bookings</h2>
          <p className="text-xs text-white/40">
            Cal.com sessions — list and cancel from here. Public book page uses
            your Cal username embed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://app.cal.com/bookings"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Open Cal.com ↗
          </a>
          <button
            type="button"
            onClick={() => void load(tab)}
            disabled={loading}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              tab === t.id
                ? 'bg-white/15 text-white'
                : 'border border-white/10 text-white/55 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}

      {loading && !rows ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/45">
          Loading…
        </div>
      ) : null}

      {rows ? (
        rows.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/45">
            No {tab} bookings.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.12em] text-white/45">
                <tr>
                  <th className="px-4 py-3 font-medium">When</th>
                  <th className="px-4 py-3 font-medium">Session</th>
                  <th className="px-4 py-3 font-medium">Attendee</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((row) => (
                  <tr key={row.uid} className="bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">
                        {formatWhen(row.start)}
                      </div>
                      <div className="text-xs text-white/40">
                        {row.duration ? `${row.duration} min` : '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white/85">{row.title}</div>
                      {row.location ? (
                        <a
                          href={row.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#ffb4b7] hover:underline"
                        >
                          Meeting link
                        </a>
                      ) : (
                        <span className="text-xs text-white/35">No location</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white/85">
                        {row.attendeeName ?? '—'}
                      </div>
                      <div className="text-xs text-white/40">
                        {row.attendeeEmail ?? ''}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs capitalize text-white/75">
                        {row.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-4 py-3 text-right">
                      <a
                        href={row.calUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/45 hover:text-white hover:underline"
                      >
                        Cal ↗
                      </a>
                      {tab === 'upcoming' || tab === 'unconfirmed' ? (
                        <button
                          type="button"
                          disabled={busyUid === row.uid}
                          onClick={() => void cancelBooking(row.uid)}
                          className="text-xs text-red-300 hover:underline disabled:opacity-40"
                        >
                          {busyUid === row.uid ? '…' : 'Cancel'}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </section>
  )
}
