import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import PricingCard from '@/components/PricingCard'
import WaitlistForm from '@/components/WaitlistForm'

export const metadata: Metadata = {
  title: 'Pricing - ShortsLab | Starter & Pro Plans for YouTube Creators',
  description: 'ShortsLab pricing: Credit-based plans for YouTube creators. Starter at $15.99/mo or Pro at $34.99/mo with 7-day free trial.',
  keywords: 'ShortsLab pricing, YouTube tools pricing, credit system, pro features',
}

const starterTier = {
  title: 'Starter',
  price: '$15.99',
  description: 'Perfect for growing creators',
  credits: '500 credits/month',
  checkoutUrl: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_URL,
  features: [
    '500 credits per month',
    'AI Assistant access',
    'Track up to 5 competitor channels',
    'Basic channel analytics',
    'Script Scraper (50 scripts/month)',
    'VoiceLab with watermark',
    'Email support',
  ],
}

const proTier = {
  title: 'Pro',
  price: '$34.99',
  description: 'For serious YouTube creators',
  credits: '2,000 credits/month',
  trial: '7-day free trial',
  checkoutUrl: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_URL,
  features: [
    '2,000 credits per month',
    'Unlimited AI Assistant usage',
    'Unlimited competitor tracking',
    'Advanced analytics & niche scoring',
    'Unlimited Script Scraper',
    'Full Script Rewriter with style profiles',
    'VoiceLab without watermark',
    'Priority support',
    'Early access to new features',
  ],
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      <Header />

      <section className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-gradient text-accent-violet mb-6">
              Pricing
            </span>
            <h1 className="mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Credit-based pricing that scales with your needs. Try Pro free for 7 days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <PricingCard {...starterTier} />
            <PricingCard {...proTier} highlighted />
          </div>

          <WaitlistForm />

          <div className="mt-16 text-center">
            <p className="text-white/40 text-sm">
              Pricing is subject to change. Current users will be notified before any changes.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
