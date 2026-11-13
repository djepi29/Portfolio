import { findProject } from '@/content/writing'
import NoteFrame, { noteBody as body, noteLink as link } from '@/components/writing/NoteFrame'

const PROJECT = 'national-black-canadians-summit'
const SLUG = 'bilingual-websites-for-canadian-organizations'

export default function BilingualWebsitesPost() {
  const studyHref = findProject(PROJECT)?.caseStudy.href
  if (!studyHref) return null

  return (
    <NoteFrame
      projectSlug={PROJECT}
      postSlug={SLUG}
      lede={
        <>
          A Canadian organization that serves people in both official languages
          needs one site. A visitor should be able to understand the
          organization and take the next step, in English or in French. The
          two versions have to stay in step: the same pages, the same actions,
          the same way through.
        </>
      }
    >
        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            Same routes, two locales
          </h2>
          <p className={body}>
            The{' '}
            <a href={studyHref} className={link}>
              National Black Canadians Summit
            </a>{' '}
            site is the worked example. It is built in Next.js. next-intl
            serves English and French from the same routes. The programme is
            one page. English is{' '}
            <a
              href="https://www.blackcanadiansummit.ca/en/program"
              className={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              /en/program
            </a>
            . French is{' '}
            <a
              href="https://www.blackcanadiansummit.ca/fr/program"
              className={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              /fr/program
            </a>
            . The layout, the day navigation, and the path to registration are
            the same page in both languages.
          </p>
          <p className={body}>
            The language switch changes the locale prefix and stays on the
            page the visitor is already reading. A shared link can point at
            the French page, because French has its own address.
          </p>
          <p className={body}>
            A route is unfinished until both prefixes resolve. The Summit site
            had inherited its routes. The work was to make the journey around
            those routes one journey: a shared header, a language switch, and
            a registration page that still looked like the Summit.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            A shared layout, strings kept with the locale
          </h2>
          <p className={body}>
            The header, the language switch, and the facts a visitor needs
            before they act belong to the layout. On the Summit site those
            facts are the dates, the city, and the travel details. When
            registration was a ticket widget on a blank page, both languages
            lost the Summit around the button. Putting that page back in the
            shared layout restored the header and the travel details in
            English and in French with one implementation.
          </p>
          <p className={body}>
            The strings stay out of that layout. The page reads the locale
            and renders the messages for it. A spacing correction on the
            programme page then lands in both languages, because the structure
            is one structure. The words are the part that changes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            Where the two languages drift
          </h2>
          <p className={body}>
            Drift is a translated sentence sitting on a structure that was
            only finished in one language.
          </p>
          <p className={body}>
            A route that opens in English and fails in French makes the
            language switch a dead end. The visitor who chose French is the
            one who finds it.
          </p>
          <p className={body}>
            A label sized for English will break the bar in French. On the
            Summit site, “Accommodation & Location” had to occupy a set number
            of lines so it would not break the navigation, and a stay button
            had to be the same width in both languages. The layout had been
            measured against the shorter English label. The French line needed
            the same width and the same number of lines.
          </p>
          <p className={body}>
            A schedule translated as one document hides a missing session.
            The programme is a set of days. Each English day is paired with
            the French day. A session added on one side and missing on the
            other stays visible.
          </p>
          <p className={body}>
            An embedded tool can ignore the page. The Summit’s registration
            widget kept the English button label on the French page until the
            locale was passed in before the script loaded. The page can be
            bilingual and the embed can still speak one language. The page’s
            job is to know its locale and to hand that locale to anything it
            mounts.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            Decisions to make before the first page
          </h2>
          <p className={body}>
            <span className="font-semibold text-[#1c1916]">Which locales. </span>
            For a Canadian public site the pair is English and French. When a
            ticket platform, a form, or a map asks for a region, French is{' '}
            <span className="font-medium">fr-CA</span>. The site path can
            still be <span className="font-medium">/fr</span>. Write down the
            code each system expects, so the page and the tool agree about
            which French they are speaking.
          </p>
          <p className={body}>
            <span className="font-semibold text-[#1c1916]">Which URLs. </span>
            A prefix (<span className="font-medium">/en</span>,{' '}
            <span className="font-medium">/fr</span>) gives each language an
            address. The Summit uses those prefixes. The switch is a change of
            address. A cookie alone leaves both languages on one URL, and a
            shared link cannot point at the French page.
          </p>
          <p className={body}>
            <span className="font-semibold text-[#1c1916]">
              When a page is allowed to ship.{' '}
            </span>
            A page ships when both locales have the route, the title, and the
            primary action. On the Summit site that included the programme,
            the contact form, and registration.
          </p>
          <p className={body}>
            <span className="font-semibold text-[#1c1916]">
              Where the strings live.{' '}
            </span>
            next-intl keeps them with the locale, outside the page markup, so
            the layout stays one component. If the French copy is a follow-up
            task, the page will launch in one language and the second will
            trail it. Treat the pair of strings as part of the page, the way
            the Summit treats a pair of programme days.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight sm:text-3xl">
            What it looks like when it holds
          </h2>
          <p className={body}>
            A visitor can arrive in either language, read the same Summit, and
            register with the site still recognizably itself. The header
            stays. The language switch stays on the page they are on. The
            button they came to press says the right thing.
          </p>
          <p className={body}>
            That is the standard the Summit site was built to. The live site
            is{' '}
            <a
              href="https://www.blackcanadiansummit.ca/en"
              className={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              blackcanadiansummit.ca
            </a>
            . The project page records how the registration path, the widths,
            and the widget were brought into line with it.
          </p>
        </section>
    </NoteFrame>
  )
}
