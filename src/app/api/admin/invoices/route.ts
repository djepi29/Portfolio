import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { listAdminInvoices } from '@/lib/admin-lists'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const invoices = await listAdminInvoices()
    return NextResponse.json({ invoices })
  } catch (err) {
    console.error('[admin/invoices]', err)
    return NextResponse.json(
      { error: 'Could not load invoices.' },
      { status: 500 }
    )
  }
}
