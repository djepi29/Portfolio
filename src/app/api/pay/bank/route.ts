import { NextResponse } from 'next/server'
import {
  findInvoiceByNumber,
  normalizeInvoiceCode,
  toSafeInvoice,
} from '@/lib/stripe'
import { getInvoiceBankDetails } from '@/lib/invoice-brand'

export const runtime = 'nodejs'

/**
 * Returns direct-deposit details only after the client proves they know a
 * valid invoice code. Keeps account numbers off the public page by default.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string }
    const code = normalizeInvoiceCode(body.code ?? '')

    if (!code || code.length < 3) {
      return NextResponse.json(
        { error: 'Enter a valid invoice code first.' },
        { status: 400 }
      )
    }

    const bank = getInvoiceBankDetails()
    if (!bank) {
      return NextResponse.json(
        { error: 'Bank transfer details are not configured.' },
        { status: 404 }
      )
    }

    const invoice = await findInvoiceByNumber(code)
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
    }

    const safe = toSafeInvoice(invoice)
    if (safe.status === 'draft' || safe.status === 'void') {
      return NextResponse.json(
        { error: 'Bank details are not available for this invoice.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ bank })
  } catch (err) {
    console.error('[pay/bank]', err)
    return NextResponse.json(
      { error: 'Could not load bank details.' },
      { status: 500 }
    )
  }
}
