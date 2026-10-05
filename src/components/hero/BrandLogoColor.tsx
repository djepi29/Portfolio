import Image from 'next/image'

type Props = {
  /** Overall mark height */
  className?: string
  priority?: boolean
}

/**
 * Colored bird mark + white wordmark for dark surfaces.
 * Clips the full logo asset so only the bird keeps brand color.
 */
export default function BrandLogoColor({ className = '', priority }: Props) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Bird only — natural colors */}
      <div className="relative h-[4.75rem] sm:h-[5.5rem] w-[4.25rem] sm:w-[5rem] shrink-0 overflow-hidden">
        <Image
          src="/logo.png"
          alt=""
          width={360}
          height={112}
          className="absolute left-0 top-1/2 h-[92%] w-auto max-w-none -translate-y-1/2 object-contain object-left drop-shadow-[0_0_14px_rgba(227,30,36,0.35)]"
          priority={priority}
          aria-hidden
        />
      </div>

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
