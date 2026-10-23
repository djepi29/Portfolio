import type { Metadata } from 'next'
import Link from 'next/link'
import { Fraunces } from 'next/font/google'
import PortfolioBirdStage from '@/components/hero/PortfolioBirdStage'

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
})

const LINKEDIN_URL = 'https://www.linkedin.com/in/jean-pierre-georges'

export const metadata: Metadata = {
  title: 'Portfolio | Kanson Wouj Digital',
  description:
    'A new portfolio experience is on the way. In the meantime, view selected work and experience on LinkedIn.',
}

export default function PortfolioPage() {
  return (
    <section
      className={`${fraunces.variable} relative isolate min-h-[100svh] overflow-x-hidden bg-[#07080c] text-white`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        {/* Warm amber */}
        <div
          className="animate-aurora-a absolute -top-48 left-[0%] h-[85vh] w-[70vw] max-w-[960px] rounded-full blur-[90px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,210,160,0.45) 0%, rgba(255,170,110,0.18) 38%, transparent 72%)',
          }}
        />
        {/* Cool blue */}
        <div
          className="animate-aurora-b absolute top-[2%] right-[-12%] h-[70vh] w-[58vw] rounded-full blur-[80px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(130,170,255,0.32) 0%, rgba(100,140,230,0.1) 45%, transparent 70%)',
            animationDelay: '-8s',
          }}
        />
        {/* Brand red */}
        <div
          className="animate-aurora-c absolute -bottom-[4%] left-[10%] h-[50vh] w-[52vw] rounded-full blur-[70px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(227,30,36,0.28) 0%, rgba(180,40,50,0.1) 40%, transparent 72%)',
            animationDelay: '-4s',
          }}
        />
        {/* Soft peach */}
        <div
          className="animate-aurora-b absolute top-[34%] left-[-16%] h-[56vh] w-[42vw] rounded-full blur-[90px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,190,150,0.22) 0%, transparent 70%)',
            animationDelay: '-14s',
            animationDuration: '22s',
          }}
        />
        {/* Teal */}
        <div
          className="animate-aurora-d absolute top-[55%] right-[5%] h-[48vh] w-[46vw] rounded-full blur-[85px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(80,210,200,0.28) 0%, rgba(40,160,150,0.1) 42%, transparent 72%)',
            animationDelay: '-6s',
          }}
        />
        {/* Magenta rose */}
        <div
          className="animate-aurora-e absolute top-[18%] left-[30%] h-[44vh] w-[40vw] rounded-full blur-[80px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(220,90,160,0.26) 0%, rgba(180,50,120,0.08) 45%, transparent 72%)',
            animationDelay: '-11s',
          }}
        />
        {/* Soft gold */}
        <div
          className="animate-aurora-d absolute bottom-[20%] right-[25%] h-[40vh] w-[38vw] rounded-full blur-[75px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(240,200,90,0.24) 0%, rgba(200,150,40,0.08) 40%, transparent 70%)',
            animationDelay: '-17s',
            animationDuration: '21s',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col items-center justify-center px-4 py-10 sm:px-6">
        <PortfolioBirdStage variant="mascot" />
        <div className="mt-2 max-w-md text-center">
          <h1
            className="text-[1.65rem] leading-tight tracking-tight text-white sm:text-3xl"
            style={{ fontFamily: 'var(--font-fraunces), ui-serif, Georgia, serif' }}
          >
            A new portfolio is on the way
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
            This page is being rebuilt into a clearer place to explore selected
            work. Until it launches, recent projects and experience are on
            LinkedIn.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[14rem] items-center justify-center rounded-xl bg-[#e31e24] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#c41920]"
            >
              View LinkedIn
            </a>
            <Link
              href="/"
              className="inline-flex min-w-[14rem] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-medium text-white/90 transition hover:border-white/35 hover:bg-white/10"
            >
              Return home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
