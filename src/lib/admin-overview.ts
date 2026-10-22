import { getStripeAdmin } from '@/lib/stripe'
import { formatMoney } from '@/lib/stripe-format'

export type AttentionItem = {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  href: string
}

export type AdminOverview = {
  fetchedAt: string
  currency: string
  balance: {
    available: number
    pending: number
    availableFormatted: string
    pendingFormatted: string
  }
  invoices: {
    openCount: number
    openAmountDue: number
    openAmountFormatted: string
    overdueCount: number
    overdueAmountDue: number
    overdueAmountFormatted: string
  }
  payments: {
    recentSucceeded: number
    recentFailed: number
    recentRefunded: number
    windowDays: number
  }
  disputes: {
    openCount: number
    needsResponseCount: number
  }
  account: {
    chargesEnabled: boolean | null
    payoutsEnabled: boolean | null
    detailsSubmitted: boolean | null
    currentlyDue: string[]
    pastDue: string[]
    disabledReason: string | null
    defaultCurrency: string | null
    businessName: string | null
  }
  tax: {
    status: string | null
    detail: string | null
  }
  attention: AttentionItem[]
  links: {
    balance: string
    openInvoices: string
    payments: string
    disputes: string
    account: string
    tax: string
  }
}

const DASH = 'https://dashboard.stripe.com'

function daysAgoUnix(days: number): number {
  return Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000)
}

