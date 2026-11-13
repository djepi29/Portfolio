import Link from 'next/link'

const pill =
  'inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide shadow-sm backdrop-blur-sm transition-colors'

type Props = {
  current?: 'blog'
}

export default function WritingNav({ current }: Props) {
  const item = (active: boolean) =>
    `${pill} ${
      active
        ? 'border-white/40 bg-white/20 text-white'
        : 'border-white/20 bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
    }`

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Site">
      <Link href="/" className={item(false)}>
        Home
      </Link>
      <Link href="/portfolio" className={item(false)}>
        Portfolio
      </Link>
      <Link
        href="/blog"
        className={item(current === 'blog')}
        aria-current={current === 'blog' ? 'page' : undefined}
      >
        Blog
      </Link>
    </nav>
  )
}
