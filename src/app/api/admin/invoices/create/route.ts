import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { createDraftInvoice } from '@/lib/admin-actions'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      customerId?: string
      currency?: string
      daysUntilDue?: number
      description?: string
      lines?: Array<{
        description: string
        amountCents: number
        quantity?: number
        ref?: string
        hours?: number
        rateCents?: number
      }>
    }

    if (!body.customerId || !body.lines?.length) {
      return NextResponse.json(
        { error: 'customerId and lines are required.' },
        { status: 400 }
      )
    }

    const invoice = await createDraftInvoice({
      customerId: body.customerId,
      currency: body.currency,
      daysUntilDue: body.daysUntilDue,
      description: body.description,
      lines: body.lines,
    })
    return NextResponse.json({ invoice })
  } catch (err) {
    console.error('[admin/invoices/create]', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Could not create invoice.',
      },
      { status: 400 }
    )
  }
}
