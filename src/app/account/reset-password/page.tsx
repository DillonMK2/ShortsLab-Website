'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import Button from '@/components/Button'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/account')
      }, 2000)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background relative">
        <BackgroundAnimation />
        <Header />

        <section className="pt-32 pb-24 px-6 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-400"
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
              </div>
              <h1 className="text-2xl font-sora font-bold mb-4">
                Password <span className="gradient-text">Updated</span>
              </h1>
              <p className="text-white/60">
                Your password has been changed successfully. Redirecting to account...
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      <Header />

      <section className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="glass rounded-2xl p-8">
            <h1 className="text-2xl font-sora font-bold text-center mb-2">
              Reset <span className="gradient-text">Password</span>
            </h1>
            <p className="text-white/60 text-center mb-8">
              Enter your new password below
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-violet/50 focus:border-accent-violet/50 transition-all"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent-violet/50 focus:border-accent-violet/50 transition-all"
                  placeholder="Confirm your password"
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
