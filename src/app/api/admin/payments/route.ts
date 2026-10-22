import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { listAdminPayments } from '@/lib/admin-lists'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payments = await listAdminPayments()
    return NextResponse.json({ payments })
  } catch (err) {
    console.error('[admin/payments]', err)
    return NextResponse.json(
      { error: 'Could not load payments.' },
      { status: 500 }
    )
  }
}
