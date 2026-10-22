/** Shared client-safe helpers (no Stripe Node SDK). */

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
  description: string | null
  dueDate: number | null
  hostedInvoiceUrl: string | null
  lines: Array<{
    description: string | null
    amount: number
    quantity: number | null
  }>
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

export function normalizeInvoiceCode(raw: string): string {
  return raw.trim().replace(/\s+/g, '').toUpperCase()
}
