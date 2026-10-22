'use client'

import { FormEvent, useCallback, useEffect, useState } from 'react'
import type { AdminCustomerRow } from '@/lib/admin-lists'
import type { CreatedInvoice } from '@/lib/admin-types'

type LineDraft = { description: string; amountDollars: string; quantity: string }

const emptyLine = (): LineDraft => ({
  description: '',
  amountDollars: '',
  quantity: '1',
})

export default function AdminActions() {
  const [customers, setCustomers] = useState<AdminCustomerRow[]>([])
  const [custName, setCustName] = useState('')
  const [custEmail, setCustEmail] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [daysUntilDue, setDaysUntilDue] = useState('14')
  const [currency, setCurrency] = useState('cad')
  const [description, setDescription] = useState('')
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()])
  const [invoiceId, setInvoiceId] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [lastInvoice, setLastInvoice] = useState<CreatedInvoice | null>(null)

  const loadCustomers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/customers')
      const json = (await res.json()) as {
        customers?: AdminCustomerRow[]
      }
      if (res.ok) setCustomers(json.customers ?? [])
    } catch {
      /* ignore for form */
    }
  }, [])

  useEffect(() => {
    void loadCustomers()
  }, [loadCustomers])

  async function createCustomer(e: FormEvent) {
    e.preventDefault()
    setBusy('customer')
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: custName, email: custEmail }),
      })
      const json = (await res.json()) as {
        error?: string
        customer?: { id: string; name: string | null; email: string | null }
      }
      if (!res.ok) {
        setError(json.error ?? 'Create customer failed.')
        return
      }
      setNotice(
        `Customer created: ${json.customer?.name || json.customer?.email || json.customer?.id}`
      )
      setCustomerId(json.customer?.id ?? '')
      setCustName('')
      setCustEmail('')
      await loadCustomers()
    } catch {
      setError('Network error creating customer.')
    } finally {
      setBusy(null)
    }
  }

  async function createInvoice(e: FormEvent) {
    e.preventDefault()
    setBusy('invoice')
    setError(null)
    setNotice(null)
    setLastInvoice(null)
    try {
      const parsedLines = lines
        .filter((l) => l.description.trim() && l.amountDollars.trim())
        .map((l) => ({
          description: l.description.trim(),
          amountCents: Math.round(parseFloat(l.amountDollars) * 100),
          quantity: Math.max(1, parseInt(l.quantity || '1', 10) || 1),
        }))

      const res = await fetch('/api/admin/invoices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          currency,
          daysUntilDue: parseInt(daysUntilDue, 10) || 14,
          description,
          lines: parsedLines,
        }),
      })
      const json = (await res.json()) as {
        error?: string
        invoice?: CreatedInvoice
      }
      if (!res.ok || !json.invoice) {
        setError(json.error ?? 'Create invoice failed.')
        return
      }
      setLastInvoice(json.invoice)
      setInvoiceId(json.invoice.id)
      setNotice(
        `Draft invoice created (${json.invoice.amountDueFormatted}). Finalize to get a pay code.`
      )
      setLines([emptyLine()])
    } catch {
      setError('Network error creating invoice.')
    } finally {
      setBusy(null)
    }
  }

  async function runInvoiceAction(action: 'finalize' | 'send' | 'void') {
    if (!invoiceId.trim()) {
      setError('Enter an invoice ID first.')
      return
    }
    if (action === 'void') {
      const ok = window.confirm(
        'Void this invoice? This cannot be undone from here.'
      )
      if (!ok) return
    }
    setBusy(action)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch('/api/admin/invoices/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId, action }),
      })
      const json = (await res.json()) as {
        error?: string
        invoice?: CreatedInvoice
      }
      if (!res.ok || !json.invoice) {
        setError(json.error ?? 'Action failed.')
        return
      }
      setLastInvoice(json.invoice)
      if (action === 'finalize' && json.invoice.payCodeHint) {
        setNotice(
          `Finalized. Client pay code for /pay: ${json.invoice.payCodeHint}`
        )
      } else if (action === 'send') {
        setNotice('Invoice emailed via Stripe.')
      } else if (action === 'void') {
        setNotice('Invoice voided.')
      } else {
        setNotice(`Invoice ${action}d.`)
      }
    } catch {
      setError('Network error.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Actions</h2>
        <p className="text-xs text-white/40">
          Phase 3 write tools — create customers & invoices, then finalize for
          `/pay`.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}

      {lastInvoice ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm space-y-1">
          <p className="font-medium text-white">
            Invoice {lastInvoice.number ?? lastInvoice.id}
          </p>
          <p className="text-white/55">
            {lastInvoice.status} · {lastInvoice.amountDueFormatted}
          </p>
          {lastInvoice.payCodeHint ? (
            <p className="text-[#ffb4b7]">
              `/pay` code: <strong>{lastInvoice.payCodeHint}</strong>
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-1">
            {lastInvoice.hostedInvoiceUrl ? (
              <a
                href={lastInvoice.hostedInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#ffb4b7] hover:underline"
              >
                Hosted pay page ↗
              </a>
            ) : null}
            <a
              href={lastInvoice.dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/45 hover:text-white hover:underline"
            >
              Stripe ↗
            </a>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={createCustomer}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold">Create customer</h3>
          <Field
            label="Name"
            value={custName}
            onChange={setCustName}
            placeholder="Acme Co"
          />
          <Field
            label="Email"
            value={custEmail}
            onChange={setCustEmail}
            placeholder="billing@client.com"
            type="email"
          />
          <button
            type="submit"
            disabled={busy !== null}
            className="w-full rounded-xl bg-[#e31e24] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy === 'customer' ? 'Creating…' : 'Create customer'}
          </button>
        </form>

        <form
          onSubmit={createInvoice}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3"
        >
          <h3 className="text-sm font-semibold">Create draft invoice</h3>
          <label className="block space-y-1.5 text-sm">
            <span className="text-xs uppercase tracking-[0.14em] text-white/45">
              Customer
            </span>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#0c0e14] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e31e24]/50"
            >
              <option value="">Select customer…</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.name || c.email || c.id) +
                    (c.email && c.name ? ` · ${c.email}` : '')}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Days until due"
              value={daysUntilDue}
              onChange={setDaysUntilDue}
            />
            <Field label="Currency" value={currency} onChange={setCurrency} />
          </div>
          <Field
            label="Memo (optional)"
            value={description}
            onChange={setDescription}
            placeholder="Project milestone 1"
          />

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.14em] text-white/45">
              Line items
            </p>
            {lines.map((line, i) => (
              <div key={i} className="grid grid-cols-6 gap-2">
                <input
                  className="col-span-3 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-sm"
                  placeholder="Description"
                  value={line.description}
                  onChange={(e) => {
                    const next = [...lines]
                    next[i] = { ...line, description: e.target.value }
                    setLines(next)
                  }}
                />
                <input
                  className="col-span-2 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-sm"
                  placeholder="Amount $"
                  value={line.amountDollars}
                  onChange={(e) => {
                    const next = [...lines]
                    next[i] = { ...line, amountDollars: e.target.value }
                    setLines(next)
                  }}
                />
                <input
                  className="col-span-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-sm"
                  placeholder="Qty"
                  value={line.quantity}
                  onChange={(e) => {
                    const next = [...lines]
                    next[i] = { ...line, quantity: e.target.value }
                    setLines(next)
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLines([...lines, emptyLine()])}
              className="text-xs text-white/50 hover:text-white"
            >
              + Add line
            </button>
          </div>

          <button
            type="submit"
            disabled={busy !== null || !customerId}
            className="w-full rounded-xl bg-[#e31e24] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy === 'invoice' ? 'Creating…' : 'Create draft'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
        <h3 className="text-sm font-semibold">Invoice actions</h3>
        <Field
          label="Invoice ID"
          value={invoiceId}
          onChange={setInvoiceId}
          placeholder="in_…"
        />
        <div className="flex flex-wrap gap-2">
          <ActionBtn
            label={busy === 'finalize' ? '…' : 'Finalize'}
            onClick={() => void runInvoiceAction('finalize')}
            disabled={busy !== null}
          />
          <ActionBtn
            label={busy === 'send' ? '…' : 'Send email'}
            onClick={() => void runInvoiceAction('send')}
            disabled={busy !== null}
          />
          <ActionBtn
            label={busy === 'void' ? '…' : 'Void'}
            onClick={() => void runInvoiceAction('void')}
            disabled={busy !== null}
            danger
          />
        </div>
        <p className="text-[11px] text-white/35">
          Finalize assigns the invoice number used as the `/pay` code. Send
          emails the Stripe hosted invoice. Void cancels an open invoice.
        </p>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-xs uppercase tracking-[0.14em] text-white/45">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e31e24]/50"
      />
    </label>
  )
}

function ActionBtn({
  label,
  onClick,
  disabled,
  danger,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-40 ${
        danger
          ? 'border border-red-500/40 text-red-200 hover:bg-red-500/10'
          : 'border border-white/15 text-white/80 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}
