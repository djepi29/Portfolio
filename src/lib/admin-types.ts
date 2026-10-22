/** Client-safe shared admin types (no Stripe Node SDK). */

export type CreatedCustomer = {
  id: string
  name: string | null
  email: string | null
  dashboardUrl: string
}

export type CreatedInvoice = {
  id: string
  number: string | null
  status: string | null
  currency: string
  amountDue: number
  amountDueFormatted: string
  hostedInvoiceUrl: string | null
  dashboardUrl: string
  payCodeHint: string | null
}

export type AdminActivityItem = {
  id: string
  type: string
  created: number
  summary: string
  dashboardUrl: string | null
}

export type AdminProductRow = {
  id: string
  name: string
  active: boolean
  description: string | null
  defaultPriceId: string | null
  defaultPriceFormatted: string | null
  dashboardUrl: string
}

export type AdminPaymentLinkRow = {
  id: string
  url: string | null
  active: boolean
  dashboardUrl: string
}
