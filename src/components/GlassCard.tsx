import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  gradient = false,
}: GlassCardProps) {
  const baseClasses = `
    backdrop-blur-[12px]
    rounded-2xl
    relative
    ${gradient ? 'glass-gradient' : 'bg-white/[0.03] border border-white/[0.08]'}
    ${hover ? 'transition-all duration-300 ease-out hover:bg-white/[0.06] hover:border-white/[0.12] hover:scale-[1.01]' : ''}
    ${className}
  `

  return (
    <div className={baseClasses}>
      {gradient && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-accent-violet/20 via-accent-cyan/10 to-accent-violet/20 opacity-0 group-hover:opacity-100 transition-opacity blur-[1px] -z-10" />
      )}
      {children}
    </div>
  )
}
