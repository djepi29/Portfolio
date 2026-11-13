export const SITE_URL = 'https://www.kansonwouj.dev'

export type BlogPost = {
  slug: string
  title: string
  description: string
  /** ISO date, YYYY-MM-DD */
  published: string
}

export type WorkProject = {
  slug: string
  title: string
  summary: string
  caseStudy: {
    href: string
    title: string
    description: string
  }
  posts: BlogPost[]
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: 'national-black-canadians-summit',
    title: 'National Black Canadians Summit',
    summary: 'A bilingual Summit site, carried through to registration.',
    caseStudy: {
      href: '/work/national-black-canadians-summit',
      title: 'A bilingual Summit site, carried through to registration.',
      description:
        'Visitors needed to discover the event, follow the program, and register in the language they prefer. The pages were already there. The work was to make that journey feel like one Summit.',
    },
    posts: [
      {
        slug: 'bilingual-websites-for-canadian-organizations',
        title: 'Bilingual websites for Canadian organizations',
        description:
          'One set of routes for English and French, a shared layout, and what breaks when the two languages drift apart.',
        published: '2026-10-08',
      },
      {
        slug: 'rebuilding-an-inherited-website',
        title: 'Rebuilding an inherited website',
        description:
          'When the routes already exist, the work is the journey between them: a shared header, a language switch, and one path from the homepage to registration.',
        published: '2026-10-17',
      },
      {
        slug: 'keeping-registration-inside-the-event-site',
        title: 'Keeping registration inside the event site',
        description:
          'The ticket checkout can stay with the ticket platform while the header, travel details, and language switch stay on the organization’s own page.',
        published: '2026-10-22',
      },
      {
        slug: 'fluid-type-is-not-a-responsive-layout',
        title: 'Fluid type is not a responsive layout',
        description:
          'When the type already scales with the viewport, the gaps, alignment, and section width can still fail on a phone and on a very wide monitor.',
        published: '2026-11-02',
      },
      {
        slug: 'text-expansion-in-bilingual-interfaces',
        title: 'Text expansion in bilingual interfaces',
        description:
          'French labels run longer. Buttons, navigation items, and headings need a width and a line count that hold in both languages.',
        published: '2026-11-06',
      },
      {
        slug: 'passing-a-locale-into-an-embedded-widget',
        title: 'Passing a locale into an embedded ticket widget',
        description:
          'Why fr and fr-CA are different, and why the language has to be set before the third-party script loads.',
        published: '2026-11-13',
      },
    ],
  },
]

export function postHref(projectSlug: string, postSlug: string) {
  return `/blog/${projectSlug}/${postSlug}`
}

export function noteHref(projectSlug: string, postSlug: string) {
  const project = WORK_PROJECTS.find((item) => item.slug === projectSlug)
  const post = project?.posts.find((item) => item.slug === postSlug)
  if (!project || !post) return null
  return postHref(project.slug, post.slug)
}

export function findProject(slug: string) {
  return WORK_PROJECTS.find((item) => item.slug === slug) ?? null
}

export function findPost(projectSlug: string, postSlug: string) {
  const project = findProject(projectSlug)
  const post = project?.posts.find((item) => item.slug === postSlug)
  if (!project || !post) return null
  return { project, post }
}

export function formatPublished(isoDate: string) {
  return new Intl.DateTimeFormat('en-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}
