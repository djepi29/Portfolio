import Image from 'next/image'
import BrandLogoColor from '@/components/hero/BrandLogoColor'
import type { CardFaceContent } from '@/components/hero/cardVersions'

type Props = {
  content: CardFaceContent
  rimStrength?: number
}

export default function CardFaceCopy({ content, rimStrength = 0.4 }: Props) {
  if (content.layout === 'logo-statement') {
    return (
      <div className="relative z-[1] flex h-full flex-col justify-center gap-5 p-5 sm:p-6 text-[#f3f4f6]">
        <BrandLogoColor className="self-start" priority />
        <p
          className="w-full text-center text-sm sm:text-base text-white/75 leading-snug tracking-wide"
          style={{
            textShadow: `0 0 20px rgba(255,255,255,${0.1 + rimStrength * 0.12})`,
          }}
        >
          {content.body}
        </p>
      </div>
    )
  }

  const linkedinHref = content.linkedin
    ? content.linkedin.startsWith('http')
      ? content.linkedin
      : `https://${content.linkedin}`
    : undefined

  return (
    <div className="relative z-[1] flex h-full flex-col justify-between gap-3 p-4 sm:p-5 text-[#f3f4f6]">
      <Image
        src="/logo.png"
        alt="Kanson Wouj Digital"
        width={180}
        height={56}
        className="h-9 sm:h-10 w-auto self-start object-contain brightness-0 invert opacity-95 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        priority
      />

      <div className="space-y-1.5 min-w-0">
        <h1
          className="text-lg sm:text-xl font-bold tracking-tight leading-none text-white"
          style={{
            textShadow: `0 0 24px rgba(255,255,255,${0.12 + rimStrength * 0.18})`,
          }}
        >
          {content.headline}
        </h1>
        {content.subhead ? (
          <p className="text-[10px] sm:text-[11px] font-medium text-white/75 leading-snug">
            {content.subhead}
          </p>
        ) : null}
        {content.email ? (
          <a
            href={`mailto:${content.email}`}
            data-card-link
            className="relative z-20 block pt-1 text-[11px] sm:text-xs text-white/70 hover:text-white transition-colors break-all"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {content.email}
          </a>
        ) : null}
      </div>

      <div className="relative z-20 flex justify-end">
        {content.linkedin && linkedinHref ? (
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            data-card-link
            aria-label="Open LinkedIn profile"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#0A66C2] text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#004182] cursor-pointer"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-4 w-4 fill-current pointer-events-none"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        ) : null}
      </div>
    </div>
  )
}
