import { NextResponse } from 'next/server'
import {
  getAdminSession,
  isAdminAuthConfigured,
  verifyAdminPassword,
  verifyTotpCode,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    if (!isAdminAuthConfigured()) {
      return NextResponse.json(
        {
          error:
            'Admin auth is not configured. Run setup and add ADMIN_TOTP_SECRET.',
        },
        { status: 503 }
      )
    }

    const body = (await request.json()) as {
      code?: string
      password?: string
    }
    const code = (body.code ?? '').trim()
    const password = body.password ?? ''

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password or authenticator code.' },
        { status: 401 }
      )
    }

    if (!verifyTotpCode(code)) {
      return NextResponse.json(
        { error: 'Invalid password or authenticator code.' },
        { status: 401 }
      )
    }

    const session = await getAdminSession()
    session.authenticated = true
    session.loggedInAt = Date.now()
    await session.save()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/login]', err)
    return NextResponse.json(
      { error: 'Login failed. Check server auth configuration.' },
      { status: 500 }
    )
  }
}
