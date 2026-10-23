'use client'

import Image from 'next/image'
import {
  formatAddress,
  formatInvoiceDate,
  formatMoney,
  hasExtendedLineDetails,
  sumLineHours,
  type SafeInvoice,
} from '@/lib/stripe-format'
import { INVOICE_ISSUER } from '@/lib/invoice-brand'

type BankDetails = {
  transit: string
  institution: string
  account: string
}

type Props = {
  invoice: SafeInvoice
  payable: boolean
  bankDetails?: BankDetails | null
  bankAvailable?: boolean
}

function isPastDue(invoice: SafeInvoice, payable: boolean): boolean {
  if (!payable || !invoice.dueDate) return false
  return invoice.dueDate * 1000 < Date.now()
}

function statusLabel(
  invoice: SafeInvoice,
  payable: boolean,
  pastDue: boolean
): string {
  if (pastDue) return 'Past Due'
  if (payable) return 'Due'
  if (invoice.status === 'paid') return 'Paid'
  if (invoice.status === 'void') return 'Void'
  return invoice.status ? invoice.status.replace(/_/g, ' ') : '—'
}

export default function InvoiceDocument({
  invoice,
  payable,
  bankDetails = null,
  bankAvailable = false,
}: Props) {
  const extended = hasExtendedLineDetails(invoice.lines)
  const totalHours = sumLineHours(invoice.lines)
  const addressLines = formatAddress(invoice.customerAddress)
  const pastDue = isPastDue(invoice, payable)
  const status = statusLabel(invoice, payable, pastDue)
  const amountDisplay = formatMoney(
    payable ? invoice.amountDue : invoice.total,
    invoice.currency
  )
  const currency = invoice.currency.toUpperCase()

  return (
    <article
      id="invoice-document"
      className="relative overflow-hidden rounded-sm border border-slate-200 bg-white text-slate-900 shadow-sm"
    >
      {/* Watermark */}
      <div
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 opacity-[0.06] print:opacity-[0.08]"
        aria-hidden
      >
        <Image
          src="/logo.png"
          alt=""
          width={280}
          height={88}
          className="h-28 w-auto object-contain"
        />
      </div>

      <div className="relative px-6 py-7 sm:px-9 sm:py-9">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Kanson Wouj Digital"
              width={160}
              height={50}
              className="h-12 w-auto object-contain sm:h-14"
              priority
            />
            <div className="hidden leading-none sm:block">
              <p className="text-sm font-extrabold tracking-tight text-slate-900">
                KANSON WOUJ
              </p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.28em] text-slate-500">
                DIGITAL
              </p>
            </div>
          </div>
          <h1 className="text-right text-xl font-extrabold tracking-wide text-[#1e3a5f] sm:text-2xl">
            INVOICE
          </h1>
        </header>

        {/* Issuer + meta */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed">
            <p className="font-semibold text-slate-900">{INVOICE_ISSUER.name}</p>
            <p className="mt-1 text-slate-600">
              {INVOICE_ISSUER.binLabel}: {INVOICE_ISSUER.bin}
            </p>
            <p className="text-slate-600">{INVOICE_ISSUER.location}</p>
            <p className="text-slate-600">{INVOICE_ISSUER.role}</p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed">
            <MetaRow
              label="Invoice No."
              value={invoice.number ?? invoice.id}
            />
            <MetaRow
              label="Invoice Date"
              value={formatInvoiceDate(invoice.created)}
            />
            <MetaRow
              label="Payment Due"
              value={formatInvoiceDate(invoice.dueDate)}
            />
            <MetaRow
              label="Status"
              value={status}
              valueClassName={
                pastDue || payable
                  ? 'font-bold text-[#e31e24]'
                  : invoice.status === 'paid'
                    ? 'font-semibold text-emerald-700'
                    : 'font-semibold'
              }
            />
          </div>
        </div>

        {/* Bill to + totals */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1e3a5f]">
              Bill To
            </p>
            <div className="mt-2 text-sm leading-relaxed text-slate-800">
              {invoice.customerName ? (
                <p className="font-semibold">{invoice.customerName}</p>
              ) : null}
              {invoice.customerEmail ? (
                <p className="text-slate-600">{invoice.customerEmail}</p>
              ) : null}
              {addressLines.map((line) => (
                <p key={line} className="text-slate-600">
                  {line}
                </p>
              ))}
              {!invoice.customerName &&
              !invoice.customerEmail &&
              addressLines.length === 0 ? (
                <p className="text-slate-400">—</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-stretch justify-end gap-2 sm:items-end">
            {totalHours != null ? (
              <p className="text-sm text-slate-700">
                Total Hours:{' '}
                <span className="font-semibold tabular-nums">
                  {totalHours.toFixed(2)}
                </span>
              </p>
            ) : null}
            <p className="text-sm text-slate-700 sm:text-right">
              {payable ? 'Total Amount Due' : 'Total'}:{' '}
              <span className="text-lg font-bold tabular-nums text-[#e31e24]">
                {amountDisplay} {currency}
              </span>
            </p>
          </div>
        </div>

        {invoice.description ? (
          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            {invoice.description}
          </p>
        ) : null}

        {/* Line table */}
        <div className="mt-6 overflow-x-auto">
          {extended ? (
            <ExtendedTable invoice={invoice} />
          ) : (
            <SimpleTable invoice={invoice} />
          )}
        </div>

        {/* Footer: bank + notes */}
        <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div>
            {bankDetails ? (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1e3a5f]">
                  Direct Deposit Information
                </p>
                <table className="mt-2 w-full max-w-xs text-sm">
                  <tbody>
                    <BankRow label="Transit number" value={bankDetails.transit} />
                    <BankRow
                      label="Institution number"
                      value={bankDetails.institution}
                    />
                    <BankRow label="Account number" value={bankDetails.account} />
                  </tbody>
                </table>
              </>
            ) : bankAvailable ? (
              <p className="text-xs text-slate-400 print:hidden">
                Prefer Pay with Stripe. Direct deposit details can be revealed
                below if needed.
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Pay securely with Stripe using the button above.
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1e3a5f]">
              Notes
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-600">
              <li>
                Amounts reflect the line items on this Stripe invoice for
                completed work.
              </li>
              <li>
                No GST/HST is charged on this invoice unless listed as a separate
                line. The contractor remains responsible for applicable
                tax-remittance obligations.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

function MetaRow({
  label,
  value,
  valueClassName = 'font-medium text-slate-900',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="flex justify-between gap-3 py-0.5">
      <span className="text-slate-500">{label}:</span>
      <span className={`text-right ${valueClassName}`}>{value}</span>
    </div>
  )
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-1.5 pr-3 text-slate-500">{label}</td>
      <td className="py-1.5 text-right font-mono text-slate-900">{value}</td>
    </tr>
  )
}

function SimpleTable({ invoice }: { invoice: SafeInvoice }) {
  return (
    <table className="w-full min-w-[420px] border-collapse text-sm">
      <thead>
        <tr className="bg-[#1e3a5f] text-left text-white">
          <th className="px-3 py-2.5 font-semibold">Description</th>
          <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
          <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice.lines.length === 0 ? (
          <tr className="border-b border-slate-100">
            <td colSpan={3} className="px-3 py-4 text-slate-400">
              No line items
            </td>
          </tr>
        ) : (
          invoice.lines.map((line, i) => (
            <tr
              key={`${line.description}-${i}`}
              className="border-b border-slate-100 align-top"
            >
              <td className="px-3 py-3 text-slate-800">
                {line.description ?? 'Line item'}
              </td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-600">
                {line.quantity ?? 1}
              </td>
              <td className="px-3 py-3 text-right tabular-nums font-medium text-slate-900">
                {formatMoney(line.amount, invoice.currency)}
              </td>
            </tr>
          ))
        )}
      </tbody>
      <tfoot>
        <tr className="bg-slate-50 font-semibold">
          <td className="px-3 py-3" colSpan={2}>
            TOTAL
          </td>
          <td className="px-3 py-3 text-right tabular-nums">
            {formatMoney(invoice.total, invoice.currency)}
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

function ExtendedTable({ invoice }: { invoice: SafeInvoice }) {
  const totalHours = sumLineHours(invoice.lines)
  return (
    <table className="w-full min-w-[640px] border-collapse text-sm">
      <thead>
        <tr className="bg-[#1e3a5f] text-left text-white">
          <th className="px-2.5 py-2.5 font-semibold">Ref.</th>
          <th className="px-2.5 py-2.5 font-semibold">Work completed</th>
          <th className="px-2.5 py-2.5 text-right font-semibold">Hours</th>
          <th className="px-2.5 py-2.5 text-right font-semibold">Rate</th>
          <th className="px-2.5 py-2.5 text-right font-semibold">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoice.lines.map((line, i) => (
          <tr
            key={`${line.ref}-${i}`}
            className="border-b border-slate-100 align-top"
          >
            <td className="px-2.5 py-3 font-medium text-slate-800">
              {line.ref || '—'}
            </td>
            <td className="px-2.5 py-3 text-slate-700">
              {displayWorkDescription(line.description, line.ref) || '—'}
            </td>
            <td className="px-2.5 py-3 text-right tabular-nums text-slate-700">
              {line.hours != null ? line.hours.toFixed(2) : '—'}
            </td>
            <td className="px-2.5 py-3 text-right tabular-nums text-slate-700">
              {line.rateCents != null
                ? `${formatMoney(line.rateCents, invoice.currency)}/hr`
                : '—'}
            </td>
            <td className="px-2.5 py-3 text-right tabular-nums font-medium text-slate-900">
              {formatMoney(line.amount, invoice.currency)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-slate-50 font-semibold">
          <td className="px-2.5 py-3" colSpan={2}>
            TOTAL
          </td>
          <td className="px-2.5 py-3 text-right tabular-nums">
            {totalHours != null ? totalHours.toFixed(2) : '—'}
          </td>
          <td className="px-2.5 py-3" />
          <td className="px-2.5 py-3 text-right tabular-nums">
            {formatMoney(invoice.total, invoice.currency)}
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

/** Clean description for the extended table (ref / hours live in their own columns). */
function displayWorkDescription(
  description: string | null,
  ref: string | null
): string | null {
  if (!description) return null
  let text = description.replace(
    /\s*\(\d+(?:\.\d+)?\s*hrs?\s*@\s*[^)]+\)\s*$/i,
    ''
  )
  if (ref) {
    const escaped = ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    text = text.replace(new RegExp(`^${escaped}\\s*—\\s*`, 'i'), '')
  }
  return text.trim() || null
}
