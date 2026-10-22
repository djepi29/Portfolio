import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const session = await getAdminSession()
    session.destroy()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/logout]', err)
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 })
  }
}
