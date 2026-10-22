import { getStripeAdmin } from '@/lib/stripe'
import { formatMoney } from '@/lib/stripe-format'
import type {
  AdminPaymentLinkRow,
  AdminProductRow,
} from '@/lib/admin-types'

export type { AdminPaymentLinkRow, AdminProductRow } from '@/lib/admin-types'

const DASH = 'https://dashboard.stripe.com'

export async function listAdminProducts(
  limit = 40
): Promise<AdminProductRow[]> {
  const stripe = getStripeAdmin()
  const list = await stripe.products.list({
    limit,
    expand: ['data.default_price'],
  })

  return list.data.map((p) => {
    const price =
      p.default_price && typeof p.default_price === 'object'
        ? p.default_price
        : null
    const amount = price && 'unit_amount' in price ? price.unit_amount : null
    const currency = price && 'currency' in price ? price.currency : null

    return {
      id: p.id,
      name: p.name,
      active: p.active,
      description: p.description ?? null,
      defaultPriceId: typeof p.default_price === 'string' ? p.default_price : price?.id ?? null,
      defaultPriceFormatted:
        amount != null && currency
          ? formatMoney(amount, currency)
          : null,
      dashboardUrl: `${DASH}/products/${p.id}`,
    }
  })
}

export async function createAdminProduct(input: {
  name: string
  description?: string
  amountCents: number
  currency?: string
}): Promise<AdminProductRow> {
  const stripe = getStripeAdmin()
  const name = input.name.trim()
  if (!name) throw new Error('Product name is required.')
  if (!Number.isFinite(input.amountCents) || input.amountCents <= 0) {
    throw new Error('Price must be a positive amount in cents.')
  }
  const currency = (input.currency || 'cad').toLowerCase()

  const product = await stripe.products.create({
    name,
    description: input.description?.trim() || undefined,
    default_price_data: {
      unit_amount: Math.round(input.amountCents),
      currency,
    },
  })

  const rows = await listAdminProducts(10)
  const match = rows.find((r) => r.id === product.id)
  if (match) return match

  return {
    id: product.id,
    name: product.name,
    active: product.active,
    description: product.description ?? null,
    defaultPriceId:
      typeof product.default_price === 'string' ? product.default_price : null,
    defaultPriceFormatted: formatMoney(Math.round(input.amountCents), currency),
    dashboardUrl: `${DASH}/products/${product.id}`,
  }
}

export async function listAdminPaymentLinks(
  limit = 40
): Promise<AdminPaymentLinkRow[]> {
  const stripe = getStripeAdmin()
  const list = await stripe.paymentLinks.list({ limit })
  return list.data.map((link) => ({
    id: link.id,
    url: link.url ?? null,
    active: link.active,
    dashboardUrl: `${DASH}/payment-links/${link.id}`,
  }))
}

export async function createAdminPaymentLink(input: {
  priceId: string
  quantity?: number
}): Promise<AdminPaymentLinkRow> {
  const stripe = getStripeAdmin()
  const priceId = input.priceId.trim()
  if (!priceId) throw new Error('Price ID is required.')

  const link = await stripe.paymentLinks.create({
    line_items: [
      {
        price: priceId,
        quantity: input.quantity && input.quantity > 0 ? input.quantity : 1,
      },
    ],
  })

  return {
    id: link.id,
    url: link.url ?? null,
    active: link.active,
    dashboardUrl: `${DASH}/payment-links/${link.id}`,
  }
}
