import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import {
  getAdminSession,
  isAdminAuthConfigured,
} from '@/lib/admin-auth'
import AdminShell from '@/components/admin/AdminShell'

export const metadata: Metadata = {
  title: 'Admin | Kanson Wouj Digital',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = headers()
  const pathname = headerList.get('x-admin-pathname') || ''

  const isPublic =
    pathname.startsWith('/admin/login') || pathname.startsWith('/admin/setup')

  if (!isPublic) {
    if (!isAdminAuthConfigured()) {
      redirect('/admin/setup')
    }
    try {
      const session = await getAdminSession()
      if (!session.authenticated) {
        redirect('/admin/login')
      }
    } catch {
      redirect('/admin/login')
    }
  }

  return (
    <section className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#07080c] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-32 right-[10%] h-[60vh] w-[50vw] max-w-[640px] rounded-full opacity-70 blur-[100px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,214,170,0.16) 0%, rgba(227,30,36,0.08) 45%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.72) 100%)',
          }}
        />
      </div>

      {isPublic ? (
        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
          {children}
        </div>
      ) : (
        <AdminShell>{children}</AdminShell>
      )}
    </section>
  )
}
