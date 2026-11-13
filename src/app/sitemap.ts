import type { MetadataRoute } from 'next'
import { SITE_URL, WORK_PROJECTS, postHref } from '@/content/writing'

function publishedDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`)
}

function latestPublished(dates: string[]) {
  if (dates.length === 0) return undefined
  return publishedDate(dates.reduce((latest, date) => (date > latest ? date : latest)))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const weekly = 'weekly' as const
  const monthly = 'monthly' as const
  const contentUpdated = latestPublished(
    WORK_PROJECTS.flatMap((project) => project.posts.map((post) => post.published)),
  )

  return [
    {
      url: SITE_URL,
      changeFrequency: weekly,
      priority: 1,
    },
    {
      url: `${SITE_URL}/book`,
      changeFrequency: weekly,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/portfolio`,
      ...(contentUpdated ? { lastModified: contentUpdated } : {}),
      changeFrequency: monthly,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      ...(contentUpdated ? { lastModified: contentUpdated } : {}),
      changeFrequency: weekly,
      priority: 0.8,
    },
    ...WORK_PROJECTS.flatMap((project) => {
      const projectUpdated = latestPublished(project.posts.map((post) => post.published))
      return [
        {
          url: `${SITE_URL}${project.caseStudy.href}`,
          ...(projectUpdated ? { lastModified: projectUpdated } : {}),
          changeFrequency: monthly,
          priority: 0.8,
        },
        ...project.posts.map((post) => ({
          url: `${SITE_URL}${postHref(project.slug, post.slug)}`,
          lastModified: publishedDate(post.published),
          changeFrequency: monthly,
          priority: 0.7,
        })),
      ]
    }),
  ]
}
