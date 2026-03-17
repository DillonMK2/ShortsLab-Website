'use client'

import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

interface FeatureDetailProps {
  id: string
  title: string
  description: string
  bullets: string[]
  icon: string
  reversed?: boolean
}

export default function FeatureDetailSection({
  id,
  title,
  description,
  bullets,
  icon,
  reversed = false,
}: FeatureDetailProps) {
  return (
    <section id={id} className={`py-20 ${reversed ? 'bg-secondary/30' : ''} scroll-mt-20`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
          {/* Icon/Visual */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              {/* Gradient glow behind icon */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 blur-2xl" />
              <motion.div
                className="relative w-32 h-32 rounded-2xl glass-gradient flex items-center justify-center text-5xl shadow-glow-gradient"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {icon}
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1"
          >
            <GlassCard className="p-8" hover={false}>
              <h2 className="text-3xl font-sora font-bold mb-4">
                <span className="gradient-text">{title}</span>
              </h2>
              <p className="text-white/60 text-lg mb-6 leading-relaxed">
                {description}
              </p>
              <ul className="space-y-3">
                {bullets.map((bullet, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5"
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
                    <span className="text-white/70">{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
