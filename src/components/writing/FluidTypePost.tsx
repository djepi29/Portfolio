import { findProject, noteHref } from '@/content/writing'
import NoteFrame, {
  noteBody as body,
  noteHeading,
  noteLink as link,
} from '@/components/writing/NoteFrame'

const PROJECT = 'national-black-canadians-summit'
const SLUG = 'fluid-type-is-not-a-responsive-layout'

export default function FluidTypePost() {
  const studyHref = findProject(PROJECT)?.caseStudy.href
  const expansionHref = noteHref(
    PROJECT,
    'text-expansion-in-bilingual-interfaces',
  )
  if (!studyHref || !expansionHref) return null

  return (
    <NoteFrame
      projectSlug={PROJECT}
      postSlug={SLUG}
      lede={
        <>
          Scaling the type with the viewport settles the words. The gaps, the
          alignment, and the width of a section are still free to fail at the
          width where nobody has looked yet.
        </>
      }
    >
      <section className="space-y-4">
        <h2 className={noteHeading}>What had already scaled</h2>
        <p className={body}>
          On the{' '}
          <a href={studyHref} className={link}>
            National Black Canadians Summit
          </a>{' '}
          site, the programme, partners, and travel pages had to stay readable
          on a phone and on a very wide monitor. The type already scaled with
          the viewport. A heading that was comfortable on a laptop grew and
          shrank with the window. That part of the layout was done.
        </p>
        <p className={body}>
          Readable type is the part people notice first. It is also the part
          that can hide the rest. A page can have a type scale and still fall
          apart between a phone and a wide monitor.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>What the spacing did</h2>
        <p className={body}>
          On a wide screen the gaps between blocks were too large. The next
          pass pulled them in until the section went too small. Then the edges
          had to line up, a block needed to grow slightly, and two sections
          needed air between them again.
        </p>
        <p className={body}>
          Each of those passes was a real correction. Each one also moved the
          failure to the other end of the width range. Tight gaps that saved a
          wide monitor crushed a section. Air that restored the section opened
          the wide screen back up. The type scale never entered that loop. The
          spacing did.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>Check both ends</h2>
        <p className={body}>
          Each correction was checked at the width where it failed, then
          checked again at the other end. A phone and the widest layout are
          both part of the same page. A fix that is only confirmed where it
          was noticed is half a fix.
        </p>
        <p className={body}>
          The practical order is short. Find the width that breaks. Change the
          gap, the alignment, or the section width there. Look at that width
          again. Then look at the other end before calling the page done. The
          Summit pages hold their alignment from a phone up through the widest
          layout because that second look stayed in the work.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className={noteHeading}>The same loop, in smaller pieces</h2>
        <p className={body}>
          Spacing between sections was the large version of the problem.
          Labels were the small version. “Accommodation & Location” had to sit
          on a set number of lines, and a stay button had to keep one width in
          English and in French. Those are{' '}
          <a href={expansionHref} className={link}>
            text expansion
          </a>
          : the type can scale, and a string that grew in the other language
          can still break the bar.
        </p>
        <p className={body}>
          Fluid type is one decision. The gaps, the measure of a section, and
          the width of a control are separate decisions. They are finished
          when both ends of the viewport, and both languages, have been looked
          at after the last change.
        </p>
      </section>
    </NoteFrame>
  )
}
