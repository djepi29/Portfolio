'use client'

import BusinessCard3D from '@/components/hero/BusinessCard3D'

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#07080c] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -top-32 left-[8%] h-[70vh] w-[55vw] max-w-[720px] rounded-full opacity-80 blur-[100px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(255,214,170,0.22) 0%, rgba(255,180,120,0.06) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[10%] right-[-5%] h-[55vh] w-[40vw] rounded-full opacity-70 blur-[90px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(120,160,255,0.14) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute bottom-[5%] left-[20%] h-[30vh] w-[35vw] rounded-full opacity-50 blur-[80px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(227,30,36,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{
            background:
              'linear-gradient(to top, #030407 0%, rgba(7,8,12,0.85) 45%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.72) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
            backgroundSize: '160px 160px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-10">
        <BusinessCard3D />
      </div>
    </section>
  )
}
