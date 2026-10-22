import type { Metadata } from 'next'
import PayGate from '@/components/pay/PayGate'

export const metadata: Metadata = {
  title: 'Pay | Kanson Wouj Digital',
  description: 'Secure invoice payment via Stripe.',
}

export default function PayPage() {
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
            Kanson Wouj Digital
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pay invoice
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-white/60">
            Enter the invoice code from your email to unlock secure checkout.
          </p>
        </div>

        <PayGate />
      </div>
    </section>
  )
}
