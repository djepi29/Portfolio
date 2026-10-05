import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kanson Wouj Digital | Full Stack Web Developer — Ottawa',
  description:
    'Apps, websites, and platforms for businesses that need to move online. Ottawa full stack web developer.',
  keywords:
    'web developer Ottawa, Kanson Wouj Digital, full stack developer, custom web apps',
  authors: [{ name: 'Kanson Wouj Digital' }],
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Kanson Wouj Digital | Full Stack Web Developer',
    description:
      'Apps, websites, and platforms for businesses that need to move online.',
    type: 'website',
    locale: 'en_CA',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#07080c] text-white`}>
        <main>{children}</main>
      </body>
    </html>
  )
}
