import { Fraunces } from 'next/font/google'
import type { ReactNode } from 'react'
import { noteHref } from '@/content/writing'

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
})

const SITE = 'https://www.blackcanadiansummit.ca'

const PROJECT = 'national-black-canadians-summit'

const bilingualNote = noteHref(PROJECT, 'bilingual-websites-for-canadian-organizations')
const inheritedNote = noteHref(PROJECT, 'rebuilding-an-inherited-website')
const registrationNote = noteHref(PROJECT, 'keeping-registration-inside-the-event-site')
const fluidNote = noteHref(PROJECT, 'fluid-type-is-not-a-responsive-layout')
const expansionNote = noteHref(PROJECT, 'text-expansion-in-bilingual-interfaces')
const localeNote = noteHref(PROJECT, 'passing-a-locale-into-an-embedded-widget')

const noteLink =
  'underline decoration-[#7a1d3a]/40 underline-offset-4 hover:decoration-[#7a1d3a]'

function Linked({
  href,
  children,
}: {
  href: string | null
  children: ReactNode
}) {
  if (!href) return <>{children}</>
  return (
    <a href={href} className={noteLink}>
      {children}
    </a>
  )
}

type Props = {
  /** Card fills the portfolio overlay. Page is the indexable article. */
  presentation?: 'card' | 'page'
}

const CHAPTERS = [
  { id: 'built', label: 'What we built' },
  { id: 'needed', label: 'Why it was needed' },
  { id: 'screens', label: 'Screen sizes' },
  { id: 'registration', label: 'Registration' },
  { id: 'works', label: 'How it works' },
  { id: 'today', label: 'Where it stands' },
] as const

