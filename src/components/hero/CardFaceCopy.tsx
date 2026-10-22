import Image from 'next/image'
import BrandLogoColor from '@/components/hero/BrandLogoColor'
import AdminCornerReveal from '@/components/hero/AdminCornerReveal'
import type { CardFaceContent } from '@/components/hero/cardVersions'

type Props = {
  content: CardFaceContent
}

export default function CardFaceCopy({ content }: Props) {
  if (content.layout === 'logo-statement') {
    return (
      <div className="pointer-events-none relative z-[1] flex h-full flex-col justify-center gap-5 p-5 sm:p-6 text-[#f3f4f6]">
        <BrandLogoColor className="self-start" priority />
        <p className="w-full text-center text-sm sm:text-base text-white/75 leading-snug tracking-wide [text-shadow:0_0_20px_rgba(255,255,255,0.15)]">
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

  const portfolioHref = content.portfolio
    ? content.portfolio.startsWith('http') || content.portfolio.startsWith('/')
      ? content.portfolio
      : `https://${content.portfolio}`
    : undefined

  const payHref = content.pay
    ? content.pay.startsWith('http') || content.pay.startsWith('/')
      ? content.pay
      : `https://${content.pay}`
    : undefined

  const adminHref = content.admin
    ? content.admin.startsWith('http') || content.admin.startsWith('/')
      ? content.admin
      : `https://${content.admin}`
    : undefined

  const hasActionButtons = Boolean(
    (content.linkedin && linkedinHref) ||
      (content.portfolio && portfolioHref) ||
      (content.pay && payHref)
  )

  const actionCount = [
    content.portfolio && portfolioHref,
    content.pay && payHref,
    content.linkedin && linkedinHref,
  ].filter(Boolean).length

  const actionPadClass =
    actionCount >= 3
      ? 'pr-[7.25rem] sm:pr-[8.5rem]'
      : actionCount >= 2
        ? 'pr-[4.75rem] sm:pr-[5.5rem]'
        : actionCount === 1
          ? 'pr-[2.5rem] sm:pr-[3rem]'
          : ''

  return (
    <div className="pointer-events-none relative z-[1] flex h-full min-h-0 flex-col gap-2 p-3 sm:gap-3 sm:p-5 text-[#f3f4f6]">
      {content.admin && adminHref ? (
        <AdminCornerReveal href={adminHref} />
      ) : null}

      <Image
        src="/logo.png"
        alt="Kanson Wouj Digital"
        width={180}
        height={56}
        className="h-7 sm:h-10 w-auto self-start object-contain brightness-0 invert opacity-95 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        priority
      />

      <div
        className={`min-h-0 flex-1 space-y-1 overflow-hidden sm:space-y-1.5 ${actionPadClass}`}
      >
        <h1 className="text-base sm:text-xl font-bold tracking-tight leading-none text-white [text-shadow:0_0_24px_rgba(255,255,255,0.2)]">
          {content.headline}
        </h1>
        {content.subhead ? (
          <p className="line-clamp-2 sm:line-clamp-3 text-[9px] sm:text-[11px] font-medium text-white/75 leading-snug">
            {content.subhead}
          </p>
        ) : null}
        {content.email ? (
          <a
            href={`mailto:${content.email}`}
            data-card-link
            className="pointer-events-auto relative z-20 block pt-0.5 text-[10px] sm:text-xs text-white/70 hover:text-white transition-colors break-all"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {content.email}
          </a>
        ) : null}
      </div>

      {hasActionButtons ? (
        <div className="pointer-events-none absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 flex items-center gap-1.5 sm:gap-2">
          {content.portfolio && portfolioHref ? (
            <a
              href={portfolioHref}
              {...(portfolioHref.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              data-card-link
              aria-label="Open portfolio website"
              className="pointer-events-auto inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-[#e31e24] text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#c41920] cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
              >
                <path d="M4 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v1H4V6zm0 3h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9zm3 3h4v1H7v-1z" />
              </svg>
            </a>
          ) : null}
          {content.pay && payHref ? (
            <a
              href={payHref}
              {...(payHref.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              data-card-link
              aria-label="Pay with Stripe"
              className="pointer-events-auto inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-[#635BFF] text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#4F46E5] cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
              >
                <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
            </a>
          ) : null}
          {content.linkedin && linkedinHref ? (
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              data-card-link
              aria-label="Open LinkedIn profile"
              className="pointer-events-auto inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md bg-[#0A66C2] text-white shadow-sm transition-transform hover:scale-105 hover:bg-[#004182] cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
