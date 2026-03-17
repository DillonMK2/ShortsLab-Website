'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}
