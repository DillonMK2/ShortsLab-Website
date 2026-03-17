import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import Hero from '@/components/Hero'
import FeaturesSection from '@/components/FeaturesSection'
import DownloadSection from '@/components/DownloadSection'

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      <Header />
      <Hero />
      <FeaturesSection />
      <DownloadSection />
      <Footer />
    </main>
  )
}
