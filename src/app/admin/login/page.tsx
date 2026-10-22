import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { isAdminAuthConfigured } from '@/lib/admin-auth'
import Link from 'next/link'

export default function AdminLoginPage() {
  const configured = isAdminAuthConfigured()
  const passwordRequired = Boolean(process.env.ADMIN_PASSWORD?.trim())

  if (!configured) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Admin login</h1>
        <p className="text-sm text-white/60">
          Auth is not set up yet. Run{' '}
          <code className="text-white/80">npm run admin:auth-setup</code>, then
          open setup.
        </p>
        <Link
          href="/admin/setup"
          className="inline-flex rounded-xl bg-[#e31e24] px-4 py-3 text-sm font-semibold text-white"
        >
          Go to setup
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
          Secure
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Admin login
        </h1>
        <p className="mx-auto max-w-sm text-sm text-white/60">
          Enter the code from Google Authenticator
          {passwordRequired ? ' and your admin password' : ''}.
        </p>
      </div>
      <AdminLoginForm passwordRequired={passwordRequired} />
    </>
  )
}
