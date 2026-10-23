/** Shared client-safe helpers (no Stripe Node SDK). */

export type SafeAddress = {
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
}

export type SafeInvoiceLine = {
  description: string | null
  amount: number
  quantity: number | null
  /** Optional extras from Stripe line metadata (admin-supplied). */
  ref: string | null
  hours: number | null
  rateCents: number | null
}

export type SafeInvoice = {
  id: string
  number: string | null
  status: string | null
  currency: string
  amountDue: number
  amountPaid: number
  total: number
  customerName: string | null
  customerEmail: string | null
  customerAddress: SafeAddress | null
  description: string | null
  created: number | null
  dueDate: number | null
  hostedInvoiceUrl: string | null
  /** Present after verify; used for optional Stripe PDF download. */
  invoicePdf: string | null
  lines: SafeInvoiceLine[]
}

export function formatMoney(amountCents: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100)
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`
  }
}

export function formatInvoiceDate(unixSeconds: number | null): string {
  if (!unixSeconds) return '—'
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(unixSeconds * 1000))
}

export function normalizeInvoiceCode(raw: string): string {
  return raw.trim().replace(/\s+/g, '').toUpperCase()
}

export function formatAddress(addr: SafeAddress | null): string[] {
  if (!addr) return []
  const lines: string[] = []
  if (addr.line1) lines.push(addr.line1)
  if (addr.line2) lines.push(addr.line2)
  const cityLine = [addr.city, addr.state, addr.postalCode]
    .filter(Boolean)
    .join(', ')
  if (cityLine) lines.push(cityLine)
  if (addr.country) lines.push(addr.country)
  return lines
}

/** True when at least one line carries hours/rate/ref from admin metadata. */
export function hasExtendedLineDetails(lines: SafeInvoiceLine[]): boolean {
  return lines.some(
    (l) =>
      (l.ref && l.ref.trim()) ||
      (l.hours != null && Number.isFinite(l.hours)) ||
      (l.rateCents != null && Number.isFinite(l.rateCents))
  )
}

export function sumLineHours(lines: SafeInvoiceLine[]): number | null {
  const values = lines
    .map((l) => l.hours)
    .filter((h): h is number => h != null && Number.isFinite(h))
  if (!values.length) return null
  return values.reduce((a, b) => a + b, 0)
}
