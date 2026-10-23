'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import type { SafeInvoice } from '@/lib/stripe-format'
import InvoiceDocument from '@/components/pay/InvoiceDocument'

type BankDetails = {
  transit: string
  institution: string
  account: string
}

type VerifyOk = {
  invoice: SafeInvoice
  payable: boolean
  bankAvailable: boolean
  message: string | null
}

export default function PayGate() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [bankLoading, setBankLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerifyOk | null>(null)
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null)

  async function onVerify(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setBankDetails(null)
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
        bankAvailable: Boolean(data.bankAvailable),
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

  function onDownloadPdf() {
    window.print()
  }

  async function onShowBank() {
    if (bankDetails) {
      setBankDetails(null)
      return
    }
    setError(null)
    setBankLoading(true)
    try {
      const res = await fetch('/api/pay/bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = (await res.json()) as {
        bank?: BankDetails
        error?: string
      }
      if (!res.ok || !data.bank) {
        setError(data.error ?? 'Could not load bank details.')
        return
      }
      setBankDetails(data.bank)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBankLoading(false)
    }
  }

  function onReset() {
    setResult(null)
    setError(null)
    setCode('')
    setBankDetails(null)
  }

  const invoice = result?.invoice

  return (
    <div className="w-full">
      {!invoice ? (
        <div className="mx-auto w-full max-w-md">
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
                Enter the invoice number from the email we sent you. This
                confirms the invoice exists before you pay.
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

          <p className="mt-8 text-center text-sm text-white/40">
            <Link
              href="/"
              className="underline-offset-4 hover:text-white hover:underline"
            >
              Back to card
            </Link>
          </p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-3xl space-y-5">
          <div className="print:hidden flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onReset}
              className="text-sm text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              ← Use a different code
            </button>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {result.payable ? (
                <button
                  type="button"
                  onClick={onPay}
                  disabled={paying}
                  className="inline-flex items-center justify-center rounded-xl bg-[#e31e24] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c41920] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {paying ? 'Opening Stripe…' : 'Pay with Stripe'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={onDownloadPdf}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Download PDF
              </button>
              {invoice.invoicePdf ? (
                <a
                  href={invoice.invoicePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  Stripe PDF
                </a>
              ) : null}
            </div>
          </div>

          {result.message ? (
            <p className="print:hidden rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
              {result.message}
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="print:hidden rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </p>
          ) : null}

          <InvoiceDocument
            invoice={invoice}
            payable={result.payable}
            bankDetails={bankDetails}
            bankAvailable={result.bankAvailable}
          />

          <div className="print:hidden space-y-3">
            {result.bankAvailable ? (
              <button
                type="button"
                onClick={onShowBank}
                disabled={bankLoading}
                className="text-sm text-white/55 underline-offset-4 hover:text-white hover:underline disabled:opacity-50"
              >
                {bankLoading
                  ? 'Loading…'
                  : bankDetails
                    ? 'Hide direct deposit details'
                    : 'Show direct deposit details'}
              </button>
            ) : null}

            <p className="text-center text-[11px] text-white/35">
              Payments are processed by Stripe. Card details never touch this
              site. Use Download PDF to save this invoice (print → Save as PDF).
            </p>

            <p className="text-center text-sm text-white/40">
              <Link
                href="/"
                className="underline-offset-4 hover:text-white hover:underline"
              >
                Back to card
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
