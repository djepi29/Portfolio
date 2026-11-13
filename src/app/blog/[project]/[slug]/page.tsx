import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BilingualWebsitesPost from '@/components/writing/BilingualWebsitesPost'
import FluidTypePost from '@/components/writing/FluidTypePost'
import InheritedWebsitePost from '@/components/writing/InheritedWebsitePost'
import LocaleWidgetPost from '@/components/writing/LocaleWidgetPost'
import RegistrationInsidePost from '@/components/writing/RegistrationInsidePost'
import TextExpansionPost from '@/components/writing/TextExpansionPost'
import WritingNav from '@/components/writing/WritingNav'
import { SITE_URL, WORK_PROJECTS, findPost, postHref } from '@/content/writing'

type Props = {
  params: { project: string; slug: string }
}

const BODIES = {
  'bilingual-websites-for-canadian-organizations': BilingualWebsitesPost,
  'rebuilding-an-inherited-website': InheritedWebsitePost,
  'keeping-registration-inside-the-event-site': RegistrationInsidePost,
  'fluid-type-is-not-a-responsive-layout': FluidTypePost,
  'text-expansion-in-bilingual-interfaces': TextExpansionPost,
  'passing-a-locale-into-an-embedded-widget': LocaleWidgetPost,
} as const

export function generateStaticParams() {
  return WORK_PROJECTS.flatMap((project) =>
    project.posts
      .filter((post) => post.slug in BODIES)
      .map((post) => ({ project: project.slug, slug: post.slug })),
  )
}

export function generateMetadata({ params }: Props): Metadata {
  const found = findPost(params.project, params.slug)
  if (!found) return { title: 'Blog | Kanson Wouj Digital' }
  const url = `${SITE_URL}${postHref(found.project.slug, found.post.slug)}`
  return {
    title: `${found.post.title} | Kanson Wouj Digital`,
    description: found.post.description,
    authors: [{ name: 'Jean Pierre Georges' }],
    alternates: { canonical: url },
    openGraph: {
      title: found.post.title,
      description: found.post.description,
      type: 'article',
      url,
      publishedTime: found.post.published,
      locale: 'en_CA',
    },
  }
}

export default function BlogPostPage({ params }: Props) {
  const found = findPost(params.project, params.slug)
  const Body = BODIES[params.slug as keyof typeof BODIES]
  if (!found || !Body || found.project.slug !== params.project) notFound()

  const url = `${SITE_URL}${postHref(found.project.slug, found.post.slug)}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: found.post.title,
    description: found.post.description,
    datePublished: found.post.published,
    inLanguage: 'en-CA',
    mainEntityOfPage: url,
    author: {
      '@type': 'Person',
      name: 'Jean Pierre Georges',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kanson Wouj Digital',
      url: SITE_URL,
    },
  }

  return (
    <section className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#07080c] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <WritingNav />
        <div className="mt-8 rounded-2xl bg-[#f3efe8] px-5 py-10 sm:px-10 sm:py-14">
          <Body />
        </div>
      </div>
    </section>
  )
}
