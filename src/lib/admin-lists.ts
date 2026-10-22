import { getStripeAdmin } from '@/lib/stripe'
import { formatMoney } from '@/lib/stripe-format'

const DASH = 'https://dashboard.stripe.com'

export type AdminInvoiceRow = {
  id: string
  number: string | null
  status: string | null
  currency: string
  amountDue: number
  amountDueFormatted: string
  total: number
  totalFormatted: string
  customerName: string | null
  customerEmail: string | null
  dueDate: number | null
  created: number
  hostedInvoiceUrl: string | null
  dashboardUrl: string
  overdue: boolean
}

export type AdminCustomerRow = {
  id: string
  name: string | null
  email: string | null
  created: number
  currency: string | null
  balance: number
  balanceFormatted: string
  delinquent: boolean
  dashboardUrl: string
}

export type AdminPaymentRow = {
  id: string
  amount: number
  amountFormatted: string
  amountRefunded: number
  amountRefundedFormatted: string
  currency: string
  status: string | null
  paid: boolean
  refunded: boolean
  disputed: boolean
  failureMessage: string | null
  customerEmail: string | null
  description: string | null
  created: number
  receiptUrl: string | null
  dashboardUrl: string
}

export type AdminTaxInfo = {
  headOfficeCountry: string | null
  status: 'ready' | 'incomplete' | 'unavailable'
  detail: string
  registrations: Array<{
    id: string
    country: string
    state: string | null
    status: string | null
    activeFrom: number | null
    dashboardUrl: string
  }>
  links: {
    settings: string
    registrations: string
  }
}

export async function listAdminInvoices(
  limit = 40
): Promise<AdminInvoiceRow[]> {
  const stripe = getStripeAdmin()
  const nowSec = Math.floor(Date.now() / 1000)
  const list = await stripe.invoices.list({ limit, expand: ['data.customer'] })

  return list.data.map((inv) => {
    const customer =
      inv.customer && typeof inv.customer === 'object' && !('deleted' in inv.customer && inv.customer.deleted)
        ? inv.customer
        : null
    const currency = inv.currency
    const overdue = Boolean(
      inv.status === 'open' &&
        inv.due_date &&
        inv.due_date < nowSec &&
        inv.amount_due > 0
    )
    return {
      id: inv.id,
      number: inv.number ?? null,
      status: inv.status ?? null,
      currency,
      amountDue: inv.amount_due,
      amountDueFormatted: formatMoney(inv.amount_due, currency),
      total: inv.total,
      totalFormatted: formatMoney(inv.total, currency),
      customerName: inv.customer_name ?? customer?.name ?? null,
      customerEmail: inv.customer_email ?? customer?.email ?? null,
      dueDate: inv.due_date ?? null,
      created: inv.created,
      hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
      dashboardUrl: `${DASH}/invoices/${inv.id}`,
      overdue,
    }
  })
}

export async function listAdminCustomers(
  limit = 40
): Promise<AdminCustomerRow[]> {
  const stripe = getStripeAdmin()
  const list = await stripe.customers.list({ limit })

  return list.data.map((c) => {
    const currency = c.currency ?? 'cad'
    return {
      id: c.id,
      name: c.name ?? null,
      email: c.email ?? null,
      created: c.created,
      currency: c.currency ?? null,
      balance: c.balance ?? 0,
      balanceFormatted: formatMoney(c.balance ?? 0, currency),
      delinquent: Boolean(c.delinquent),
      dashboardUrl: `${DASH}/customers/${c.id}`,
    }
  })
}

export async function listAdminPayments(
  limit = 40
): Promise<AdminPaymentRow[]> {
  const stripe = getStripeAdmin()
  const list = await stripe.charges.list({ limit })

  return list.data.map((ch) => {
    const currency = ch.currency
    return {
      id: ch.id,
      amount: ch.amount,
      amountFormatted: formatMoney(ch.amount, currency),
      amountRefunded: ch.amount_refunded ?? 0,
      amountRefundedFormatted: formatMoney(ch.amount_refunded ?? 0, currency),
      currency,
      status: ch.status ?? null,
      paid: Boolean(ch.paid),
      refunded: Boolean(ch.refunded),
      disputed: Boolean(ch.disputed),
      failureMessage: ch.failure_message ?? null,
      customerEmail:
        typeof ch.billing_details?.email === 'string'
          ? ch.billing_details.email
          : null,
      description: ch.description ?? null,
      created: ch.created,
      receiptUrl: ch.receipt_url ?? null,
      dashboardUrl: `${DASH}/payments/${ch.id}`,
    }
  })
}

export async function getAdminTaxInfo(): Promise<AdminTaxInfo> {
  const stripe = getStripeAdmin()
  const links = {
    settings: `${DASH}/settings/tax`,
    registrations: `${DASH}/tax/registrations`,
  }

  try {
    const [settings, registrations] = await Promise.all([
      stripe.tax.settings.retrieve(),
      stripe.tax.registrations.list({ limit: 50 }),
    ])

    const headOfficeCountry = settings.head_office?.address?.country ?? null
    const status: AdminTaxInfo['status'] = headOfficeCountry
      ? 'ready'
      : 'incomplete'

    return {
      headOfficeCountry,
      status,
      detail: headOfficeCountry
        ? `Head office: ${headOfficeCountry}`
        : 'Head office not set — configure Stripe Tax.',
      registrations: registrations.data.map((r) => {
        let state: string | null = null
        const opts = r.country_options as Record<string, unknown> | null
        if (opts) {
          for (const value of Object.values(opts)) {
            if (
              value &&
              typeof value === 'object' &&
              'state' in value &&
              typeof (value as { state?: unknown }).state === 'string'
            ) {
              state = (value as { state: string }).state
              break
            }
          }
        }
        return {
          id: r.id,
          country: r.country,
          state,
          status: r.status ?? null,
          activeFrom: r.active_from ?? null,
          dashboardUrl: `${DASH}/tax/registrations/${r.id}`,
        }
      }),
      links,
    }
  } catch {
    return {
      headOfficeCountry: null,
      status: 'unavailable',
      detail: 'Could not load Stripe Tax with this key.',
      registrations: [],
      links,
    }
  }
}
