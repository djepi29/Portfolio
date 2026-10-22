import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { getAdminTaxInfo } from '@/lib/admin-lists'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tax = await getAdminTaxInfo()
    return NextResponse.json({ tax })
  } catch (err) {
    console.error('[admin/tax]', err)
    return NextResponse.json(
      { error: 'Could not load tax info.' },
      { status: 500 }
    )
  }
}
