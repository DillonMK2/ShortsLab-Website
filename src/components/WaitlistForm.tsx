'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Gradient border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-accent-violet/30 via-accent-cyan/30 to-accent-violet/30 blur-[1px]" />

      <div className="relative glass-gradient rounded-2xl p-8">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-sora font-semibold mb-2 gradient-text">You&apos;re on the list!</h3>
              <p className="text-white/60 text-sm">
                We&apos;ll notify you when Pro pricing is available.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="text-xl font-sora font-semibold mb-2 text-center">
                Join the <span className="gradient-text">Waitlist</span>
              </h3>
              <p className="text-white/60 text-sm text-center mb-6">
                Be the first to know when Pro is available.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-violet/50 focus:ring-1 focus:ring-accent-violet/20 transition-all"
                />
                <Button type="submit" variant="gradient">
                  Join Waitlist
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
