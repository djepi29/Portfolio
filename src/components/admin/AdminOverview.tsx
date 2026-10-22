'use client'

import { useCallback, useEffect, useState } from 'react'
import type { AdminOverview as Overview, AttentionItem } from '@/lib/admin-overview'

export default function AdminOverview() {
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/overview')
      const json = (await res.json()) as Overview & { error?: string }
      if (!res.ok) {
        setError(json.error ?? 'Failed to load overview.')
        setData(null)
        return
      }
      setData(json)
    } catch {
      setError('Network error loading overview.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
        Loading Stripe overview…
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-100">
          {error}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:text-white"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Overview</h2>
          <p className="text-xs text-white/40">
            {data.account.businessName ?? 'Stripe account'} · updated{' '}
            {new Date(data.fetchedAt).toLocaleString()}
            {loading ? ' · refreshing…' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Available"
          value={data.balance.availableFormatted}
          href={data.links.balance}
          hint={`Pending ${data.balance.pendingFormatted}`}
        />
        <Kpi
          label="Open invoices"
          value={String(data.invoices.openCount)}
          href={data.links.openInvoices}
          hint={data.invoices.openAmountFormatted}
          warn={data.invoices.overdueCount > 0}
        />
        <Kpi
          label="Failed (30d)"
          value={String(data.payments.recentFailed)}
          href={data.links.payments}
          hint={`${data.payments.recentSucceeded} succeeded · ${data.payments.recentRefunded} refunded`}
          warn={data.payments.recentFailed > 0}
        />
        <Kpi
          label="Disputes"
          value={String(data.disputes.openCount)}
          href={data.links.disputes}
          hint={
            data.disputes.needsResponseCount > 0
              ? `${data.disputes.needsResponseCount} need response`
              : 'None need response'
          }
          warn={data.disputes.needsResponseCount > 0}
        />
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-white/45">
          Needs attention
        </h3>
        {data.attention.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Nothing urgent. Account looks clear.
          </div>
        ) : (
          <ul className="space-y-2">
            {data.attention.map((item) => (
              <AttentionRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
          <h3 className="text-sm font-semibold">Account</h3>
          <StatusLine
            ok={data.account.chargesEnabled === true}
            label="Charges"
            value={
              data.account.chargesEnabled == null
                ? 'Unknown'
                : data.account.chargesEnabled
                  ? 'Enabled'
                  : 'Disabled'
            }
          />
          <StatusLine
            ok={data.account.payoutsEnabled === true}
            label="Payouts"
            value={
              data.account.payoutsEnabled == null
                ? 'Unknown'
                : data.account.payoutsEnabled
                  ? 'Enabled'
                  : 'Disabled'
            }
          />
          <StatusLine
            ok={(data.account.currentlyDue?.length ?? 0) === 0}
            label="Requirements"
            value={
              data.account.currentlyDue.length === 0
                ? 'Clear'
                : `${data.account.currentlyDue.length} due`
            }
          />
          <a
            href={data.links.account}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block pt-2 text-xs text-white/45 underline-offset-4 hover:text-white hover:underline"
          >
            Open account settings ↗
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
          <h3 className="text-sm font-semibold">Tax & currency</h3>
          <StatusLine
            ok={data.tax.status === 'ready'}
            label="Stripe Tax"
            value={data.tax.status ?? 'Unavailable'}
          />
          <p className="text-xs text-white/45">{data.tax.detail}</p>
          <p className="text-xs text-white/45">
            Default currency:{' '}
            <span className="text-white/70">
              {(data.account.defaultCurrency ?? data.currency).toUpperCase()}
            </span>
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={data.links.tax}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/45 underline-offset-4 hover:text-white hover:underline"
            >
              Tax settings ↗
            </a>
            <a
              href={data.links.balance}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/45 underline-offset-4 hover:text-white hover:underline"
            >
              Balance ↗
            </a>
          </div>
        </div>
      </section>

      <p className="text-[11px] text-white/35">
        Overview is read-only. Lists below cover invoices, customers, payments,
        and tax. Create/finalize invoices come in Phase 3.
      </p>
    </div>
  )
}

function Kpi({
  label,
  value,
  hint,
  href,
  warn,
}: {
  label: string
  value: string
  hint: string
  href: string
  warn?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-2xl border p-4 transition hover:border-white/25 ${
        warn
          ? 'border-amber-500/30 bg-amber-500/10'
          : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs text-white/45">{hint}</p>
    </a>
  )
}

function AttentionRow({ item }: { item: AttentionItem }) {
  const tone =
    item.severity === 'critical'
      ? 'border-red-500/30 bg-red-500/10'
      : item.severity === 'warning'
        ? 'border-amber-500/30 bg-amber-500/10'
        : 'border-white/10 bg-white/[0.03]'

  return (
    <li>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 transition hover:border-white/25 ${tone}`}
      >
        <div>
          <p className="text-sm font-medium text-white">{item.title}</p>
          <p className="mt-0.5 text-xs text-white/55">{item.detail}</p>
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-wide text-white/40">
          {item.severity}
        </span>
      </a>
    </li>
  )
}

function StatusLine({
  label,
  value,
  ok,
}: {
  label: string
  value: string
  ok: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-white/50">{label}</span>
      <span className={ok ? 'text-emerald-200' : 'text-amber-200'}>{value}</span>
    </div>
  )
}
