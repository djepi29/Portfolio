import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { listAdminActivity } from '@/lib/admin-activity'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const activity = await listAdminActivity()
    return NextResponse.json({ activity })
  } catch (err) {
    console.error('[admin/activity]', err)
    return NextResponse.json(
      { error: 'Could not load activity.' },
      { status: 500 }
    )
  }
}
