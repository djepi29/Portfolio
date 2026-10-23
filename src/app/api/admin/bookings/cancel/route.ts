import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { cancelCalBooking, isCalConfigured } from '@/lib/cal'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isCalConfigured()) {
    return NextResponse.json(
      { error: 'CAL_API_KEY is not set.' },
      { status: 503 }
    )
  }

  let body: { uid?: string; reason?: string }
  try {
    body = (await req.json()) as { uid?: string; reason?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const uid = body.uid?.trim()
  if (!uid) {
    return NextResponse.json({ error: 'uid is required.' }, { status: 400 })
  }

  try {
    await cancelCalBooking(uid, body.reason)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/bookings/cancel]', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Could not cancel booking.',
      },
      { status: 500 }
    )
  }
}
