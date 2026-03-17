'use client'

import { motion } from 'framer-motion'
import Button from './Button'
import { useUser } from '@/hooks/useUser'

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  credits?: string
  highlighted?: boolean
  trial?: string
  checkoutUrl?: string
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  credits,
  highlighted = false,
  trial,
  checkoutUrl,
}: PricingCardProps) {
  const { user } = useUser()

  // Build checkout URL with email pre-fill and user_id for webhook
  const getCheckoutHref = () => {
    if (!checkoutUrl) return '/signup'

    const url = new URL(checkoutUrl)

    // Pre-fill email if user is logged in
    if (user?.email) {
      url.searchParams.set('checkout[email]', user.email)
    }

    // Pass user_id as custom data for webhook
    if (user?.id) {
      url.searchParams.set('checkout[custom][user_id]', user.id)
    }

    // Redirect back to site after checkout
    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/?subscribed=true`
      : ''
    if (redirectUrl) {
      url.searchParams.set('checkout[redirect_url]', redirectUrl)
    }

    return url.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="relative group"
    >
      {/* Gradient border for highlighted card */}
      {highlighted && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-accent-violet via-accent-cyan to-accent-violet opacity-50 blur-[1px]" />
      )}

      <div
        className={`
          relative glass rounded-2xl p-8 h-full
          ${highlighted ? 'ring-1 ring-white/20' : ''}
        `}
      >
        {trial && (
          <span className="absolute top-4 right-4 text-xs font-sora font-semibold text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full">
            {trial}
          </span>
        )}

        <h3 className="text-2xl font-sora font-bold mb-2">
          {highlighted ? <span className="gradient-text">{title}</span> : title}
        </h3>
        <p className="text-white/50 text-sm mb-6">{description}</p>

        <div className="mb-8">
          <span className={`text-4xl font-sora font-bold ${highlighted ? 'gradient-text' : ''}`}>
            {price}
          </span>
          <span className="text-white/50 text-sm">/month</span>
          {trial && (
            <p className="text-accent-cyan text-xs mt-2">Auto-renews after trial</p>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 text-sm text-white/70"
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${highlighted ? 'text-accent-cyan' : 'text-white/50'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </motion.li>
          ))}
        </ul>

        <Button
          href={getCheckoutHref()}
          variant={highlighted ? 'gradient' : 'primary'}
          className="w-full justify-center"
          glow={highlighted}
          target={checkoutUrl ? '_blank' : undefined}
          rel={checkoutUrl ? 'noopener noreferrer' : undefined}
        >
          {trial ? 'Start Free Trial' : 'Get Started'}
        </Button>
      </div>
    </motion.div>
  )
}
