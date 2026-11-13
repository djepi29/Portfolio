import { findProject, noteHref } from '@/content/writing'
import NoteFrame, {
  noteBody as body,
  noteHeading,
  noteLink as link,
} from '@/components/writing/NoteFrame'

const PROJECT = 'national-black-canadians-summit'
const SLUG = 'passing-a-locale-into-an-embedded-widget'

export default function LocaleWidgetPost() {
  const studyHref = findProject(PROJECT)?.caseStudy.href
  const registrationHref = noteHref(
    PROJECT,
    'keeping-registration-inside-the-event-site',
  )
  if (!studyHref || !registrationHref) return null

  return (
    <NoteFrame
      projectSlug={PROJECT}
      postSlug={SLUG}
      lede={
        <>
          A bilingual page can wrap a tool that speaks one language. The page
          has to tell the tool which language to use, and it has to do that
          before the tool’s script loads.
        </>
      }
    >
      <section className="space-y-4">
        <h2 className={noteHeading}>What the visitor saw</h2>
        <p className={body}>
          Registration on the{' '}
          <a href={studyHref} className={link}>
            National Black Canadians Summit
          </a>{' '}
          site stayed in Bizzabo. In August, switching the site to French
          still loaded the widget without the French language parameter. The
          button stayed “Order now” instead of “Commandez maintenant.”
        </p>
        <p className={body}>
          The page around the widget was already in French. The header, the
          travel details, and the language switch had done their job. The
          button the visitor came to press had not. A bilingual page and a
          one-language embed can sit on the same screen.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>Set the language before the script</h2>
        <p className={body}>
          The widget now receives <span className="font-medium">?lang=en</span>{' '}
          or <span className="font-medium">?lang=fr-ca</span> before Bizzabo’s
          script loads. The ticket page reads the locale and sets that
          parameter first. If the script starts without it, the widget chooses
          its own language and the page cannot talk it back.
        </p>
        <p className={body}>
          <span className="font-medium">fr</span> and{' '}
          <span className="font-medium">fr-CA</span> are different requests.
          The Summit’s French pages live under <span className="font-medium">/fr</span>.
          The ticket platform asks for a region, and that region is{' '}
          <span className="font-medium">fr-CA</span>. The path and the
          parameter each use the code that system expects. Writing both down
          is what keeps the page and the widget in the same French.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>Clear it when the language changes</h2>
        <p className={body}>
          Passing the parameter once is enough for the first load. A visitor
          who switches language is still on the page, and the widget is already
          running. The iframe keeps the previous language unless it is cleared.
        </p>
        <p className={body}>
          The widget remounts when the visitor changes language. The ticket
          page reads the new locale, sets the Bizzabo language before the
          script runs again, and clears the widget so the iframe cannot keep
          “Order now” on a French page, or “Commandez maintenant” on an English
          one.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>The page around the button</h2>
        <p className={body}>
          English shows “Order now.” French shows “Commandez maintenant.” The
          Summit page around the widget keeps the header, the travel details,
          and the youth, gala, and access paths. That surrounding page is{' '}
          <a href={registrationHref} className={link}>
            keeping registration inside the event site
          </a>
          . The locale parameter is what makes the button belong to that page.
        </p>
        <p className={body}>
          The live registration page is{' '}
          <a
            href="https://www.blackcanadiansummit.ca/en/ticket"
            className={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            blackcanadiansummit.ca/en/ticket
          </a>
          . The French page is the same route under{' '}
          <a
            href="https://www.blackcanadiansummit.ca/fr/ticket"
            className={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            /fr/ticket
          </a>
          . The widget on each one has to be told which of those pages it is
          sitting in.
        </p>
      </section>
    </NoteFrame>
  )
}
