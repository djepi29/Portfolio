'use client'

import dynamic from 'next/dynamic'

const LogoBird = dynamic(() => import('@/components/hero/LogoBird'), {
  ssr: false,
  loading: () => (
    <div className="h-[min(58vh,480px)] w-full animate-pulse rounded-full bg-white/5" />
  ),
})

export default function PortfolioBirdStage({
  variant = 'studio',
}: {
  variant?: 'studio' | 'mascot'
}) {
  return <LogoBird variant={variant} />
}
