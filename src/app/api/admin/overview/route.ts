import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { buildAdminOverview } from '@/lib/admin-overview'

export const runtime = 'nodejs'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const overview = await buildAdminOverview()
    return NextResponse.json(overview)
  } catch (err) {
    console.error('[admin/overview]', err)
    const message =
      err instanceof Error && err.message.includes('STRIPE_SECRET_KEY_ADMIN')
        ? 'STRIPE_SECRET_KEY_ADMIN is not configured.'
        : 'Could not load Stripe overview.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
