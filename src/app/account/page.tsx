'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import { useUser } from '@/hooks/useUser'
import { useSubscription } from '@/hooks/useSubscription'
import { createClient } from '@/lib/supabase/client'

export default function AccountPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const { subscription, loading: subLoading, isActive, isPro, isStarter } = useSubscription()
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
    }
  }, [user, userLoading, router])

  const handlePasswordReset = async () => {
    if (!user?.email) return

    setResetLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    })

    if (error) {
      alert('Error sending reset email: ' + error.message)
    } else {
      setResetSent(true)
      setShowResetConfirm(false)
    }
    setResetLoading(false)
  }

  if (userLoading || subLoading) {
    return (
      <main className="min-h-screen bg-background relative">
        <BackgroundAnimation />
        <Header />
        <section className="pt-32 pb-24 px-6 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-white/60">Loading...</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!user) return null

  const getPlanBadgeColor = () => {
    if (isPro) return 'bg-accent-violet/20 text-accent-violet border-accent-violet/30'
    if (isStarter) return 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30'
    return 'bg-white/10 text-white/60 border-white/20'
  }

  const getPlanName = () => {
    if (!subscription) return 'Free'
    return subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)
  }

  const getStatusBadge = () => {
    if (!subscription) return null

    const statusColors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      on_trial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      past_due: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      paused: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      inactive: 'bg-white/10 text-white/40 border-white/20',
    }

    const statusLabels: Record<string, string> = {
      active: 'Active',
      on_trial: 'Trial',
      cancelled: 'Cancelled',
      past_due: 'Past Due',
      paused: 'Paused',
      inactive: 'Inactive',
    }

    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[subscription.status]}`}>
        {statusLabels[subscription.status]}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-background relative">
      <BackgroundAnimation />
      <Header />

      <section className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-sora font-bold mb-2">
            Account <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-white/60 mb-8">Manage your account and subscription</p>

          {/* Profile Card */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-sora font-semibold mb-4">Profile</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Email</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">User ID</span>
                <span className="text-white/40 text-sm font-mono">{user.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-sora font-semibold mb-4">Subscription</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Current Plan</span>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPlanBadgeColor()}`}>
                    {getPlanName()}
                  </span>
                  {getStatusBadge()}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/60">Credits</span>
                <span className="text-white font-semibold">
                  {subscription?.credits ?? 0}
                  <span className="text-white/40 font-normal ml-1">
                    / {isPro ? '2,000' : isStarter ? '500' : '0'}
                  </span>
                </span>
              </div>

              {subscription?.status === 'on_trial' && subscription.trial_ends_at && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Trial Ends</span>
                  <span className="text-yellow-400">{formatDate(subscription.trial_ends_at)}</span>
                </div>
              )}

              {subscription?.current_period_end && isActive && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Next Billing</span>
                  <span className="text-white">{formatDate(subscription.current_period_end)}</span>
                </div>
              )}

              {!isActive && (
                <div className="pt-4 border-t border-white/10">
                  <a
                    href="/pricing"
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-accent-violet to-accent-cyan hover:opacity-90 transition-opacity"
                  >
                    Upgrade Plan
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-sora font-semibold mb-4">Security</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white">Password</p>
                <p className="text-white/60 text-sm">Change your account password</p>
              </div>
              {resetSent ? (
                <span className="text-accent-cyan text-sm">Check your email!</span>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 text-sm font-medium text-white border border-white/20 rounded-xl hover:bg-white/5 transition-colors"
                >
                  Change Password
                </button>
              )}
            </div>

            {/* Confirmation Dialog */}
            {showResetConfirm && (
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-white/80 text-sm mb-4">
                  We&apos;ll send a password reset link to <span className="text-white">{user?.email}</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handlePasswordReset}
                    disabled={resetLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-accent-violet rounded-lg hover:bg-accent-violet/80 transition-colors disabled:opacity-50"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="glass rounded-2xl p-6 border border-red-500/20">
            <h2 className="text-lg font-sora font-semibold mb-4 text-red-400">Danger Zone</h2>
            <p className="text-white/60 text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
              onClick={() => alert('Contact support to delete your account')}
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
