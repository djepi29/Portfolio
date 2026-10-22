'use client'

import { useCallback, useEffect, useState } from 'react'
import type {
  AdminCustomerRow,
  AdminInvoiceRow,
  AdminPaymentRow,
  AdminTaxInfo,
} from '@/lib/admin-lists'

type Tab = 'invoices' | 'customers' | 'payments' | 'tax'

const TABS: { id: Tab; label: string }[] = [
  { id: 'invoices', label: 'Invoices' },
  { id: 'customers', label: 'Customers' },
  { id: 'payments', label: 'Payments' },
  { id: 'tax', label: 'Tax' },
]

function formatDate(unix: number | null | undefined) {
  if (!unix) return '—'
  return new Date(unix * 1000).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminLists() {
  const [tab, setTab] = useState<Tab>('invoices')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [invoices, setInvoices] = useState<AdminInvoiceRow[] | null>(null)
  const [customers, setCustomers] = useState<AdminCustomerRow[] | null>(null)
  const [payments, setPayments] = useState<AdminPaymentRow[] | null>(null)
  const [tax, setTax] = useState<AdminTaxInfo | null>(null)

  const loadTab = useCallback(async (next: Tab, force = false) => {
    if (!force) {
      if (next === 'invoices' && invoices) return
      if (next === 'customers' && customers) return
      if (next === 'payments' && payments) return
      if (next === 'tax' && tax) return
    }

    setLoading(true)
    setError(null)
    try {
      const path =
        next === 'invoices'
          ? '/api/admin/invoices'
          : next === 'customers'
            ? '/api/admin/customers'
            : next === 'payments'
              ? '/api/admin/payments'
              : '/api/admin/tax'
      const res = await fetch(path)
      const json = (await res.json()) as {
        error?: string
        invoices?: AdminInvoiceRow[]
        customers?: AdminCustomerRow[]
        payments?: AdminPaymentRow[]
        tax?: AdminTaxInfo
      }
      if (!res.ok) {
        setError(json.error ?? 'Failed to load.')
        return
      }
      if (next === 'invoices') setInvoices(json.invoices ?? [])
      if (next === 'customers') setCustomers(json.customers ?? [])
      if (next === 'payments') setPayments(json.payments ?? [])
      if (next === 'tax') setTax(json.tax ?? null)
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }, [invoices, customers, payments, tax])

  useEffect(() => {
    void loadTab(tab)
  }, [tab, loadTab])

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Lists</h2>
          <p className="text-xs text-white/40">
            Weekly views — open rows in Stripe or use pay links where available.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadTab(tab, true)}
          disabled={loading}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white disabled:opacity-40"
        >
          Refresh list
        </button>
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

      {loading &&
      ((tab === 'invoices' && !invoices) ||
        (tab === 'customers' && !customers) ||
        (tab === 'payments' && !payments) ||
        (tab === 'tax' && !tax)) ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/45">
          Loading…
        </div>
      ) : null}

      {tab === 'invoices' && invoices ? <InvoicesTable rows={invoices} /> : null}
      {tab === 'customers' && customers ? (
        <CustomersTable rows={customers} />
      ) : null}
      {tab === 'payments' && payments ? <PaymentsTable rows={payments} /> : null}
      {tab === 'tax' && tax ? <TaxPanel tax={tax} /> : null}
    </section>
  )
}

