import type { Metadata } from 'next'
import { inter, sora } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'ShortsLab - The All-In-One YouTube Automation Studio',
  description: 'ShortsLab is the ultimate desktop app for YouTube creators. AI-powered research, script generation, voiceovers, and channel analytics in one powerful studio.',
  keywords: 'YouTube, automation, shorts, AI, script writing, voiceover, analytics, creator tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-background text-white min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-violet focus:text-white focus:rounded-lg focus:font-medium"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
