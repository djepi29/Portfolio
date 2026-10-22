import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import {
  createAdminPaymentLink,
  listAdminPaymentLinks,
} from '@/lib/admin-catalog'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const paymentLinks = await listAdminPaymentLinks()
    return NextResponse.json({ paymentLinks })
  } catch (err) {
    console.error('[admin/payment-links GET]', err)
    return NextResponse.json(
      { error: 'Could not load payment links.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      priceId?: string
      quantity?: number
    }
    if (!body.priceId) {
      return NextResponse.json({ error: 'priceId is required.' }, { status: 400 })
    }
    const paymentLink = await createAdminPaymentLink({
      priceId: body.priceId,
      quantity: body.quantity,
    })
    return NextResponse.json({ paymentLink })
  } catch (err) {
    console.error('[admin/payment-links POST]', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Could not create payment link.',
      },
      { status: 400 }
    )
  }
}