function Screen({
  src,
  alt,
  href,
  caption,
}: {
  src: string
  alt: string
  href: string
  caption: string
}) {
  const label = href.replace('https://', '')
  return (
    <figure className="min-w-0 max-w-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block min-w-0 max-w-full overflow-hidden rounded-xl border border-[#e4dcd0] bg-white shadow-[0_18px_50px_rgba(40,20,16,0.1)]"
      >
        <div className="flex items-center gap-2 border-b border-[#efe7dc] bg-[#ebe4da] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[#d5cbbf]" />
          <span className="h-2 w-2 rounded-full bg-[#d5cbbf]" />
          <span className="h-2 w-2 rounded-full bg-[#d5cbbf]" />
          <span className="ml-2 truncate font-sans text-[11px] tracking-wide text-[#6d655c]">
            {label}
          </span>
        </div>
        {/* Local captures of the public site. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-auto w-full max-w-full" />
      </a>
      <figcaption className="mt-3 font-sans text-sm leading-relaxed text-[#5e574f]">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function NbcsCaseStudy({ presentation = 'card' }: Props) {
  const framed = presentation === 'card'
  return (
    <article
      className={`${fraunces.className} w-full min-w-0 max-w-full rounded-2xl bg-[#f3efe8] text-[#1c1916] ${
        framed
          ? 'h-full overflow-y-auto overflow-x-hidden shadow-[0_24px_80px_rgba(0,0,0,0.35)]'
          : ''
      }`}
    >
      <nav className="sticky top-0 z-10 border-b border-[#e6dfd4] bg-[#f3efe8]/92 px-5 py-3 pr-16 backdrop-blur-md sm:px-8">
        <ol className="flex gap-x-4 gap-y-2 overflow-x-auto font-sans text-[11px] uppercase tracking-[0.14em] text-[#6d655c]">
          {CHAPTERS.map((chapter) => (
            <li key={chapter.id} className="shrink-0">
              <a href={`#${chapter.id}`} className="transition hover:text-[#7a1d3a]">
                {chapter.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="max-w-3xl">
          <h1 className="text-[2rem] leading-[1.12] tracking-tight sm:text-5xl">
            A bilingual Summit site, carried through to registration.
          </h1>
          <p className="mt-5 font-sans text-base leading-relaxed text-[#3f3a34] sm:text-lg">
            Visitors needed to discover the event, follow the program, and
            register in the language they prefer. The pages were already
            there. The work was to make that journey feel like one Summit.
          </p>
        </header>

        <section id="built" className="scroll-mt-16 mt-12">
          <Screen
            src="/case-studies/nbcs/home.png"
            alt="Homepage of the National Black Canadians Summit, with the title Moving Forward Together and a Register Here button."
            href={`${SITE}/en`}
            caption="The live homepage. Registering is the first action on the screen, in English or French."
          />
        </section>

        <section id="needed" className="scroll-mt-16 mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="max-w-xl">
            <h2 className="text-2xl tracking-tight sm:text-3xl">Why it was needed</h2>
            <div className="mt-6 space-y-5 font-sans text-[15px] leading-relaxed text-[#3f3a34]">
              <p>
                <span className="font-semibold text-[#1c1916]">The goal. </span>
                A person arriving at the site can understand the Summit and
                register,{' '}
                <Linked href={bilingualNote}>in English or in French</Linked>
                {'.'}
              </p>
              <p>
                <span className="font-semibold text-[#1c1916]">The obstacle. </span>
                <Linked href={inheritedNote}>
                  The inherited site already had the routes.
                </Linked>
                {' The registration route rendered a '}
                <Linked href={registrationNote}>
                  Bizzabo ticket widget on a blank page
                </Linked>
                {', with the event id fixed in the file. There was no shared header, no language switch, and no travel detail on that screen.'}
              </p>
            </div>
          </div>
          <aside className="rounded-2xl border border-[#e4d8c4] bg-[#fffdf8] p-5 shadow-sm">
            <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#8a8176]">
              Paraphrased request
            </p>
            <p className="mt-3 text-xl leading-snug tracking-tight">
              “Both languages have to stay in step, and people need a clear
              way to register.”
            </p>
          </aside>
        </section>

        <section id="screens" className="scroll-mt-16 mt-16">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div>
              <h2 className="text-2xl tracking-tight sm:text-3xl">
                A fix at one width kept breaking another
              </h2>
              <div className="mt-6 space-y-4 font-sans text-[15px] leading-relaxed text-[#3f3a34]">
                <p>
                  The programme, partners, and travel pages had to stay
                  readable on a phone and on a very wide monitor.{' '}
                  <Linked href={fluidNote}>
                    Type already scaled with the viewport.
                  </Linked>
                  {' Spacing did not.'}
                </p>
                <p>
                  On a wide screen the gaps between blocks were too large. The
                  next pass pulled them in until the section went too small.
                  Then the edges had to line up, a block needed to grow
                  slightly, and two sections needed air between them again.
                  The same loop showed up in smaller pieces: “Accommodation
                  & Location” had to sit on three centered lines without
                  breaking the navigation bar, and the stay button had to be{' '}
                  <Linked href={expansionNote}>
                    the same width in English and in French
                  </Linked>
                  {'.'}
                </p>
                <p>
                  Each correction was checked at the width where it failed,
                  then checked again at the other end. The pages hold their
                  alignment from a phone up through the widest layout.
                </p>
              </div>
              <aside className="mt-6 rounded-2xl border border-[#e4d8c4] bg-[#fffdf8] p-5 shadow-sm">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#8a8176]">
                  Paraphrased request
                </p>
                <p className="mt-3 text-xl leading-snug tracking-tight">
                  “It has to look right on a phone and on a very wide screen.”
                </p>
              </aside>
            </div>
            <Screen
              src="/case-studies/nbcs/program.png"
              alt="Summit programme page, with the day navigation and the schedule title on a wide layout."
              href={`${SITE}/en/program`}
              caption="The programme. This is one of the layouts that was corrected width by width."
            />
          </div>
        </section>

        <section id="registration" className="scroll-mt-16 mt-16">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl tracking-tight sm:text-3xl">
                The register button had to follow the language
              </h2>
              <div className="mt-6 space-y-4 font-sans text-[15px] leading-relaxed text-[#3f3a34]">
                <p>
                  Registration stayed in Bizzabo. On April 8 the integration
                  was rewritten four times in one day: the embed, the cleanup
                  when leaving the page, where the event id lived, and a pass
                  that pointed the ticket page at the Bizzabo event.
                </p>
                <p>
                  In July the Foundation’s event team sent a new embed and
                  asked to remove the previous registration link. Dropping
                  that code onto the page was not the end of it. In August,
                  switching the site to French still loaded the widget without
                  the French language parameter, so the button stayed
                  “Order now” instead of “Commandez maintenant.”
                </p>
                <p>
                  The widget now receives <span className="font-medium">?lang=en</span> or{' '}
                  <Linked href={localeNote}>
                    <span className="font-medium">?lang=fr-ca</span>
                  </Linked>
                  {' before '}
                  Bizzabo’s script loads, and it remounts when the visitor
                  changes language. English shows “Order now.” French shows
                  “Commandez maintenant.” The Summit page around it keeps the
                  header, the travel details, and the youth, gala, and access
                  paths.
                </p>
              </div>
              <aside className="mt-6 rounded-2xl border border-[#e4d8c4] bg-[#fffdf8] p-5 shadow-sm">
                <p className="font-sans text-[10px] uppercase tracking-[0.16em] text-[#8a8176]">
                  Paraphrased request
                </p>
                <p className="mt-3 text-xl leading-snug tracking-tight">
                  “The registration button has to say the right thing in each
                  language.”
                </p>
              </aside>
              <details className="mt-6 rounded-xl border border-[#e6dfd4] bg-[#faf7f2] px-4 py-3 font-sans">
                <summary className="cursor-pointer text-sm font-medium text-[#1c1916]">
                  Under the hood
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#5e574f]">
                  Next.js and next-intl serve English and French from the
                  same routes. The ticket page reads the locale, sets the
                  Bizzabo language before the script runs, and clears the
                  widget on a language change so the iframe cannot keep the
                  previous language. Program days are paired English and
                  French schedules. The contact form sends through Resend.
                </p>
              </details>
            </div>
            <Screen
              src="/case-studies/nbcs/register.png"
              alt="Registration page for the National Black Canadians Summit 2026, with paths for registration, youth waitlist, gala waitlist, and supporting access."
              href={`${SITE}/en/ticket`}
              caption="The registration page on the live site. The checkout itself stays in Bizzabo."
            />
          </div>
        </section>

        <section id="works" className="scroll-mt-16 mt-16">
          <h2 className="text-2xl tracking-tight sm:text-3xl">How it works</h2>
          <p className="mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-[#3f3a34]">
            Three steps a visitor can finish without leaving the Summit’s
            own pages.
          </p>
          <ol className="mt-8 grid min-w-0 gap-8 lg:grid-cols-3">
            <li>
              <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#7a1d3a]">
                01 · Discover
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#3f3a34]">
                The homepage states the dates, the city, and the way in.
              </p>
              <div className="mt-4">
                <Screen
                  src="/case-studies/nbcs/home.png"
                  alt="Summit homepage hero."
                  href={`${SITE}/en`}
                  caption="blackcanadiansummit.ca"
                />
              </div>
            </li>
            <li>
              <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#7a1d3a]">
                02 · Find the session
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#3f3a34]">
                The programme is split by day, with the same structure in
                French.
              </p>
              <div className="mt-4">
                <Screen
                  src="/case-studies/nbcs/program.png"
                  alt="Summit programme page, open on the day-by-day schedule."
                  href={`${SITE}/en/program`}
                  caption="Programme, by day."
                />
              </div>
            </li>
            <li>
              <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#7a1d3a]">
                03 · Register
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#3f3a34]">
                Registration, waitlists, and access sit under the Summit
                header.
              </p>
              <div className="mt-4">
                <Screen
                  src="/case-studies/nbcs/register.png"
                  alt="Summit registration page."
                  href={`${SITE}/en/ticket`}
                  caption="Registration on the Summit site."
                />
              </div>
            </li>
          </ol>
        </section>

        <section id="today" className="scroll-mt-16 mt-16 border-t border-[#e6dfd4] pt-12">
          <h2 className="text-2xl tracking-tight sm:text-3xl">Where it stands today</h2>
          <div className="mt-6 max-w-2xl space-y-4 font-sans text-[15px] leading-relaxed text-[#3f3a34]">
            <p>
              The site is live at{' '}
              <a
                href={`${SITE}/en`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#7a1d3a]/40 underline-offset-4 hover:decoration-[#7a1d3a]"
              >
                blackcanadiansummit.ca
              </a>
              . The Summit was held September 18–20, 2026, in Winnipeg. The
              site remains the public home for the event: program,
              registration, plan, partners, side events, and exhibitors, in
              English and French.
            </p>
            <p>
              Screens on this page were captured from the live site on
              November 10, 2026. Attendance and revenue figures are left out
              until they can be stated from the organizer’s own numbers.
            </p>
          </div>
        </section>
      </div>
    </article>
  )
}