export async function buildAdminOverview(): Promise<AdminOverview> {
  const stripe = getStripeAdmin()
  const since = daysAgoUnix(30)
  const nowSec = Math.floor(Date.now() / 1000)

  const [
    balanceRes,
    openInvoicesRes,
    chargesRes,
    disputesRes,
    accountRes,
    taxRes,
  ] = await Promise.all([
    stripe.balance.retrieve(),
    stripe.invoices.list({ status: 'open', limit: 100 }),
    stripe.charges.list({ limit: 100, created: { gte: since } }),
    stripe.disputes.list({ limit: 50 }),
    stripe.accounts.retrieveCurrent().catch(() => null),
    stripe.tax.settings.retrieve().catch(() => null),
  ])

  const currency =
    balanceRes.available[0]?.currency ||
    balanceRes.pending[0]?.currency ||
    accountRes?.default_currency ||
    'cad'

  const sumByCurrency = (
    rows: Array<{ amount: number; currency: string }>,
    cur: string
  ) =>
    rows
      .filter((r) => r.currency === cur)
      .reduce((sum, r) => sum + r.amount, 0)

  const available = sumByCurrency(balanceRes.available, currency)
  const pending = sumByCurrency(balanceRes.pending, currency)

  let openAmountDue = 0
  let overdueCount = 0
  let overdueAmountDue = 0
  for (const inv of openInvoicesRes.data) {
    openAmountDue += inv.amount_due
    if (inv.due_date && inv.due_date < nowSec && inv.amount_due > 0) {
      overdueCount += 1
      overdueAmountDue += inv.amount_due
    }
  }

  let recentSucceeded = 0
  let recentFailed = 0
  let recentRefunded = 0
  for (const ch of chargesRes.data) {
    if (ch.status === 'succeeded' && !ch.refunded) recentSucceeded += 1
    if (ch.status === 'failed') recentFailed += 1
    if (ch.refunded || (ch.amount_refunded ?? 0) > 0) recentRefunded += 1
  }

  const openDisputes = disputesRes.data.filter(
    (d) => d.status === 'needs_response' || d.status === 'warning_needs_response'
  )
  const activeDisputes = disputesRes.data.filter(
    (d) =>
      d.status !== 'won' &&
      d.status !== 'lost' &&
      d.status !== 'warning_closed' &&
      d.status !== 'charge_refunded'
  )

  const currentlyDue = accountRes?.requirements?.currently_due ?? []
  const pastDue = accountRes?.requirements?.past_due ?? []

  const attention: AttentionItem[] = []

  if (pastDue.length > 0) {
    attention.push({
      id: 'account-past-due',
      severity: 'critical',
      title: 'Account requirements past due',
      detail: pastDue.slice(0, 4).join(', ') + (pastDue.length > 4 ? '…' : ''),
      href: `${DASH}/settings/update`,
    })
  } else if (currentlyDue.length > 0) {
    attention.push({
      id: 'account-currently-due',
      severity: 'warning',
      title: 'Account needs information',
      detail: currentlyDue.slice(0, 4).join(', ') + (currentlyDue.length > 4 ? '…' : ''),
      href: `${DASH}/settings/update`,
    })
  }

  if (accountRes && !accountRes.charges_enabled) {
    attention.push({
      id: 'charges-disabled',
      severity: 'critical',
      title: 'Charges are disabled',
      detail: 'Clients cannot pay until Stripe enables charges on this account.',
      href: `${DASH}/settings/account`,
    })
  }

  if (openDisputes.length > 0) {
    attention.push({
      id: 'disputes-response',
      severity: 'critical',
      title: `${openDisputes.length} dispute(s) need a response`,
      detail: 'Respond in the Stripe Dashboard before the deadline.',
      href: `${DASH}/disputes`,
    })
  } else if (activeDisputes.length > 0) {
    attention.push({
      id: 'disputes-open',
      severity: 'warning',
      title: `${activeDisputes.length} open dispute(s)`,
      detail: 'Monitor status in the Dashboard.',
      href: `${DASH}/disputes`,
    })
  }

  if (overdueCount > 0) {
    attention.push({
      id: 'invoices-overdue',
      severity: 'warning',
      title: `${overdueCount} overdue invoice(s)`,
      detail: `${formatMoney(overdueAmountDue, currency)} past due.`,
      href: `${DASH}/invoices?status=open`,
    })
  } else if (openInvoicesRes.data.length > 0) {
    attention.push({
      id: 'invoices-open',
      severity: 'info',
      title: `${openInvoicesRes.data.length} open invoice(s)`,
      detail: `${formatMoney(openAmountDue, currency)} outstanding.`,
      href: `${DASH}/invoices?status=open`,
    })
  }

  if (recentFailed > 0) {
    attention.push({
      id: 'payments-failed',
      severity: 'warning',
      title: `${recentFailed} failed payment(s) in 30 days`,
      detail: 'Check declined cards or incomplete checkouts.',
      href: `${DASH}/payments?status[0]=failed`,
    })
  }

  if (!taxRes) {
    attention.push({
      id: 'tax-unknown',
      severity: 'info',
      title: 'Tax settings unavailable',
      detail: 'Could not load Stripe Tax settings with this key.',
      href: `${DASH}/settings/tax`,
    })
  } else {
    const headOffice = (taxRes as { head_office?: { country?: string } | null })
      .head_office
    if (!headOffice?.country) {
      attention.push({
        id: 'tax-setup',
        severity: 'info',
        title: 'Stripe Tax may need setup',
        detail: 'No head-office country found on Tax settings.',
        href: `${DASH}/settings/tax`,
      })
    }
  }

  const severityRank = { critical: 0, warning: 1, info: 2 }
  attention.sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity]
  )

  return {
    fetchedAt: new Date().toISOString(),
    currency,
    balance: {
      available,
      pending,
      availableFormatted: formatMoney(available, currency),
      pendingFormatted: formatMoney(pending, currency),
    },
    invoices: {
      openCount: openInvoicesRes.data.length,
      openAmountDue,
      openAmountFormatted: formatMoney(openAmountDue, currency),
      overdueCount,
      overdueAmountDue,
      overdueAmountFormatted: formatMoney(overdueAmountDue, currency),
    },
    payments: {
      recentSucceeded,
      recentFailed,
      recentRefunded,
      windowDays: 30,
    },
    disputes: {
      openCount: activeDisputes.length,
      needsResponseCount: openDisputes.length,
    },
    account: {
      chargesEnabled: accountRes?.charges_enabled ?? null,
      payoutsEnabled: accountRes?.payouts_enabled ?? null,
      detailsSubmitted: accountRes?.details_submitted ?? null,
      currentlyDue,
      pastDue,
      disabledReason: accountRes?.requirements?.disabled_reason ?? null,
      defaultCurrency: accountRes?.default_currency ?? null,
      businessName:
        accountRes?.business_profile?.name ??
        accountRes?.settings?.dashboard?.display_name ??
        null,
    },
    tax: {
      status: taxRes
        ? (taxRes as { head_office?: { country?: string } | null }).head_office
            ?.country
          ? 'ready'
          : 'incomplete'
        : null,
      detail: taxRes
        ? 'Stripe Tax settings reachable'
        : 'Unable to read tax settings',
    },
    attention,
    links: {
      balance: `${DASH}/balance/overview`,
      openInvoices: `${DASH}/invoices?status=open`,
      payments: `${DASH}/payments`,
      disputes: `${DASH}/disputes`,
      account: `${DASH}/settings/account`,
      tax: `${DASH}/settings/tax`,
    },
  }
}
