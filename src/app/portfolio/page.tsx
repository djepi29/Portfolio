import type { Metadata } from 'next'
import Link from 'next/link'
import NbcsProjectStage from '@/components/hero/NbcsProjectStage'
import { findProject } from '@/content/writing'

export const metadata: Metadata = {
  title: 'Portfolio | Kanson Wouj Digital',
  description:
    'Selected work. National Black Canadians Summit — a bilingual Summit site, carried through to registration.',
}

const pill =
  'inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20'

export default function PortfolioPage() {
  const summit = findProject('national-black-canadians-summit')

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#07080c] text-white">
      <div className="fixed inset-0">
        <div className="relative h-[100svh] w-full">
          <NbcsProjectStage imageSrc="/case-studies/nbcs/emblem.jpg" showControls={false} />
        </div>
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex flex-wrap gap-2">
        <Link href="/" className={pill}>
          Home
        </Link>
        {summit ? (
          <Link href={summit.caseStudy.href} className={pill}>
            Case study
          </Link>
        ) : null}
      </div>
    </section>
  )
}
