'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BackgroundAnimation from '@/components/BackgroundAnimation'

type Subscription = {
  user_id: string
  plan: string
  status: string
  credits: number
  trial_ends_at: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

type UserResult = {
  user_id: string
  email: string
  created_at: string
  subscription: Subscription | null
}

type EditingState = {
  credits: string
  plan: string
  status: string
}

type UsageData = {
  totals: {
    today: number
    week: number
    month: number
  }
  featureBreakdown: Record<string, number>
  topUsers: { user_id: string; email: string; credits_used: number }[]
  dailyData: { date: string; count: number }[]
}

type Tab = 'users' | 'usage'

export default function AdminPanel({ userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('users')

  // User management state
  const [searchEmail, setSearchEmail] = useState('')
  const [users, setUsers] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Record<string, EditingState>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [successMsg, setSuccessMsg] = useState<Record<string, string>>({})

  // Usage state
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)
  const [usageError, setUsageError] = useState<string | null>(null)

  // Fetch usage data when tab changes to usage
  useEffect(() => {
    if (activeTab === 'usage' && !usageData) {
      fetchUsageData()
    }
  }, [activeTab, usageData])

  const fetchUsageData = async () => {
    setUsageLoading(true)
    setUsageError(null)

    try {
      const res = await fetch('/api/admin/usage')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch usage data')
      }

      setUsageData(data)
    } catch (err) {
      setUsageError(err instanceof Error ? err.message : 'Failed to fetch usage data')
    } finally {
      setUsageLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchEmail.length < 3) {
      setError('Please enter at least 3 characters')
      return
    }

    setLoading(true)
    setError(null)
    setUsers([])

    try {
      const res = await fetch(`/api/admin/search?email=${encodeURIComponent(searchEmail)}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setUsers(data.users)

      // Initialize editing state for each user
      const editState: Record<string, EditingState> = {}
      data.users.forEach((u: UserResult) => {
        editState[u.user_id] = {
          credits: u.subscription?.credits?.toString() || '0',
          plan: u.subscription?.plan || 'free',
          status: u.subscription?.status || 'active',
        }
      })
      setEditing(editState)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (userId: string, field: 'credits' | 'plan' | 'status') => {
    const state = editing[userId]
    if (!state) return

    setSaving(prev => ({ ...prev, [userId]: true }))
    setSuccessMsg(prev => ({ ...prev, [userId]: '' }))

    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          [field]: state[field],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Update failed')
      }

      // Update local state with the new subscription data
      setUsers(prev =>
        prev.map(u =>
          u.user_id === userId
            ? { ...u, subscription: data.subscription }
            : u
        )
      )

      setSuccessMsg(prev => ({ ...prev, [userId]: `${field} updated!` }))
      setTimeout(() => {
        setSuccessMsg(prev => ({ ...prev, [userId]: '' }))
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(prev => ({ ...prev, [userId]: false }))
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'text-green-400',
      on_trial: 'text-yellow-400',
      cancelled: 'text-red-400',
      inactive: 'text-white/40',
    }
    return colors[status] || 'text-white/60'
  }

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      pro: 'text-accent-violet',
      starter: 'text-accent-cyan',
      free: 'text-white/60',
    }
    return colors[plan] || 'text-white/60'
  }

  const featureLabels: Record<string, string> = {
    chat: 'AI Chat',
    rewrite: 'Script Rewrite',
    voiceover: 'Voiceover Generation',
    research: 'Research Queries',
  }

  const featureColors: Record<string, string> = {
    chat: 'from-violet-500 to-purple-500',
    rewrite: 'from-cyan-500 to-blue-500',
    voiceover: 'from-pink-500 to-rose-500',
    research: 'from-amber-500 to-orange-500',
  }

  return (
    <main className="min-h-screen bg-background relative">
      <BackgroundAnimation />

      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-sm font-medium">Back to site</span>
                </Link>
              </div>
              <h1 className="text-4xl font-sora font-bold mb-3">
                Admin <span className="gradient-text">Panel</span>
              </h1>
              <p className="text-white/50">Logged in as <span className="text-white/70">{userEmail}</span></p>
            </div>
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
              src="/DarkThemeLogo.png"
              alt="ShortsFlow"
              width={140}
              height={26}
              className="h-7 w-auto"
            />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mb-10">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-accent-violet to-accent-cyan text-white shadow-lg shadow-accent-violet/25'
                  : 'glass text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium transition-all ${
                activeTab === 'usage'
                  ? 'bg-gradient-to-r from-accent-violet to-accent-cyan text-white shadow-lg shadow-accent-violet/25'
                  : 'glass text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Usage
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <>
              {/* Search Form */}
              <div className="glass rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-violet/5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Search Users</h2>
                    <p className="text-white/40 text-sm">Find and manage user subscriptions</p>
                  </div>
                </div>
                <form onSubmit={handleSearch} className="flex gap-4">
                  <div className="flex-1 relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="text"
                      value={searchEmail}
                      onChange={e => setSearchEmail(e.target.value)}
                      placeholder="Enter email address..."
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-violet to-accent-cyan text-white font-medium rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-accent-violet/25 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Searching...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Error Message */}
              {error && (
                <div className="glass rounded-2xl p-5 mb-8 border border-red-500/30 bg-red-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-400 font-medium">Error</p>
                      <p className="text-red-400/70 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results */}
              {users.length > 0 && (
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Search Results
                      <span className="ml-3 text-sm font-normal text-white/40">
                        {users.length} user{users.length !== 1 ? 's' : ''} found
                      </span>
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-8 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Plan</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Credits</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Trial Ends</th>
                          <th className="px-8 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map(user => (
                          <tr key={user.user_id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet/30 to-accent-cyan/30 flex items-center justify-center text-white font-semibold">
                                  {user.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{user.email}</p>
                                  <p className="text-white/30 text-xs font-mono mt-0.5">{user.user_id.slice(0, 12)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <select
                                value={editing[user.user_id]?.plan || 'free'}
                                onChange={e =>
                                  setEditing(prev => ({
                                    ...prev,
                                    [user.user_id]: { ...prev[user.user_id], plan: e.target.value },
                                  }))
                                }
                                className={`bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-accent-violet/50 cursor-pointer transition-colors ${getPlanColor(editing[user.user_id]?.plan || 'free')}`}
                              >
                                <option value="free" className="bg-background text-white">Free</option>
                                <option value="starter" className="bg-background text-white">Starter</option>
                                <option value="pro" className="bg-background text-white">Pro</option>
                              </select>
                            </td>
                            <td className="px-6 py-5">
                              <select
                                value={editing[user.user_id]?.status || 'active'}
                                onChange={e =>
                                  setEditing(prev => ({
                                    ...prev,
                                    [user.user_id]: { ...prev[user.user_id], status: e.target.value },
                                  }))
                                }
                                className={`bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-accent-violet/50 cursor-pointer transition-colors ${getStatusColor(editing[user.user_id]?.status || 'active')}`}
                              >
                                <option value="active" className="bg-background text-white">Active</option>
                                <option value="inactive" className="bg-background text-white">Inactive</option>
                                <option value="on_trial" className="bg-background text-white">On Trial</option>
                                <option value="cancelled" className="bg-background text-white">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-6 py-5">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={editing[user.user_id]?.credits || '0'}
                                  onChange={e =>
                                    setEditing(prev => ({
                                      ...prev,
                                      [user.user_id]: { ...prev[user.user_id], credits: e.target.value },
                                    }))
                                  }
                                  className="w-28 bg-white/[0.03] border border-white/10 rounded-lg pl-4 pr-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-accent-violet/50 transition-colors"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-white/50 text-sm">
                                {formatDate(user.subscription?.trial_ends_at || null)}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    handleUpdate(user.user_id, 'credits')
                                    handleUpdate(user.user_id, 'plan')
                                    handleUpdate(user.user_id, 'status')
                                  }}
                                  disabled={saving[user.user_id]}
                                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-accent-violet/20 border border-accent-violet/30 rounded-lg hover:bg-accent-violet/30 hover:border-accent-violet/50 transition-all disabled:opacity-50"
                                >
                                  {saving[user.user_id] ? (
                                    <>
                                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                      </svg>
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Save
                                    </>
                                  )}
                                </button>
                                {successMsg[user.user_id] && (
                                  <span className="flex items-center gap-1.5 text-green-400 text-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {successMsg[user.user_id]}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {users.length === 0 && !loading && !error && (
                <div className="glass rounded-2xl p-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Search for Users</h3>
                  <p className="text-white/40 max-w-md mx-auto">
                    Enter an email address above to find users and manage their subscriptions, credits, and account status.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Usage Tab */}
          {activeTab === 'usage' && (
            <>
              {usageLoading && (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin mb-4" />
                  <p className="text-white/60">Loading usage data...</p>
                </div>
              )}

              {usageError && (
                <div className="glass rounded-2xl p-4 mb-6 border border-red-500/30 bg-red-500/10">
                  <p className="text-red-400">{usageError}</p>
                  <button
                    onClick={fetchUsageData}
                    className="mt-2 text-sm text-accent-violet hover:underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {usageData && (
                <div className="space-y-8">
                  {/* Totals */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass rounded-2xl p-8 relative overflow-hidden group hover:border-accent-violet/30 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-violet/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-violet/5 flex items-center justify-center">
                            <svg className="w-6 h-6 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-white/60 font-medium">Today</p>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{usageData.totals.today.toLocaleString()}</p>
                        <p className="text-white/40 text-sm">API calls</p>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-8 relative overflow-hidden group hover:border-accent-cyan/30 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-cyan/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 flex items-center justify-center">
                            <svg className="w-6 h-6 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-white/60 font-medium">This Week</p>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{usageData.totals.week.toLocaleString()}</p>
                        <p className="text-white/40 text-sm">API calls</p>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-8 relative overflow-hidden group hover:border-green-500/30 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <p className="text-white/60 font-medium">This Month</p>
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{usageData.totals.month.toLocaleString()}</p>
                        <p className="text-white/40 text-sm">API calls</p>
                      </div>
                    </div>
                  </div>

                  {/* Feature Breakdown */}
                  <div className="glass rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Usage by Feature</h3>
                      <span className="text-white/40 text-sm">This Month</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(usageData.featureBreakdown).map(([feature, count]) => {
                        const total = Object.values(usageData.featureBreakdown).reduce((a, b) => a + b, 0)
                        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
                        return (
                          <div key={feature} className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-2xl p-6 transition-all hover:scale-[1.02]">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${featureColors[feature]} flex items-center justify-center mb-5 shadow-lg`}>
                              <span className="text-2xl">
                                {feature === 'chat' && '💬'}
                                {feature === 'rewrite' && '✍️'}
                                {feature === 'voiceover' && '🎙️'}
                                {feature === 'research' && '🔍'}
                              </span>
                            </div>
                            <p className="text-white/50 text-sm font-medium mb-2">{featureLabels[feature]}</p>
                            <p className="text-3xl font-bold text-white mb-1">{count.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${featureColors[feature]} rounded-full transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-white/40 text-sm font-medium">{percentage}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Line Chart - Daily API Calls */}
                  <div className="glass rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Daily API Calls</h3>
                      <span className="text-white/40 text-sm">Last 30 Days</span>
                    </div>
                    <div className="h-72 relative">
                      {usageData.dailyData.length > 0 && (
                        <SimpleLineChart data={usageData.dailyData} />
                      )}
                      {usageData.dailyData.every(d => d.count === 0) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-white/40">No usage data available yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Users */}
                  <div className="glass rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Top Users by Credit Usage</h3>
                      <span className="text-white/40 text-sm">This Month</span>
                    </div>
                    {usageData.topUsers.length > 0 ? (
                      <div className="overflow-x-auto -mx-8 px-8">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="px-4 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Rank</th>
                              <th className="px-4 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">User</th>
                              <th className="px-4 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Credits Used</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {usageData.topUsers.map((user, index) => (
                              <tr key={user.user_id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-5">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                    index === 2 ? 'bg-amber-600/20 text-amber-500' :
                                    'bg-white/5 text-white/40'
                                  }`}>
                                    {index + 1}
                                  </div>
                                </td>
                                <td className="px-4 py-5">
                                  <p className="text-white font-medium">{user.email}</p>
                                  <p className="text-white/30 text-xs font-mono mt-1">{user.user_id.slice(0, 12)}...</p>
                                </td>
                                <td className="px-4 py-5 text-right">
                                  <span className="text-white font-semibold text-lg">{user.credits_used.toLocaleString()}</span>
                                  <span className="text-white/40 text-sm ml-1">credits</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <p className="text-white/40">No usage data available yet</p>
                      </div>
                    )}
                  </div>

                  {/* Refresh Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={fetchUsageData}
                      disabled={usageLoading}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
                    >
                      <svg className={`w-4 h-4 ${usageLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {usageLoading ? 'Refreshing...' : 'Refresh Data'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}

// Simple SVG line chart component
function SimpleLineChart({ data }: { data: { date: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count), 1)
  const width = 100
  const height = 100
  const padding = 8

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
    const y = height - padding - (d.count / maxCount) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`

  // Get labels for x-axis (every 7 days)
  const xLabels = data.filter((_, i) => i % 7 === 0 || i === data.length - 1)

  // Calculate Y-axis values
  const yAxisValues = [0, Math.round(maxCount * 0.5), maxCount]

  return (
    <div className="w-full h-full flex">
      {/* Y-axis labels */}
      <div className="flex flex-col justify-between py-2 pr-4 text-right">
        {yAxisValues.reverse().map((val, i) => (
          <span key={i} className="text-xs text-white/30 font-medium tabular-nums">
            {val.toLocaleString()}
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full flex-1"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + ratio * (height - 2 * padding)}
              x2={width - padding}
              y2={padding + ratio * (height - 2 * padding)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
              strokeDasharray={ratio === 0 || ratio === 1 ? "0" : "2,2"}
            />
          ))}

          {/* Area fill */}
          <polygon
            points={areaPoints}
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#glow)"
          />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between pt-4 text-xs text-white/30 font-medium">
          {xLabels.map((d, i) => (
            <span key={i} className="tabular-nums">
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
