#!/usr/bin/env node
/**
 * Generates ADMIN_TOTP_SECRET, ADMIN_SESSION_SECRET, and ADMIN_SETUP_TOKEN
 * and appends them to .env if missing.
 *
 * Usage: npm run admin:auth-setup
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as OTPAuth from 'otpauth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const envPath = path.join(root, '.env')

function hasKey(envText, key) {
  return new RegExp(`^${key}=`, 'm').test(envText)
}

const existing = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, 'utf8')
  : ''

const lines = []
let totpSecret = null

if (!hasKey(existing, 'ADMIN_TOTP_SECRET')) {
  totpSecret = new OTPAuth.Secret({ size: 20 }).base32
  lines.push(`ADMIN_TOTP_SECRET=${totpSecret}`)
} else {
  const m = existing.match(/^ADMIN_TOTP_SECRET=(.*)$/m)
  totpSecret = m?.[1]?.trim() || null
  console.log('ADMIN_TOTP_SECRET already set — leaving it.')
}

if (!hasKey(existing, 'ADMIN_SESSION_SECRET')) {
  lines.push(`ADMIN_SESSION_SECRET=${crypto.randomBytes(32).toString('hex')}`)
} else {
  console.log('ADMIN_SESSION_SECRET already set — leaving it.')
}

if (!hasKey(existing, 'ADMIN_SETUP_TOKEN')) {
  lines.push(`ADMIN_SETUP_TOKEN=${crypto.randomBytes(16).toString('hex')}`)
} else {
  console.log('ADMIN_SETUP_TOKEN already set — leaving it.')
}

if (!hasKey(existing, 'ADMIN_PASSWORD')) {
  lines.push(
    `# Optional extra gate (uncomment and set): ADMIN_PASSWORD=your-strong-password`
  )
}

if (lines.length) {
  const block = `\n# Admin TOTP auth (generated ${new Date().toISOString()})\n${lines.join('\n')}\n`
  fs.appendFileSync(envPath, block)
  console.log(`Updated ${envPath}`)
} else {
  console.log('No new keys needed.')
}

if (totpSecret) {
  const totp = new OTPAuth.TOTP({
    issuer: 'Kanson Wouj Digital',
    label: 'Admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(totpSecret),
  })
  console.log('\nNext:')
  console.log('1. Restart npm run dev')
  console.log('2. Open /admin/setup and enter ADMIN_SETUP_TOKEN from .env')
  console.log('3. Scan the QR with Google Authenticator')
  console.log('4. Remove ADMIN_SETUP_TOKEN from .env')
  console.log('5. Sign in at /admin/login with the 6-digit code')
  console.log('\nManual otpauth URI (if needed):')
  console.log(totp.toString())
}
