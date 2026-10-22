import type { Metadata } from 'next'
import Link from 'next/link'
import PortfolioBirdStage from '@/components/hero/PortfolioBirdStage'

const LINKEDIN_URL = 'https://www.linkedin.com/in/jean-pierre-georges'

export const metadata: Metadata = {
  title: 'Portfolio | Kanson Wouj Digital',
  description:
    'The Kanson Wouj Digital portfolio is being updated into a browsing experience. Visit LinkedIn in the meantime.',
}

export default function PortfolioPage() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#07080c] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-32 left-[8%] h-[70vh] w-[55vw] max-w-[720px] rounded-full opacity-80 blur-[100px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,214,170,0.22) 0%, rgba(255,180,120,0.06) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[10%] right-[-5%] h-[55vh] w-[40vw] rounded-full opacity-70 blur-[90px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(120,160,255,0.14) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute bottom-[5%] left-[20%] h-[30vh] w-[35vw] rounded-full opacity-50 blur-[80px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(227,30,36,0.12) 0%, transparent 70%)',
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col items-center justify-center px-4 py-10 sm:px-6">
        <PortfolioBirdStage variant="mascot" />
        <div className="mt-2 max-w-md text-center">
          <p className="text-sm leading-relaxed text-white/75 sm:text-base">
            This portfolio is being updated into a browsing experience.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            In the meantime, visit{' '}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
            >
              LinkedIn
            </a>
            .
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-w-[16rem] items-center justify-center rounded-xl bg-[#e31e24] px-10 py-4 text-lg font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-[#c41920]"
          >
            Back to card
          </Link>
        </div>
      </div>
    </section>
  )
}
