/** Static issuer details for the /pay invoice document (not from Stripe). */

export const INVOICE_ISSUER = {
  name: 'Kanson Wouj Digital',
  binLabel: 'Business Identification Number',
  bin: process.env.INVOICE_BUSINESS_BIN?.trim() || '1001566213',
  location: 'Ottawa, Ontario, Canada',
  role: 'Independent Contractor',
} as const

export type InvoiceBankDetails = {
  transit: string
  institution: string
  account: string
}

export function getInvoiceBankDetails(): InvoiceBankDetails | null {
  const transit = process.env.INVOICE_BANK_TRANSIT?.trim()
  const institution = process.env.INVOICE_BANK_INSTITUTION?.trim()
  const account = process.env.INVOICE_BANK_ACCOUNT?.trim()
  if (!transit || !institution || !account) return null
  return { transit, institution, account }
}

export function hasInvoiceBankDetails(): boolean {
  return getInvoiceBankDetails() != null
}
