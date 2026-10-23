import { NextResponse } from 'next/server'
import {
  findInvoiceByNumber,
  normalizeInvoiceCode,
  toSafeInvoice,
} from '@/lib/stripe'
import { hasInvoiceBankDetails } from '@/lib/invoice-brand'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string }
    const code = normalizeInvoiceCode(body.code ?? '')

    if (!code || code.length < 3) {
      return NextResponse.json(
        { error: 'Enter the invoice code we sent you.' },
        { status: 400 }
      )
    }

    const invoice = await findInvoiceByNumber(code)

    if (!invoice) {
      return NextResponse.json(
        { error: 'No invoice found for that code. Check the email we sent and try again.' },
        { status: 404 }
      )
    }

    const safe = toSafeInvoice(invoice)
    // Never send the hosted URL until checkout re-validates the code.
    // invoicePdf is OK after code verify — used for optional Stripe PDF download.
    const publicInvoice = { ...safe, hostedInvoiceUrl: null as string | null }
    const bankAvailable = hasInvoiceBankDetails()

    if (safe.status === 'draft') {
      return NextResponse.json(
        { error: 'This invoice is not ready for payment yet. Contact us if you need help.' },
        { status: 400 }
      )
    }

    if (safe.status === 'void') {
      return NextResponse.json(
        { error: 'This invoice was voided and cannot be paid.' },
        { status: 400 }
      )
    }

    if (safe.status === 'paid' || safe.amountDue <= 0) {
      return NextResponse.json({
        invoice: publicInvoice,
        payable: false,
        bankAvailable,
        message: 'This invoice is already paid. Thank you.',
      })
    }

    if (safe.status === 'uncollectible') {
      return NextResponse.json(
        { error: 'This invoice can no longer be paid online. Please contact us.' },
        { status: 400 }
      )
    }

    if (!safe.hostedInvoiceUrl) {
      return NextResponse.json(
        {
          error:
            'This invoice has no payment link yet. Finalize it in Stripe or contact us.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      invoice: publicInvoice,
      payable: true,
      bankAvailable,
      message: null,
    })
  } catch (err) {
    console.error('[pay/verify]', err)
    const message =
      err instanceof Error &&
      (err.message.includes('STRIPE_SECRET_KEY_PAY_PAGE') ||
        err.message.includes('STRIPE_SECRET_KEY'))
        ? 'Payment is not configured yet.'
        : 'Could not verify that invoice. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
