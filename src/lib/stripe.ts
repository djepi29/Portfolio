import Stripe from 'stripe'
import {
  normalizeInvoiceCode,
  type SafeInvoice,
} from '@/lib/stripe-format'

export { normalizeInvoiceCode, formatMoney, type SafeInvoice } from '@/lib/stripe-format'

let stripePayClient: Stripe | null = null
let stripeAdminClient: Stripe | null = null

/** Restricted One-time payments key for the public /pay flow. */
export function getStripe(): Stripe {
  const key =
    process.env.STRIPE_SECRET_KEY_PAY_PAGE?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY_PAY_PAGE is not set')
  }
  if (!stripePayClient) {
    stripePayClient = new Stripe(key, {
      apiVersion: '2026-09-30.endive',
      typescript: true,
    })
  }
  return stripePayClient
}

/**
 * Broader admin key (Full access—except sensitive).
 * Use only in private admin routes — never on the public /pay path.
 */
export function getStripeAdmin(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY_ADMIN?.trim()
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY_ADMIN is not set')
  }
  if (!stripeAdminClient) {
    stripeAdminClient = new Stripe(key, {
      apiVersion: '2026-09-30.endive',
      typescript: true,
    })
  }
  return stripeAdminClient
}

/** Live publishable key (pk_live_…) for future client-side Stripe.js. */
export function getStripePublishableKey(): string {
  const key =
    process.env.STRIPE_PUBLISHABLE_KEY_LIVE?.trim() ||
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
    process.env.STRIPE_PUBLISHABLE_KEY?.trim()
  if (!key) {
    throw new Error('STRIPE_PUBLISHABLE_KEY_LIVE is not set')
  }
  return key
}

export function toSafeInvoice(invoice: Stripe.Invoice): SafeInvoice {
  return {
    id: invoice.id,
    number: invoice.number ?? null,
    status: invoice.status ?? null,
    currency: invoice.currency,
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    total: invoice.total,
    customerName: invoice.customer_name ?? null,
    customerEmail: invoice.customer_email ?? null,
    description: invoice.description ?? null,
    dueDate: invoice.due_date ?? null,
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    lines: (invoice.lines?.data ?? []).map((line) => ({
      description: line.description ?? null,
      amount: line.amount,
      quantity: line.quantity ?? null,
    })),
  }
}

/** Find an invoice by its human-facing number (e.g. INV-0001). */
export async function findInvoiceByNumber(
  code: string
): Promise<Stripe.Invoice | null> {
  const stripe = getStripe()
  const number = normalizeInvoiceCode(code)
  if (!number) return null

  // Escape quotes in user input for search query
  const escaped = number.replace(/"/g, '')

  try {
    const result = await stripe.invoices.search({
      query: `number:"${escaped}"`,
      limit: 1,
    })
    if (result.data[0]) return result.data[0]
  } catch {
    // Search may be unavailable on some accounts; fall back to list scan.
  }

  let startingAfter: string | undefined
  for (let page = 0; page < 5; page += 1) {
    const list = await stripe.invoices.list({
      limit: 100,
      starting_after: startingAfter,
    })
    const match = list.data.find(
      (inv) => inv.number && normalizeInvoiceCode(inv.number) === number
    )
    if (match) return match
    if (!list.has_more || list.data.length === 0) break
    startingAfter = list.data[list.data.length - 1]?.id
  }

  return null
}
