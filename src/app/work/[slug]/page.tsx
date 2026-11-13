import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NbcsCaseStudy from '@/components/hero/NbcsCaseStudy'
import WritingNav from '@/components/writing/WritingNav'
import { SITE_URL, findProject } from '@/content/writing'

type Props = {
  params: { slug: string }
}

const STUDIES = {
  'national-black-canadians-summit': NbcsCaseStudy,
} as const

export function generateStaticParams() {
  return Object.keys(STUDIES).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const project = findProject(params.slug)
  if (!project || !(params.slug in STUDIES)) {
    return { title: 'Work | Kanson Wouj Digital' }
  }
  const url = `${SITE_URL}${project.caseStudy.href}`
  return {
    title: `${project.caseStudy.title.replace(/\.$/, '')} | Kanson Wouj Digital`,
    description: project.caseStudy.description,
    alternates: { canonical: url },
    openGraph: {
      title: project.caseStudy.title,
      description: project.caseStudy.description,
      type: 'article',
      url,
      locale: 'en_CA',
    },
  }
}

export default function WorkPage({ params }: Props) {
  const project = findProject(params.slug)
  const Study = STUDIES[params.slug as keyof typeof STUDIES]
  if (!project || !Study) notFound()

  return (
    <section className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#07080c]">
      <div className="mx-auto w-full max-w-5xl px-3 py-6 sm:px-5 sm:py-8">
        <WritingNav />
        <div className="mt-6">
          <Study presentation="page" />
        </div>
      </div>
    </section>
  )
}
