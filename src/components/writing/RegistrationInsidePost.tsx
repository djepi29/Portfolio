import { findProject, noteHref } from '@/content/writing'
import NoteFrame, {
  noteBody as body,
  noteHeading,
  noteLink as link,
} from '@/components/writing/NoteFrame'

const PROJECT = 'national-black-canadians-summit'
const SLUG = 'keeping-registration-inside-the-event-site'

export default function RegistrationInsidePost() {
  const studyHref = findProject(PROJECT)?.caseStudy.href
  const localeHref = noteHref(
    PROJECT,
    'passing-a-locale-into-an-embedded-widget',
  )
  if (!studyHref || !localeHref) return null

  return (
    <NoteFrame
      projectSlug={PROJECT}
      postSlug={SLUG}
      lede={
        <>
          The checkout can live in a ticket platform. The page around the
          checkout has to stay the event. A widget on a blank route sells a
          ticket and loses the organization.
        </>
      }
    >
      <section className="space-y-4">
        <h2 className={noteHeading}>The blank page</h2>
        <p className={body}>
          On the{' '}
          <a href={studyHref} className={link}>
            National Black Canadians Summit
          </a>{' '}
          site, registration stayed in Bizzabo. The inherited route rendered
          that ticket widget on a blank page, with the event id fixed in the
          file. There was no shared header, no language switch, and no travel
          detail on that screen.
        </p>
        <p className={body}>
          A visitor who had been reading the Summit in French, or checking
          where to stay, arrived at a page that belonged to the widget. The
          route was correct. The page had stepped out of the event.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>What stayed in the ticket platform</h2>
        <p className={body}>
          The checkout itself stayed in Bizzabo. On April 8 the integration
          was rewritten four times in one day: the embed, the cleanup when
          leaving the page, where the event id lived, and a pass that pointed
          the ticket page at the Bizzabo event. In July the Foundation’s event
          team sent a new embed and asked to remove the previous registration
          link. Dropping that code onto the page was the start of the work,
          not the end of it.
        </p>
        <p className={body}>
          The event id, the script, and the order belong to the platform. The
          Summit page does not reimplement checkout. It gives the widget a
          place to run, and it clears that widget when the visitor leaves or
          changes language.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>What the event page keeps</h2>
        <p className={body}>
          The page around the widget keeps the header, the travel details, and
          the youth, gala, and access paths. Registration, waitlists, and
          access sit under the Summit header. A visitor can finish the step
          without leaving the Summit’s own pages. The live registration page
          is{' '}
          <a
            href="https://www.blackcanadiansummit.ca/en/ticket"
            className={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            blackcanadiansummit.ca/en/ticket
          </a>
          .
        </p>
        <p className={body}>
          Those surrounding paths matter as much as the button. Youth
          waitlist, gala waitlist, and supporting access are Summit decisions.
          They belong on the Summit page, next to the ticket, in the language
          the visitor already chose.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>Two jobs on one screen</h2>
        <p className={body}>
          The page’s job is the event: where it is, how to get there, and
          which path the visitor is on. The widget’s job is the order. They
          have to be visible together. A blank page gives the widget the whole
          screen and the event disappears.
        </p>
        <p className={body}>
          The button on that widget still has to speak the language of the
          page. That handoff is{' '}
          <a href={localeHref} className={link}>
            passing a locale into the embedded widget
          </a>
          . The page can hold the header and still show “Order now” on a
          French screen until the locale is passed in before the script loads.
        </p>
      </section>
    </NoteFrame>
  )
}
