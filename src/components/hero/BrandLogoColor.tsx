type Props = {
  /** Overall mark height */
  className?: string
  priority?: boolean
}

/**
 * Colored bird mark + white wordmark for dark surfaces.
 * Clips the full logo asset so only the bird keeps brand color.
 */
export default function BrandLogoColor({ className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Bird only — natural colors */}
      <div
        aria-hidden
        className="h-[4.75rem] sm:h-[5.5rem] w-[3.7rem] sm:w-[4.35rem] shrink-0 bg-left bg-no-repeat drop-shadow-[0_0_14px_rgba(227,30,36,0.35)]"
        style={{
          backgroundImage: 'url(/logo.png)',
          backgroundSize: 'auto 92%',
        }}
      />

      {/* Wordmark — white */}
      <div className="flex flex-col justify-center leading-none text-white">
        <span className="text-[1.35rem] sm:text-[1.6rem] font-extrabold tracking-tight">
          KANSON
        </span>
        <span className="text-[1.35rem] sm:text-[1.6rem] font-extrabold tracking-tight">
          WOUJ
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-[0.65rem] sm:text-[0.7rem] font-medium tracking-[0.28em] text-white/80">
          <span className="h-px w-3 bg-white/45" aria-hidden />
          DIGITAL
          <span className="h-px w-3 bg-white/45" aria-hidden />
        </span>
      </div>
    </div>
  )
}
