'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Orb {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  opacity: number
  color: 'violet' | 'cyan' | 'purple'
  phase: number
}

const COLORS = {
  violet: { r: 139, g: 92, b: 246 },
  cyan: { r: 6, g: 182, b: 212 },
  purple: { r: 168, g: 85, b: 247 },
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const isVisibleRef = useRef(true)
  const orbsRef = useRef<Orb[]>([])
  const timeRef = useRef(0)

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const animate = useCallback(() => {
    if (!isVisibleRef.current) {
      animationRef.current = null
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    timeRef.current += 0.01

    orbsRef.current.forEach((orb) => {
      const wobbleX = Math.sin(timeRef.current + orb.phase) * 0.5
      const wobbleY = Math.cos(timeRef.current + orb.phase * 1.3) * 0.5

      orb.x += orb.vx + wobbleX
      orb.y += orb.vy + wobbleY

      if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius
      if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius
      if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius
      if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius

      const pulseOpacity = orb.opacity * (0.8 + Math.sin(timeRef.current * 0.5 + orb.phase) * 0.2)
      const color = COLORS[orb.color]
      const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)

      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulseOpacity})`)
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulseOpacity * 0.4})`)
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)

      ctx.beginPath()
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  const startAnimation = useCallback(() => {
    if (!animationRef.current && isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Initialize canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    // Initialize orbs
    const colorKeys: ('violet' | 'cyan' | 'purple')[] = ['violet', 'cyan', 'purple']
    orbsRef.current = []
    for (let i = 0; i < 6; i++) {
      orbsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 200 + Math.random() * 300,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: 0.03 + Math.random() * 0.04,
        color: colorKeys[i % 3],
        phase: Math.random() * Math.PI * 2,
      })
    }

    // If user prefers reduced motion, draw static orbs and return
    if (prefersReducedMotion) {
      orbsRef.current.forEach((orb) => {
        const color = COLORS[orb.color]
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${orb.opacity})`)
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${orb.opacity * 0.4})`)
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      window.addEventListener('resize', resize)
      return () => {
        window.removeEventListener('resize', resize)
      }
    }

    // Visibility change handler (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false
        stopAnimation()
      } else {
        isVisibleRef.current = true
        startAnimation()
      }
    }

    // Intersection Observer (scroll visibility)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisibleRef.current = true
            startAnimation()
          } else {
            isVisibleRef.current = false
            stopAnimation()
          }
        })
      },
      { threshold: 0.1 }
    )

    // Event listeners
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    observer.observe(canvas)

    // Start animation
    startAnimation()

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()
      stopAnimation()
      orbsRef.current = []
    }
  }, [startAnimation, stopAnimation])

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.7 }}
      />
    </>
  )
}
