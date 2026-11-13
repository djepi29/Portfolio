import { findProject, noteHref } from '@/content/writing'
import NoteFrame, {
  noteBody as body,
  noteHeading,
  noteLink as link,
} from '@/components/writing/NoteFrame'

const PROJECT = 'national-black-canadians-summit'
const SLUG = 'text-expansion-in-bilingual-interfaces'

export default function TextExpansionPost() {
  const studyHref = findProject(PROJECT)?.caseStudy.href
  const bilingualHref = noteHref(
    PROJECT,
    'bilingual-websites-for-canadian-organizations',
  )
  if (!studyHref || !bilingualHref) return null

  return (
    <NoteFrame
      projectSlug={PROJECT}
      postSlug={SLUG}
      lede={
        <>
          French runs longer than English. A button, a navigation label, and a
          heading measured in English will wrap, break the bar, or change
          width when the French arrives.
        </>
      }
    >
      <section className="space-y-4">
        <h2 className={noteHeading}>Two places it showed up</h2>
        <p className={body}>
          On the{' '}
          <a href={studyHref} className={link}>
            National Black Canadians Summit
          </a>{' '}
          site, the same loop showed up in small pieces after the large
          spacing was under control. “Accommodation & Location” had to sit on
          three centered lines without breaking the navigation bar. The stay
          button had to be the same width in English and in French.
        </p>
        <p className={body}>
          The copy was doing its job. The English label fit the space it had
          been given. The French label was a longer string in the same control.
          The layout had been measured against the shorter language.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>Size the control for the longer string</h2>
        <p className={body}>
          A button that changes width when the language changes feels like a
          different button. The stay button needed one width, wide enough for
          the French, still looking like the same control in English. The
          width is a property of the control, not a property of whichever
          label happens to be shorter.
        </p>
        <p className={body}>
          The practical check is both locales on that control, at the width
          where it sits in the page. English confirms the control still looks
          intended when the label has room to spare. French confirms the label
          fits without wrapping into a second shape.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>Give a navigation label its lines</h2>
        <p className={body}>
          A navigation bar is a fixed band. A label that needs more room will
          wrap into that band unless the wrap is decided. “Accommodation &
          Location” was given three centered lines, so the bar could hold the
          label in both languages without the item breaking the row.
        </p>
        <p className={body}>
          Leaving the wrap to the browser means the English bar and the French
          bar are different designs. Setting the lines means both languages
          occupy the same place. The label is allowed to be long. The bar is
          not asked to improvise.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>Both languages, then both widths</h2>
        <p className={body}>
          Text expansion sits on top of the bilingual structure. The two
          languages stay in step only when the layout was finished for both,
          which is the point of{' '}
          <a href={bilingualHref} className={link}>
            bilingual websites for Canadian organizations
          </a>
          . A shared route can still ship a control that only fits English.
        </p>
        <p className={body}>
          After the strings are paired, look at the control in French and in
          English, on a phone and on a wide screen. The Summit’s stay button
          and that navigation label were corrected the way the section spacing
          was corrected: at the place they failed, then at the other end.
        </p>
      </section>
    </NoteFrame>
  )
}
