import { getStripeAdmin } from '@/lib/stripe'
import type { AdminActivityItem } from '@/lib/admin-types'

export type { AdminActivityItem } from '@/lib/admin-types'

const DASH = 'https://dashboard.stripe.com'

const INTERESTING = [
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.finalized',
  'invoice.voided',
  'charge.succeeded',
  'charge.failed',
  'charge.refunded',
  'charge.dispute.created',
  'customer.created',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
]

export async function listAdminActivity(
  limit = 40
): Promise<AdminActivityItem[]> {
  const stripe = getStripeAdmin()
  const events = await stripe.events.list({ limit: 100 })

  const filtered = events.data.filter((e) => INTERESTING.includes(e.type))
  const sliced = (filtered.length ? filtered : events.data).slice(0, limit)

  return sliced.map((event) => {
    const obj = event.data.object as {
      id?: string
      object?: string
      number?: string | null
      amount?: number
      amount_due?: number
      currency?: string
      email?: string | null
      customer_email?: string | null
      status?: string | null
    }

    const summary = summarize(event.type, obj)
    const dashboardUrl = dashboardFor(obj)

    return {
      id: event.id,
      type: event.type,
      created: event.created,
      summary,
      dashboardUrl,
    }
  })
}

function summarize(
  type: string,
  obj: {
    id?: string
    number?: string | null
    amount?: number
    amount_due?: number
    currency?: string
    email?: string | null
    customer_email?: string | null
    status?: string | null
  }
): string {
  const who = obj.customer_email || obj.email || obj.number || obj.id || ''
  const cents = obj.amount_due ?? obj.amount
  const money =
    typeof cents === 'number' && obj.currency
      ? `${(cents / 100).toFixed(2)} ${obj.currency.toUpperCase()}`
      : null

  const bits = [type, who, money, obj.status].filter(Boolean)
  return bits.join(' · ')
}

function dashboardFor(obj: {
  id?: string
  object?: string
}): string | null {
  if (!obj.id || !obj.object) return `${DASH}/events`
  switch (obj.object) {
    case 'invoice':
      return `${DASH}/invoices/${obj.id}`
    case 'charge':
      return `${DASH}/payments/${obj.id}`
    case 'customer':
      return `${DASH}/customers/${obj.id}`
    case 'payment_intent':
      return `${DASH}/payments/${obj.id}`
    case 'dispute':
      return `${DASH}/disputes/${obj.id}`
    default:
      return `${DASH}/events`
  }
}
