import type { Metadata } from 'next'
import Link from 'next/link'
import CalBookEmbed from '@/components/book/CalBookEmbed'
import { getCalUsername, getPublicCalBookingUrl } from '@/lib/cal'

export const metadata: Metadata = {
  title: 'Book | Kanson Wouj Digital',
  description:
    'Book a 15, 30, or 45-minute session with Jean Pierre Georges.',
}

export default function BookPage() {
  const username = getCalUsername()
  const publicUrl = getPublicCalBookingUrl()

  return (
    <section className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#07080c] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-32 left-[8%] h-[70vh] w-[55vw] max-w-[720px] rounded-full opacity-80 blur-[100px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,214,170,0.18) 0%, rgba(227,30,36,0.08) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[15%] right-[-5%] h-[45vh] w-[40vw] rounded-full opacity-60 blur-[90px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(120,160,255,0.1) 0%, transparent 65%)',
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:py-16">
        <div className="space-y-2 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            Kanson Wouj Digital
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Book a session
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
            Book a 15, 30, or 45-minute session with Jean Pierre Georges.
          </p>
        </div>

        {!username || !publicUrl ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-6 text-center text-sm text-amber-50">
            Booking is not configured yet. Set{' '}
            <code className="text-amber-100">CAL_USERNAME</code> in{' '}
            <code className="text-amber-100">.env</code>, then restart the
            server.
          </div>
        ) : (
          <>
            <CalBookEmbed username={username} defaultMinutes={30} />
            <p className="text-center text-xs text-white/40">
              Having trouble with the calendar?{' '}
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 underline-offset-2 hover:text-white hover:underline"
              >
                Open on Cal.com
              </a>
            </p>
          </>
        )}

        <div className="flex justify-center pt-2">
          <Link
            href="/"
            className="text-sm text-white/50 underline-offset-4 hover:text-white hover:underline"
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  )
}
