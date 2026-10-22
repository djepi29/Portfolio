import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { listAdminCustomers } from '@/lib/admin-lists'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const customers = await listAdminCustomers()
    return NextResponse.json({ customers })
  } catch (err) {
    console.error('[admin/customers]', err)
    return NextResponse.json(
      { error: 'Could not load customers.' },
      { status: 500 }
    )
  }
}
