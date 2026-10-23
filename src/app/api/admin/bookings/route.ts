import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { listAdminBookings } from '@/lib/admin-bookings'
import { isCalConfigured, type CalBookingStatus } from '@/lib/cal'

export const runtime = 'nodejs'

const STATUSES: CalBookingStatus[] = [
  'upcoming',
  'past',
  'cancelled',
  'unconfirmed',
  'recurring',
]

export async function GET(req: NextRequest) {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isCalConfigured()) {
    return NextResponse.json(
      { error: 'CAL_API_KEY is not set.', bookings: [] },
      { status: 503 }
    )
  }

  const raw = req.nextUrl.searchParams.get('status') ?? 'upcoming'
  const status = (STATUSES.includes(raw as CalBookingStatus)
    ? raw
    : 'upcoming') as CalBookingStatus

  try {
    const bookings = await listAdminBookings(status)
    return NextResponse.json({ bookings, status })
  } catch (err) {
    console.error('[admin/bookings]', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Could not load Cal.com bookings.',
      },
      { status: 500 }
    )
  }
}
