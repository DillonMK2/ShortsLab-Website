'use client'

import { motion } from 'framer-motion'
import GlassCard from './GlassCard'

interface TeamCardProps {
  name: string
  role: string
  bio: string
  initial: string
}

export default function TeamCard({ name, role, bio, initial }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard className="p-6 text-center group">
        {/* Avatar with gradient */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-20 h-20 mx-auto mb-4"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-violet/30 to-accent-cyan/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 border border-white/10 flex items-center justify-center group-hover:border-accent-violet/30 transition-colors">
            <span className="text-2xl font-sora font-bold gradient-text">
              {initial}
            </span>
          </div>
        </motion.div>

        <h3 className="text-lg font-sora font-semibold mb-1 group-hover:gradient-text transition-all duration-300">{name}</h3>
        <p className="text-accent-cyan/80 text-sm mb-4">{role}</p>
        <p className="text-white/60 text-sm leading-relaxed">{bio}</p>
      </GlassCard>
    </motion.div>
  )
}
