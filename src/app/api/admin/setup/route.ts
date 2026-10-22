import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import {
  getTotpUri,
  isAdminAuthConfigured,
  isSetupTokenValid,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'

/**
 * Returns a QR image for Google Authenticator.
 * Requires ADMIN_SETUP_TOKEN — disable by removing that env var after scanning.
 */
export async function POST(request: Request) {
  try {
    if (!isAdminAuthConfigured()) {
      return NextResponse.json(
        {
          error:
            'ADMIN_TOTP_SECRET is missing. Run: npm run admin:auth-setup',
        },
        { status: 503 }
      )
    }

    const body = (await request.json()) as { setupToken?: string }
    if (!isSetupTokenValid(body.setupToken ?? '')) {
      return NextResponse.json({ error: 'Invalid setup token.' }, { status: 401 })
    }

    const uri = getTotpUri()
    const qrDataUrl = await QRCode.toDataURL(uri, {
      margin: 2,
      width: 280,
      color: { dark: '#07080c', light: '#ffffff' },
    })

    return NextResponse.json({
      ok: true,
      qrDataUrl,
      // Secret is already in .env — do not re-expose it here.
      hint: 'Scan with Google Authenticator, then remove ADMIN_SETUP_TOKEN from .env.',
    })
  } catch (err) {
    console.error('[admin/setup]', err)
    return NextResponse.json({ error: 'Setup failed.' }, { status: 500 })
  }
}