function InvoicesTable({ rows }: { rows: AdminInvoiceRow[] }) {
  if (rows.length === 0) {
    return <Empty message="No invoices yet." />
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.12em] text-white/45">
          <tr>
            <th className="px-4 py-3 font-medium">Invoice</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Due</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium text-right">Links</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row) => (
            <tr key={row.id} className="bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="font-medium text-white">
                  {row.number ?? row.id}
                </div>
                <div className="text-xs text-white/40">
                  {formatDate(row.created)}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-white/85">
                  {row.customerName ?? '—'}
                </div>
                <div className="text-xs text-white/40">
                  {row.customerEmail ?? ''}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusPill
                  label={row.overdue ? 'overdue' : row.status ?? '—'}
                  tone={
                    row.overdue
                      ? 'warn'
                      : row.status === 'paid'
                        ? 'ok'
                        : row.status === 'open'
                          ? 'info'
                          : 'muted'
                  }
                />
              </td>
              <td className="px-4 py-3 text-white/70">
                {formatDate(row.dueDate)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-white">
                {row.status === 'open' ? row.amountDueFormatted : row.totalFormatted}
              </td>
              <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                {row.hostedInvoiceUrl ? (
                  <a
                    href={row.hostedInvoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#ffb4b7] hover:underline"
                  >
                    Pay link
                  </a>
                ) : null}
                <a
                  href={row.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/45 hover:text-white hover:underline"
                >
                  Stripe ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CustomersTable({ rows }: { rows: AdminCustomerRow[] }) {
  if (rows.length === 0) {
    return <Empty message="No customers yet." />
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.12em] text-white/45">
          <tr>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Flags</th>
            <th className="px-4 py-3 font-medium text-right">Balance</th>
            <th className="px-4 py-3 font-medium text-right">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row) => (
            <tr key={row.id} className="bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="font-medium text-white">
                  {row.name ?? 'Unnamed'}
                </div>
                <div className="text-xs text-white/40">{row.email ?? row.id}</div>
              </td>
              <td className="px-4 py-3 text-white/70">
                {formatDate(row.created)}
              </td>
              <td className="px-4 py-3">
                {row.delinquent ? (
                  <StatusPill label="delinquent" tone="warn" />
                ) : (
                  <span className="text-xs text-white/35">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-white">
                {row.balanceFormatted}
              </td>
              <td className="px-4 py-3 text-right">
                <a
                  href={row.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/45 hover:text-white hover:underline"
                >
                  Stripe ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PaymentsTable({ rows }: { rows: AdminPaymentRow[] }) {
  if (rows.length === 0) {
    return <Empty message="No payments yet." />
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.12em] text-white/45">
          <tr>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Amount</th>
            <th className="px-4 py-3 font-medium text-right">Links</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row) => (
            <tr key={row.id} className="bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="font-medium text-white">
                  {row.description ?? row.id}
                </div>
                <div className="text-xs text-white/40">
                  {formatDate(row.created)}
                </div>
              </td>
              <td className="px-4 py-3 text-white/70">
                {row.customerEmail ?? '—'}
              </td>
              <td className="px-4 py-3 space-y-1">
                <StatusPill
                  label={row.status ?? '—'}
                  tone={
                    row.status === 'succeeded'
                      ? 'ok'
                      : row.status === 'failed'
                        ? 'warn'
                        : 'muted'
                  }
                />
                {row.refunded ? (
                  <div className="text-[11px] text-white/45">
                    Refunded {row.amountRefundedFormatted}
                  </div>
                ) : null}
                {row.disputed ? (
                  <div className="text-[11px] text-amber-200">Disputed</div>
                ) : null}
                {row.failureMessage ? (
                  <div className="text-[11px] text-red-200 max-w-[14rem]">
                    {row.failureMessage}
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-white">
                {row.amountFormatted}
              </td>
              <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                {row.receiptUrl ? (
                  <a
                    href={row.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#ffb4b7] hover:underline"
                  >
                    Receipt
                  </a>
                ) : null}
                <a
                  href={row.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/45 hover:text-white hover:underline"
                >
                  Stripe ↗
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TaxPanel({ tax }: { tax: AdminTaxInfo }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">Stripe Tax</h3>
          <StatusPill
            label={tax.status}
            tone={
              tax.status === 'ready'
                ? 'ok'
                : tax.status === 'incomplete'
                  ? 'warn'
                  : 'muted'
            }
          />
        </div>
        <p className="text-sm text-white/60">{tax.detail}</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={tax.links.settings}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/45 hover:text-white hover:underline"
          >
            Tax settings ↗
          </a>
          <a
            href={tax.links.registrations}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/45 hover:text-white hover:underline"
          >
            Registrations ↗
          </a>
        </div>
      </div>

      {tax.registrations.length === 0 ? (
        <Empty message="No tax registrations on this account." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.12em] text-white/45">
              <tr>
                <th className="px-4 py-3 font-medium">Registration</th>
                <th className="px-4 py-3 font-medium">Region</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Active from</th>
                <th className="px-4 py-3 font-medium text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tax.registrations.map((r) => (
                <tr key={r.id} className="bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium text-white">{r.id}</td>
                  <td className="px-4 py-3 text-white/70">
                    {r.country}
                    {r.state ? ` · ${r.state}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={r.status ?? '—'}
                      tone={r.status === 'active' ? 'ok' : 'muted'}
                    />
                  </td>
                  <td className="px-4 py-3 text-white/70">
                    {formatDate(r.activeFrom)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={r.dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/45 hover:text-white hover:underline"
                    >
                      Stripe ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-white/45">
      {message}
    </div>
  )
}

function StatusPill({
  label,
  tone,
}: {
  label: string
  tone: 'ok' | 'warn' | 'info' | 'muted'
}) {
  const cls =
    tone === 'ok'
      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-100'
      : tone === 'warn'
        ? 'border-amber-500/30 bg-amber-500/15 text-amber-100'
        : tone === 'info'
          ? 'border-sky-500/30 bg-sky-500/15 text-sky-100'
          : 'border-white/15 bg-white/5 text-white/55'
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  )
}
