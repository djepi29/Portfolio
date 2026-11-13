import { findProject, noteHref } from '@/content/writing'
import NoteFrame, {
  noteBody as body,
  noteHeading,
  noteLink as link,
} from '@/components/writing/NoteFrame'

const PROJECT = 'national-black-canadians-summit'
const SLUG = 'rebuilding-an-inherited-website'

export default function InheritedWebsitePost() {
  const project = findProject(PROJECT)
  const studyHref = project?.caseStudy.href
  const registrationHref = noteHref(
    PROJECT,
    'keeping-registration-inside-the-event-site',
  )
  if (!project || !studyHref || !registrationHref) return null

  return (
    <NoteFrame
      projectSlug={PROJECT}
      postSlug={SLUG}
      lede={
        <>
          An inherited website already has pages. The routes resolve, the
          content is there, and people have been sent to those addresses. The
          work is to make the path between those pages one path.
        </>
      }
    >
      <section className="space-y-4">
        <h2 className={noteHeading}>What was already there</h2>
        <p className={body}>
          The{' '}
          <a href={studyHref} className={link}>
            National Black Canadians Summit
          </a>{' '}
          site arrived with its routes. A visitor could open the homepage, the
          programme, the partners, and the travel page. Registration had a
          route of its own. The addresses were not the obstacle.
        </p>
        <p className={body}>
          Keeping those addresses matters. A new structure with new URLs throws
          away every link already in an email, a poster, or a search result.
          The Summit kept the routes and changed what a person met on them.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>What a route can still be missing</h2>
        <p className={body}>
          The registration route rendered a ticket widget on a blank page. The
          event id was fixed in the file. There was no shared header, no
          language switch, and no travel detail on that screen. The route
          worked. The journey stopped.
        </p>
        <p className={body}>
          That blank page is its own problem, written up as{' '}
          <a href={registrationHref} className={link}>
            keeping registration inside the event site
          </a>
          . Here it is the sign of an inherited site: the pages exist, and the
          chrome that should bind them was never shared.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>The journey is the work</h2>
        <p className={body}>
          A person arriving at the Summit needed to understand the event and
          register, in English or in French, and feel that they were still on
          one site. The homepage, the programme, and registration had to share
          a header and a language switch. Travel details had to be present
          where someone decides to register, not only on a page they might
          already have left.
        </p>
        <p className={body}>
          Shared layout is how an inherited site becomes one site. A correction
          to the header lands on every route, including the one that used to
          be blank. A language switch stays on the page the visitor is reading,
          because every route has both locales.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>What to keep, and what to rebuild</h2>
        <p className={body}>
          <span className="font-semibold text-[#1c1916]">Keep the routes </span>
          people already use, and the content that is still true.
        </p>
        <p className={body}>
          <span className="font-semibold text-[#1c1916]">Rebuild the layout </span>
          those routes share: header, language switch, and the facts a visitor
          needs before they act.
        </p>
        <p className={body}>
          <span className="font-semibold text-[#1c1916]">
            Rebuild the path{' '}
          </span>
          from the first screen to the action. On the Summit that path is
          discover, find the session, register. Each step stays on the
          organization’s own pages.
        </p>
        <p className={body}>
          A new information architecture is a different project. This one was
          the same routes, carried through so the journey felt like one Summit.
          The live site is{' '}
          <a
            href="https://www.blackcanadiansummit.ca/en"
            className={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            blackcanadiansummit.ca
          </a>
          .
        </p>
      </section>
    </NoteFrame>
  )
}
