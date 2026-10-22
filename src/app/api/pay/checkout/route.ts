import { NextResponse } from 'next/server'
import {
  findInvoiceByNumber,
  normalizeInvoiceCode,
  toSafeInvoice,
} from '@/lib/stripe'

export const runtime = 'nodejs'

/**
 * Re-validates the invoice code server-side, then returns Stripe's hosted
 * invoice URL (supports Invoicing + Tax). Never trusts a client-supplied URL.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string }
    const code = normalizeInvoiceCode(body.code ?? '')

    if (!code) {
      return NextResponse.json({ error: 'Invoice code required.' }, { status: 400 })
    }

    const invoice = await findInvoiceByNumber(code)
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
    }

    const safe = toSafeInvoice(invoice)

    if (safe.status === 'paid' || safe.amountDue <= 0) {
      return NextResponse.json(
        { error: 'This invoice is already paid.', alreadyPaid: true },
        { status: 400 }
      )
    }

    if (safe.status !== 'open') {
      return NextResponse.json(
        { error: 'This invoice is not open for payment.' },
        { status: 400 }
      )
    }

    if (!safe.hostedInvoiceUrl) {
      return NextResponse.json(
        { error: 'No Stripe payment link on this invoice.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      url: safe.hostedInvoiceUrl,
      invoiceId: safe.id,
      number: safe.number,
    })
  } catch (err) {
    console.error('[pay/checkout]', err)
    return NextResponse.json(
      { error: 'Could not start checkout. Please try again.' },
      { status: 500 }
    )
  }
}
