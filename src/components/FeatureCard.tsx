'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface FeatureCardProps {
  iconPath: string
  title: string
  description: string
  index?: number
  href?: string
}

export default function FeatureCard({
  iconPath,
  title,
  description,
  index = 0,
  href = '/features',
}: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(springY, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-5deg', '5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <Link href={href} className="block w-full h-full">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full group cursor-pointer overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
      {/* Gradient hover effect - contained within the card */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-violet/0 via-accent-cyan/0 to-accent-violet/0 group-hover:from-accent-violet/30 group-hover:via-accent-cyan/30 group-hover:to-accent-violet/30 group-focus-visible:from-accent-violet/30 group-focus-visible:via-accent-cyan/30 group-focus-visible:to-accent-violet/30 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500"
        aria-hidden="true"
      />

      {/* Card content */}
      <div className="relative h-full rounded-2xl p-6 transition-all duration-300 bg-white/[0.03] backdrop-blur-[12px] border border-white/10 group-hover:bg-white/[0.08] group-hover:border-white/20 group-focus-visible:bg-white/[0.08] group-focus-visible:border-white/20 group-hover:shadow-glow-gradient group-focus-visible:shadow-glow-gradient">
        {/* Icon with gradient glow */}
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-accent-violet/20 group-hover:to-accent-cyan/20 group-focus-visible:bg-gradient-to-br group-focus-visible:from-accent-violet/20 group-focus-visible:to-accent-cyan/20 transition-all duration-300">
            <div className="text-white/80 group-hover:text-white group-focus-visible:text-white transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
              </svg>
            </div>
          </div>
          {/* Subtle glow behind icon */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-violet/0 to-accent-cyan/0 group-hover:from-accent-violet/20 group-hover:to-accent-cyan/20 blur-xl transition-all duration-300 -z-10"
            aria-hidden="true"
          />
        </div>

        <h3 className="font-sora font-semibold text-xl mb-2 text-white group-hover:gradient-text group-focus-visible:gradient-text transition-all duration-300">
          {title}
        </h3>

        <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/70 group-focus-visible:text-white/70 transition-colors">
          {description}
        </p>
      </div>
      </motion.div>
    </Link>
  )
}
