import { Fraunces } from 'next/font/google'
import type { ReactNode } from 'react'
import { findPost, formatPublished, postHref } from '@/content/writing'

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
})

export const noteBody =
  'font-sans text-[15px] leading-relaxed text-[#3f3a34] sm:text-base'
export const noteLink =
  'underline decoration-[#7a1d3a]/40 underline-offset-4 hover:decoration-[#7a1d3a]'
export const noteHeading = 'text-2xl tracking-tight sm:text-3xl'

type Props = {
  projectSlug: string
  postSlug: string
  lede: ReactNode
  children: ReactNode
}

export default function NoteFrame({
  projectSlug,
  postSlug,
  lede,
  children,
}: Props) {
  const found = findPost(projectSlug, postSlug)
  if (!found) return null
  const { project, post } = found
  const others = project.posts.filter((item) => item.slug !== post.slug)

  return (
    <article className={`${fraunces.className} text-[#1c1916]`}>
      <header className="max-w-2xl">
        <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#8a8176]">
          <a href="/blog" className={noteLink}>
            Blog
          </a>
          <span aria-hidden> · </span>
          <a href={project.caseStudy.href} className={noteLink}>
            {project.title}
          </a>
        </p>
        <h1 className="mt-4 text-[2rem] leading-[1.12] tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 font-sans text-sm text-[#5e574f]">
          <time dateTime={post.published}>{formatPublished(post.published)}</time>
          <span aria-hidden> · </span>
          Jean Pierre Georges
        </p>
        <div className={`mt-6 ${noteBody}`}>{lede}</div>
      </header>

      <div className="mt-12 max-w-2xl space-y-12">{children}</div>

      <aside className="mt-14 max-w-2xl rounded-2xl border border-[#e4d8c4] bg-[#fffdf8] p-5 shadow-sm">
        <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#8a8176]">
          From the project
        </p>
        <p className="mt-3 text-xl leading-snug tracking-tight">
          <a href={project.caseStudy.href} className={noteLink}>
            {project.title}
          </a>
        </p>
        <p className={`mt-3 ${noteBody}`}>{project.caseStudy.title}</p>
      </aside>

      {others.length > 0 ? (
        <nav className="mt-10 max-w-2xl" aria-label="Other notes from this project">
          <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#8a8176]">
            Other notes from this project
          </p>
          <ul className="mt-3 space-y-2">
            {others.map((other) => (
              <li key={other.slug}>
                <a
                  href={postHref(project.slug, other.slug)}
                  className={`${noteLink} font-sans text-sm`}
                >
                  {other.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </article>
  )
}
