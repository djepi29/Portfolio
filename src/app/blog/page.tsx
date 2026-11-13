import type { Metadata } from 'next'
import Link from 'next/link'
import WritingNav from '@/components/writing/WritingNav'
import {
  SITE_URL,
  WORK_PROJECTS,
  formatPublished,
  postHref,
} from '@/content/writing'

export const metadata: Metadata = {
  title: 'Blog | Kanson Wouj Digital',
  description:
    'Writing on the work, filed by project. Bilingual event sites, registration, and the pages around them.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Blog | Kanson Wouj Digital',
    description:
      'Writing on the work, filed by project. Bilingual event sites, registration, and the pages around them.',
    type: 'website',
    url: `${SITE_URL}/blog`,
    locale: 'en_CA',
  },
}

export default function BlogPage() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-x-hidden bg-[#07080c] text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <WritingNav current="blog" />
        <h1 className="sr-only">Blog</h1>

        <div className="mt-14 space-y-16">
          {WORK_PROJECTS.map((project) => (
            <section
              key={project.slug}
              aria-labelledby={`project-${project.slug}`}
            >
              <h2
                id={`project-${project.slug}`}
                className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {project.title}
              </h2>

              <Link
                href={project.caseStudy.href}
                className="mt-8 block max-w-xl border-t border-white/15 pt-5"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
                  Case study
                </p>
                <p className="mt-2 text-xl font-medium tracking-tight text-white">
                  {project.caseStudy.title.replace(/\.$/, '')}
                </p>
              </Link>

              {project.posts.length > 0 ? (
                <div className="mt-8 max-w-xl border-t border-white/15 pt-5">
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
                    Notes
                  </h3>
                  <ul className="mt-4 space-y-5 border-l border-white/15 pl-4">
                    {project.posts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={postHref(project.slug, post.slug)}
                          className="group block"
                        >
                          <p className="text-[15px] font-medium leading-snug tracking-tight text-white/85 group-hover:text-white">
                            {post.title}
                          </p>
                          <p className="mt-1 text-sm text-white/40">
                            <time dateTime={post.published}>
                              {formatPublished(post.published)}
                            </time>
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-white/50 group-hover:text-white/65">
                            {post.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
