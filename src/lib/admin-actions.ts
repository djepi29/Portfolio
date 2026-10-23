import { getStripeAdmin } from '@/lib/stripe'
import { formatMoney } from '@/lib/stripe-format'
import type { CreatedCustomer, CreatedInvoice } from '@/lib/admin-types'

export type { CreatedCustomer, CreatedInvoice } from '@/lib/admin-types'

const DASH = 'https://dashboard.stripe.com'

export async function createAdminCustomer(input: {
  name?: string
  email?: string
  phone?: string
}): Promise<CreatedCustomer> {
  const stripe = getStripeAdmin()
  const email = input.email?.trim()
  const name = input.name?.trim()
  if (!email && !name) {
    throw new Error('Provide at least a name or email.')
  }

  const customer = await stripe.customers.create({
    name: name || undefined,
    email: email || undefined,
    phone: input.phone?.trim() || undefined,
  })

  return {
    id: customer.id,
    name: customer.name ?? null,
    email: customer.email ?? null,
    dashboardUrl: `${DASH}/customers/${customer.id}`,
  }
}

export type DraftInvoiceLine = {
  description: string
  /** Unit amount in cents (before quantity). Ignored when hours+rate set. */
  amountCents: number
  quantity?: number
  /** Optional extras stored in Stripe line metadata for the /pay document. */
  ref?: string
  hours?: number
  /** Hourly rate in cents. */
  rateCents?: number
}

export async function createDraftInvoice(input: {
  customerId: string
  currency?: string
  daysUntilDue?: number
  description?: string
  lines: DraftInvoiceLine[]
}): Promise<CreatedInvoice> {
  const stripe = getStripeAdmin()
  const customerId = input.customerId.trim()
  if (!customerId) throw new Error('Customer is required.')
  if (!input.lines.length) throw new Error('Add at least one line item.')

  const currency = (input.currency || 'cad').toLowerCase()
  const daysUntilDue = input.daysUntilDue ?? 14

  for (const line of input.lines) {
    if (!line.description.trim()) throw new Error('Each line needs a description.')
    const hasHoursRate =
      line.hours != null &&
      Number.isFinite(line.hours) &&
      line.hours > 0 &&
      line.rateCents != null &&
      Number.isFinite(line.rateCents) &&
      line.rateCents > 0
    if (hasHoursRate) continue
    if (!Number.isFinite(line.amountCents) || line.amountCents <= 0) {
      throw new Error('Line amounts must be positive (cents).')
    }
  }

  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: 'send_invoice',
    days_until_due: daysUntilDue,
    description: input.description?.trim() || undefined,
    auto_advance: false,
    pending_invoice_items_behavior: 'exclude',
  })

  for (const line of input.lines) {
    const qty = line.quantity && line.quantity > 0 ? line.quantity : 1
    const hours =
      line.hours != null && Number.isFinite(line.hours) && line.hours > 0
        ? line.hours
        : null
    const rateCents =
      line.rateCents != null &&
      Number.isFinite(line.rateCents) &&
      line.rateCents > 0
        ? Math.round(line.rateCents)
        : null

    let unitAmountCents = Math.round(line.amountCents)
    let quantity = qty

    if (hours != null && rateCents != null) {
      // Store full line total as a single unit; hours/rate live in metadata.
      unitAmountCents = Math.round(hours * rateCents)
      quantity = 1
    }

    if (!Number.isFinite(unitAmountCents) || unitAmountCents <= 0) {
      throw new Error('Line amounts must be positive (cents).')
    }

    const ref = line.ref?.trim() || ''
    const baseDescription = line.description.trim()
    // Keep description human-readable on Stripe's own PDF; structured
    // ref/hours/rate also go in metadata for the /pay document.
    const description =
      hours != null && rateCents != null
        ? `${ref ? `${ref} — ` : ''}${baseDescription} (${hours} hrs @ $${(rateCents / 100).toFixed(2)}/hr)`
        : ref
          ? `${ref} — ${baseDescription}`
          : baseDescription

    const metadata: Record<string, string> = {}
    if (ref) metadata.ref = ref
    if (hours != null) metadata.hours = String(hours)
    if (rateCents != null) metadata.rate_cents = String(rateCents)

    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      currency,
      // amount must equal unit × quantity; quantity is exposed on the invoice line.
      amount: unitAmountCents * quantity,
      quantity,
      description,
      ...(Object.keys(metadata).length ? { metadata } : {}),
    })
  }

  const refreshed = await stripe.invoices.retrieve(invoice.id)
  return toCreatedInvoice(refreshed)
}

export async function finalizeAdminInvoice(
  invoiceId: string
): Promise<CreatedInvoice> {
  const stripe = getStripeAdmin()
  const invoice = await stripe.invoices.finalizeInvoice(invoiceId.trim())
  return toCreatedInvoice(invoice)
}

export async function voidAdminInvoice(
  invoiceId: string
): Promise<CreatedInvoice> {
  const stripe = getStripeAdmin()
  const invoice = await stripe.invoices.voidInvoice(invoiceId.trim())
  return toCreatedInvoice(invoice)
}

export async function sendAdminInvoice(
  invoiceId: string
): Promise<CreatedInvoice> {
  const stripe = getStripeAdmin()
  const invoice = await stripe.invoices.sendInvoice(invoiceId.trim())
  return toCreatedInvoice(invoice)
}

function toCreatedInvoice(invoice: {
  id: string
  number?: string | null
  status?: string | null
  currency: string
  amount_due: number
  hosted_invoice_url?: string | null
}): CreatedInvoice {
  return {
    id: invoice.id,
    number: invoice.number ?? null,
    status: invoice.status ?? null,
    currency: invoice.currency,
    amountDue: invoice.amount_due,
    amountDueFormatted: formatMoney(invoice.amount_due, invoice.currency),
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    dashboardUrl: `${DASH}/invoices/${invoice.id}`,
    payCodeHint: invoice.number ?? null,
  }
}
