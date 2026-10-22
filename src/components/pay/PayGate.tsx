'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { formatMoney, type SafeInvoice } from '@/lib/stripe-format'

type VerifyOk = {
  invoice: SafeInvoice
  payable: boolean
  message: string | null
}

export default function PayGate() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerifyOk | null>(null)

  async function onVerify(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await fetch('/api/pay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = (await res.json()) as VerifyOk & { error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Verification failed.')
        return
      }
      setResult({
        invoice: data.invoice,
        payable: data.payable,
        message: data.message,
      })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function onPay() {
    if (!result?.payable) return
    setError(null)
    setPaying(true)
    try {
      const res = await fetch('/api/pay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = (await res.json()) as {
        url?: string
        error?: string
        alreadyPaid?: boolean
      }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not open payment.')
        setPaying(false)
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Please try again.')
      setPaying(false)
    }
  }

  function onReset() {
    setResult(null)
    setError(null)
    setCode('')
  }

  const invoice = result?.invoice

  return (
    <div className="w-full max-w-md">
      {!invoice ? (
        <form onSubmit={onVerify} className="space-y-5">
          <div className="space-y-2 text-left">
            <label
              htmlFor="invoice-code"
              className="block text-xs font-medium uppercase tracking-[0.16em] text-white/50"
            >
              Invoice code
            </label>
            <input
              id="invoice-code"
              name="code"
              autoComplete="off"
              spellCheck={false}
              placeholder="e.g. INV-0001"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/30 focus:border-[#e31e24]/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#e31e24]/25"
            />
            <p className="text-xs leading-relaxed text-white/40">
              Enter the invoice number from the email we sent you. This confirms
              the invoice exists before you pay.
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
            disabled={loading || code.trim().length < 3}
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#e31e24] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c41920] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Checking…' : 'Continue'}
          </button>
        </form>
      ) : (
        <div className="space-y-5 text-left">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                  Invoice
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {invoice.number ?? invoice.id}
                </p>
              </div>
              <StatusPill status={invoice.status} payable={result.payable} />
            </div>

            {(invoice.customerName || invoice.customerEmail) && (
              <p className="mt-3 text-sm text-white/60">
                {[invoice.customerName, invoice.customerEmail]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            {invoice.description ? (
              <p className="mt-2 text-sm text-white/55">{invoice.description}</p>
            ) : null}

            {invoice.lines.length > 0 ? (
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                {invoice.lines.map((line, i) => (
                  <li
                    key={`${line.description}-${i}`}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <span className="text-white/70">
                      {line.description ?? 'Line item'}
                      {line.quantity && line.quantity > 1
                        ? ` × ${line.quantity}`
                        : ''}
                    </span>
                    <span className="shrink-0 tabular-nums text-white/85">
                      {formatMoney(line.amount, invoice.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-4">
              <span className="text-sm text-white/50">
                {result.payable ? 'Amount due' : 'Total'}
              </span>
              <span className="text-2xl font-semibold tabular-nums tracking-tight text-white">
                {formatMoney(
                  result.payable ? invoice.amountDue : invoice.total,
                  invoice.currency
                )}
              </span>
            </div>
          </div>

          {result.message ? (
            <p className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {result.message}
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-2.5">
            {result.payable ? (
              <button
                type="button"
                onClick={onPay}
                disabled={paying}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#e31e24] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c41920] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paying ? 'Opening secure checkout…' : 'Pay securely'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-transparent px-4 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Use a different code
            </button>
          </div>

          <p className="text-center text-[11px] text-white/35">
            Payments are processed by Stripe. Card details never touch this site.
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-sm text-white/40">
        <Link href="/" className="underline-offset-4 hover:text-white hover:underline">
          Back to card
        </Link>
      </p>
    </div>
  )
}

function StatusPill({
  status,
  payable,
}: {
  status: string | null
  payable: boolean
}) {
  const label = payable ? 'Due' : status === 'paid' ? 'Paid' : status ?? '—'
  const tone = payable
    ? 'border-[#e31e24]/40 bg-[#e31e24]/15 text-[#ffb4b7]'
    : status === 'paid'
      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200'
      : 'border-white/15 bg-white/5 text-white/60'

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tone}`}
    >
      {label}
    </span>
  )
}
