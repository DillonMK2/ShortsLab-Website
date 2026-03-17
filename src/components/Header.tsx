'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import { useUser } from '@/hooks/useUser'

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const ticking = useRef(false)
  const router = useRouter()
  const { user, loading, signOut } = useUser()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        ticking.current = false
      })
      ticking.current = true
    }
  }, [])

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-out
        ${
          scrolled
            ? 'bg-background/80 backdrop-blur-[12px] border-b border-white/[0.05] shadow-lg shadow-accent-violet/5'
            : 'bg-transparent'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-sora font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity relative group"
        >
          <span className="relative z-10">Shorts</span>
          <span className="relative z-10 gradient-text">Lab</span>
          <span className="absolute -inset-2 rounded-lg bg-gradient-to-r from-accent-violet/0 to-accent-cyan/0 group-hover:from-accent-violet/10 group-hover:to-accent-cyan/10 transition-all duration-300" aria-hidden="true" />
        </Link>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-violet to-accent-cyan transition-all duration-300 group-hover:w-full" aria-hidden="true" />
            </Link>
          ))}
        </div>

        {/* CTA + Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Button href="/account" size="sm" variant="secondary">
                      Account
                    </Button>
                    <Button onClick={handleSignOut} size="sm" variant="secondary">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button href="/login" size="sm" variant="secondary">
                      Sign In
                    </Button>
                    <Button href="/signup" size="sm" variant="gradient">
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg glass hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-5 h-4 flex flex-col justify-between" aria-hidden="true">
              <motion.span
                animate={{
                  rotate: mobileMenuOpen ? 45 : 0,
                  y: mobileMenuOpen ? 7 : 0,
                }}
                className="w-full h-0.5 bg-white rounded-full origin-center"
              />
              <motion.span
                animate={{
                  opacity: mobileMenuOpen ? 0 : 1,
                  x: mobileMenuOpen ? 10 : 0,
                }}
                className="w-full h-0.5 bg-white rounded-full"
              />
              <motion.span
                animate={{
                  rotate: mobileMenuOpen ? -45 : 0,
                  y: mobileMenuOpen ? -7 : 0,
                }}
                className="w-full h-0.5 bg-white rounded-full origin-center"
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white/80 hover:text-white transition-colors text-lg font-medium py-2"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-4 space-y-3"
              >
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Button
                          href="/account"
                          variant="secondary"
                          className="w-full justify-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Account
                        </Button>
                        <Button
                          onClick={() => {
                            handleSignOut()
                            setMobileMenuOpen(false)
                          }}
                          variant="secondary"
                          className="w-full justify-center"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          href="/login"
                          variant="secondary"
                          className="w-full justify-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign In
                        </Button>
                        <Button
                          href="/signup"
                          variant="gradient"
                          className="w-full justify-center"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Button>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
