import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import {
  finalizeAdminInvoice,
  sendAdminInvoice,
  voidAdminInvoice,
} from '@/lib/admin-actions'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      invoiceId?: string
      action?: 'finalize' | 'send' | 'void'
    }
    const invoiceId = body.invoiceId?.trim()
    const action = body.action
    if (!invoiceId || !action) {
      return NextResponse.json(
        { error: 'invoiceId and action are required.' },
        { status: 400 }
      )
    }

    const invoice =
      action === 'finalize'
        ? await finalizeAdminInvoice(invoiceId)
        : action === 'send'
          ? await sendAdminInvoice(invoiceId)
          : action === 'void'
            ? await voidAdminInvoice(invoiceId)
            : null

    if (!invoice) {
      return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }

    return NextResponse.json({ invoice })
  } catch (err) {
    console.error('[admin/invoices/action]', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Invoice action failed.',
      },
      { status: 400 }
    )
  }
}
