import Image from 'next/image'
import BrandLogoColor from '@/components/hero/BrandLogoColor'
import AdminCornerReveal from '@/components/hero/AdminCornerReveal'
import type { CardFaceContent } from '@/components/hero/cardVersions'

type Props = {
  content: CardFaceContent
  /** Moving silver band painted on the action tray glass (not the icons). */
  actionGlareBandRef?: React.RefObject<HTMLDivElement | null>
}

type CardActionLinkProps = {
  href: string
  label: string
  external?: boolean
  children: React.ReactNode
}

const glassActionClass =
  'pointer-events-auto relative z-10 inline-flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md bg-[#1a0a0c]/80 text-white/85 transition-[transform,background-color,color] hover:scale-105 hover:bg-[#1a0a0c] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer'

function CardActionLink({ href, label, external, children }: CardActionLinkProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-card-link
      aria-label={label}
      className={`group ${glassActionClass}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-black/90 px-2 py-1 text-[10px] font-medium tracking-wide text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
      {children}
    </a>
  )
}

function ActionDot() {
  return (
    <span
      aria-hidden
      className="mx-0.5 h-1 w-1 shrink-0 rounded-full bg-white/45 sm:mx-1"
    />
  )
}

export default function CardFaceCopy({ content, actionGlareBandRef }: Props) {
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

  const bookHref = content.book
    ? content.book.startsWith('http') || content.book.startsWith('/')
      ? content.book
      : `https://${content.book}`
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
      (content.book && bookHref) ||
      (content.pay && payHref)
  )

  const actionCount = [
    content.portfolio && portfolioHref,
    content.book && bookHref,
    content.pay && payHref,
    content.linkedin && linkedinHref,
  ].filter(Boolean).length

  const actionPadClass =
    actionCount >= 4
      ? 'pr-[11rem] sm:pr-[13rem] pb-8 sm:pb-10'
      : actionCount >= 3
        ? 'pr-[8.5rem] sm:pr-[10rem] pb-8 sm:pb-10'
        : actionCount >= 2
          ? 'pr-[6rem] sm:pr-[7rem] pb-8 sm:pb-10'
          : actionCount === 1
            ? 'pr-[3.25rem] sm:pr-[3.75rem] pb-8 sm:pb-10'
            : ''

  const actions = [
    content.portfolio && portfolioHref
      ? {
          key: 'portfolio',
          href: portfolioHref,
          label: 'Portfolio',
          external: portfolioHref.startsWith('http'),
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
            >
              <path d="M4 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v1H4V6zm0 3h16v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9zm3 3h4v1H7v-1z" />
            </svg>
          ),
        }
      : null,
    content.book && bookHref
      ? {
          key: 'book',
          href: bookHref,
          label: 'Book',
          external: bookHref.startsWith('http'),
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
            >
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />
            </svg>
          ),
        }
      : null,
    content.pay && payHref
      ? {
          key: 'pay',
          href: payHref,
          label: 'Pay',
          external: payHref.startsWith('http'),
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
            >
              <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
            </svg>
          ),
        }
      : null,
    content.linkedin && linkedinHref
      ? {
          key: 'linkedin',
          href: linkedinHref,
          label: 'LinkedIn',
          external: true,
          icon: (
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current pointer-events-none"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          ),
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string
    href: string
    label: string
    external: boolean
    icon: React.ReactNode
  }>

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
        <div className="pointer-events-none absolute bottom-0 right-0 z-20 flex items-center overflow-visible rounded-tl-xl bg-[#1a0a0c]/70 py-0.5 pl-5 pr-4 backdrop-blur-sm sm:pl-7 sm:pr-5">
          {/* Silver sweep on tray glass only — icons sit above */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-tl-xl"
          >
            <div
              ref={actionGlareBandRef}
              className="absolute top-[-40%] bottom-[-40%] w-[70%]"
              style={{
                left: 0,
                transform: 'translateX(-60%) skewX(-18deg)',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(220,230,245,0.2) 35%, rgba(255,255,255,0.95) 50%, rgba(210,220,235,0.25) 65%, transparent 100%)',
                opacity: 0.9,
              }}
            />
          </div>
          <div className="relative z-10 flex items-center gap-1 sm:gap-1.5">
            {actions.map((action, index) => (
              <div key={action.key} className="contents">
                {index > 0 ? <ActionDot /> : null}
                <CardActionLink
                  href={action.href}
                  label={action.label}
                  external={action.external}
                >
                  {action.icon}
                </CardActionLink>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
