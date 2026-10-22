import AdminSetupForm from '@/components/admin/AdminSetupForm'
import { isAdminAuthConfigured } from '@/lib/admin-auth'

export default function AdminSetupPage() {
  const configured = isAdminAuthConfigured()
  const setupEnabled = Boolean(process.env.ADMIN_SETUP_TOKEN?.trim())

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          One-time
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Authenticator setup
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
          {!configured
            ? 'Run npm run admin:auth-setup first to write secrets into .env, then restart the dev server.'
            : !setupEnabled
              ? 'Setup token is disabled. Add ADMIN_SETUP_TOKEN to .env temporarily to show the QR again.'
              : 'Enter the setup token from .env, scan the QR with Google Authenticator, then remove ADMIN_SETUP_TOKEN.'}
        </p>
      </div>
      {configured && setupEnabled ? <AdminSetupForm /> : null}
    </>
  )
}
