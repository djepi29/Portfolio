import { cookies } from 'next/headers'
import { getIronSession, type SessionOptions } from 'iron-session'
import * as OTPAuth from 'otpauth'

export type AdminSessionData = {
  authenticated?: boolean
  loggedInAt?: number
}

export const ADMIN_ISSUER = 'Kanson Wouj Digital'
export const ADMIN_LABEL = 'Admin'

export function getAdminSessionOptions(): SessionOptions {
  const password = process.env.ADMIN_SESSION_SECRET?.trim()
  if (!password || password.length < 32) {
    throw new Error(
      'ADMIN_SESSION_SECRET is missing or shorter than 32 characters'
    )
  }
  return {
    cookieName: 'kw_admin_session',
    password,
    ttl: 60 * 60 * 12, // 12 hours
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  }
}

export async function getAdminSession() {
  return getIronSession<AdminSessionData>(
    cookies(),
    getAdminSessionOptions()
  )
}

/** Returns the session if logged in; otherwise null. */
export async function requireAdminSession() {
  try {
    const session = await getAdminSession()
    if (!session.authenticated) return null
    return session
  } catch {
    return null
  }
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_TOTP_SECRET?.trim())
}

export function getTotp(secretBase32?: string) {
  const secret =
    secretBase32?.trim() || process.env.ADMIN_TOTP_SECRET?.trim()
  if (!secret) {
    throw new Error('ADMIN_TOTP_SECRET is not set')
  }
  return new OTPAuth.TOTP({
    issuer: ADMIN_ISSUER,
    label: ADMIN_LABEL,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  })
}

export function verifyTotpCode(code: string, secretBase32?: string): boolean {
  const cleaned = code.replace(/\s+/g, '')
  if (!/^\d{6}$/.test(cleaned)) return false
  const totp = getTotp(secretBase32)
  // Allow ±1 step for clock skew
  const delta = totp.validate({ token: cleaned, window: 1 })
  return delta !== null
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim()
  if (!expected) return true // password optional
  return password === expected
}

export function isSetupTokenValid(token: string): boolean {
  const expected = process.env.ADMIN_SETUP_TOKEN?.trim()
  if (!expected) return false
  return token === expected
}

export function getTotpUri(secretBase32?: string): string {
  return getTotp(secretBase32).toString()
}
