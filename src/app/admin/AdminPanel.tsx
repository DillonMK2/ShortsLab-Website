'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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
  hasPrivateVoiceAccess: boolean
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

type ReferenceChannel = {
  name: string
  url: string
}

type Niche = {
  id: string
  name: string
  category: string
  heat: string
  competition: string
  content_style: string | null
  description: string | null
  how_to_start: string | null
  where_to_find_ideas: string | null
  example_hooks: string[]
  reference_channels: ReferenceChannel[]
  estimated_views_28d: string | null
  posting_frequency: string | null
  publish_date: string
  created_at: string
  updated_at: string
}

type NicheFormData = {
  name: string
  category: string
  heat: string
  competition: string
  content_style: string
  description: string
  how_to_start: string
  where_to_find_ideas: string
  example_hooks: string
  reference_channels: ReferenceChannel[]
  estimated_views: string
  posting_frequency: string
  publish_date: string
}

const INITIAL_NICHE_FORM: NicheFormData = {
  name: '',
  category: 'Entertainment',
  heat: 'rising',
  competition: 'medium',
  content_style: '',
  description: '',
  how_to_start: '',
  where_to_find_ideas: '',
  example_hooks: '',
  reference_channels: [],
  estimated_views: '',
  posting_frequency: '',
  publish_date: new Date().toISOString().split('T')[0],
}

type Tab = 'users' | 'usage' | 'niches'

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
  const [togglingUnlimited, setTogglingUnlimited] = useState<Record<string, boolean>>({})
  const [pendingChanges, setPendingChanges] = useState<Record<string, NodeJS.Timeout>>({})
  const [togglingPrivateVoice, setTogglingPrivateVoice] = useState<Record<string, boolean>>({})

  // Use ref to track latest editing values (avoids stale closure issues)
  const editingRef = useRef<Record<string, EditingState>>({})
  editingRef.current = editing

  // Force scrollbar to always show to prevent layout shift between tabs
  useEffect(() => {
    document.documentElement.style.overflowY = 'scroll'
    return () => {
      document.documentElement.style.overflowY = ''
    }
  }, [])

  // Usage state
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [usageLoading, setUsageLoading] = useState(false)
  const [usageError, setUsageError] = useState<string | null>(null)

  // Niches state
  const [niches, setNiches] = useState<Niche[]>([])
  const [nichesLoading, setNichesLoading] = useState(false)
  const [nichesError, setNichesError] = useState<string | null>(null)
  const [nicheForm, setNicheForm] = useState<NicheFormData>(INITIAL_NICHE_FORM)
  const [editingNicheId, setEditingNicheId] = useState<string | null>(null)
  const [nicheSaving, setNicheSaving] = useState(false)
  const [nicheSuccess, setNicheSuccess] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch recent users when tab changes to users
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      fetchRecentUsers()
    }
  }, [activeTab, users.length])

  // Fetch usage data when tab changes to usage
  useEffect(() => {
    if (activeTab === 'usage' && !usageData) {
      fetchUsageData()
    }
  }, [activeTab, usageData])

  // Fetch niches when tab changes to niches
  useEffect(() => {
    if (activeTab === 'niches' && niches.length === 0) {
      fetchNiches()
    }
  }, [activeTab, niches.length])

  const fetchRecentUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/search?recent=true')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch users')
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
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

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

  const fetchNiches = async () => {
    setNichesLoading(true)
    setNichesError(null)

    try {
      const res = await fetch('/api/admin/niches')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch niches')
      }

      setNiches(data.niches)
    } catch (err) {
      setNichesError(err instanceof Error ? err.message : 'Failed to fetch niches')
    } finally {
      setNichesLoading(false)
    }
  }

  const handleNicheSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNicheSaving(true)
    setNichesError(null)
    setNicheSuccess(null)

    try {
      const payload = {
        ...nicheForm,
        example_hooks: nicheForm.example_hooks
          .split('\n')
          .map(h => h.trim())
          .filter(h => h.length > 0),
        reference_channels: nicheForm.reference_channels.filter(c => c.name.trim() && c.url.trim()),
        publish_date: new Date(nicheForm.publish_date).toISOString(),
      }

      const url = editingNicheId
        ? `/api/admin/niches/${editingNicheId}`
        : '/api/admin/niches'
      const method = editingNicheId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save niche')
      }

      if (editingNicheId) {
        setNiches(prev => prev.map(n => n.id === editingNicheId ? data.niche : n))
        setNicheSuccess('Niche updated successfully!')
      } else {
        setNiches(prev => [data.niche, ...prev])
        setNicheSuccess('Niche created successfully!')
      }

      // Reset form
      setNicheForm(INITIAL_NICHE_FORM)
      setEditingNicheId(null)

      setTimeout(() => setNicheSuccess(null), 3000)
    } catch (err) {
      setNichesError(err instanceof Error ? err.message : 'Failed to save niche')
    } finally {
      setNicheSaving(false)
    }
  }

  const handleEditNiche = (niche: Niche) => {
    setEditingNicheId(niche.id)
    setNicheForm({
      name: niche.name,
      category: niche.category,
      heat: niche.heat,
      competition: niche.competition,
      content_style: niche.content_style || '',
      description: niche.description || '',
      how_to_start: niche.how_to_start || '',
      where_to_find_ideas: niche.where_to_find_ideas || '',
      example_hooks: niche.example_hooks?.join('\n') || '',
      reference_channels: niche.reference_channels || [],
      estimated_views: niche.estimated_views_28d || '',
      posting_frequency: niche.posting_frequency || '',
      publish_date: niche.publish_date.split('T')[0],
    })
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const addReferenceChannel = () => {
    setNicheForm(prev => ({
      ...prev,
      reference_channels: [...prev.reference_channels, { name: '', url: '' }]
    }))
  }

  const updateReferenceChannel = (index: number, field: 'name' | 'url', value: string) => {
    setNicheForm(prev => ({
      ...prev,
      reference_channels: prev.reference_channels.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      )
    }))
  }

  const removeReferenceChannel = (index: number) => {
    setNicheForm(prev => ({
      ...prev,
      reference_channels: prev.reference_channels.filter((_, i) => i !== index)
    }))
  }

  const handleDeleteNiche = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/niches/${id}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete niche')
      }

      setNiches(prev => prev.filter(n => n.id !== id))
      setDeleteConfirm(null)
      setNicheSuccess('Niche deleted successfully!')
      setTimeout(() => setNicheSuccess(null), 3000)
    } catch (err) {
      setNichesError(err instanceof Error ? err.message : 'Failed to delete niche')
    }
  }

  const handleCancelEdit = () => {
    setEditingNicheId(null)
    setNicheForm(INITIAL_NICHE_FORM)
  }

  const isPublished = (publishDate: string) => {
    return new Date(publishDate) <= new Date()
  }

  const getHeatColor = (heat: string) => {
    const colors: Record<string, string> = {
      exploding: 'text-red-400 bg-red-400/10',
      rising: 'text-orange-400 bg-orange-400/10',
      stable: 'text-green-400 bg-green-400/10',
      declining: 'text-blue-400 bg-blue-400/10',
    }
    return colors[heat] || 'text-white/60 bg-white/10'
  }

  const getCompetitionColor = (competition: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-400',
      medium: 'text-yellow-400',
      high: 'text-red-400',
    }
    return colors[competition] || 'text-white/60'
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // If search is empty, fetch recent users
    if (!searchEmail.trim()) {
      fetchRecentUsers()
      return
    }

    if (searchEmail.length < 3) {
      setError('Please enter at least 3 characters')
      return
    }

    setLoading(true)
    setError(null)

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

  const handleClearSearch = () => {
    setSearchEmail('')
    fetchRecentUsers()
  }

  const getDefaultCreditsForPlan = (plan: string): number => {
    switch (plan) {
      case 'pro': return 2000
      case 'starter': return 500
      default: return 0
    }
  }

  const handleToggleUnlimited = async (userId: string, currentCredits: number, plan: string) => {
    setTogglingUnlimited(prev => ({ ...prev, [userId]: true }))
    setSuccessMsg(prev => ({ ...prev, [userId]: '' }))

    // Clear any pending changes for this user to prevent race conditions
    if (pendingChanges[userId]) {
      clearTimeout(pendingChanges[userId])
      setPendingChanges(prev => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
    }

    try {
      // If currently unlimited (-1), reset to plan default. Otherwise, set to unlimited (-1)
      const newCredits = currentCredits === -1 ? getDefaultCreditsForPlan(plan) : -1
      const currentState = editing[userId]

      // Save ALL fields together to prevent race conditions
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          credits: newCredits.toString(),
          plan: currentState?.plan || plan,
          status: currentState?.status || 'active',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to toggle unlimited')
      }

      // Update local state
      setUsers(prev =>
        prev.map(u =>
          u.user_id === userId
            ? { ...u, subscription: data.subscription }
            : u
        )
      )

      // Re-sync editing state with saved data
      setEditing(prev => ({
        ...prev,
        [userId]: {
          credits: data.subscription?.credits?.toString() || '0',
          plan: data.subscription?.plan || 'free',
          status: data.subscription?.status || 'active',
        }
      }))

      setSuccessMsg(prev => ({
        ...prev,
        [userId]: newCredits === -1 ? 'Unlimited!' : 'Reverted'
      }))
      setTimeout(() => {
        setSuccessMsg(prev => ({ ...prev, [userId]: '' }))
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle unlimited')
    } finally {
      setTogglingUnlimited(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleTogglePrivateVoice = async (email: string, currentAccess: boolean) => {
    setTogglingPrivateVoice(prev => ({ ...prev, [email]: true }))

    try {
      const res = await fetch('/api/admin/private-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          enabled: !currentAccess,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to toggle private voice access')
      }

      // Update local state
      setUsers(prev =>
        prev.map(u =>
          u.email === email
            ? { ...u, hasPrivateVoiceAccess: !currentAccess }
            : u
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle private voice access')
    } finally {
      setTogglingPrivateVoice(prev => ({ ...prev, [email]: false }))
    }
  }

  const saveUserWithValues = async (userId: string, values: EditingState) => {
    setSaving(prev => ({ ...prev, [userId]: true }))
    setSuccessMsg(prev => ({ ...prev, [userId]: '' }))

    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          credits: values.credits,
          plan: values.plan,
          status: values.status,
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

      // Re-sync editing state with saved data
      setEditing(prev => ({
        ...prev,
        [userId]: {
          credits: data.subscription?.credits?.toString() || '0',
          plan: data.subscription?.plan || 'free',
          status: data.subscription?.status || 'active',
        }
      }))

      setSuccessMsg(prev => ({ ...prev, [userId]: 'Saved' }))
      setTimeout(() => {
        setSuccessMsg(prev => ({ ...prev, [userId]: '' }))
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleFieldChange = (userId: string, field: keyof EditingState, value: string) => {
    // Update local state immediately
    setEditing(prev => {
      const currentState = prev[userId] || { credits: '0', plan: 'free', status: 'active' }
      return {
        ...prev,
        [userId]: { ...currentState, [field]: value },
      }
    })

    // Clear any pending save for this user
    if (pendingChanges[userId]) {
      clearTimeout(pendingChanges[userId])
    }

    // Debounce the save (800ms delay) - read from ref to always get latest values
    const timeout = setTimeout(() => {
      const latestState = editingRef.current[userId]
      if (latestState) {
        saveUserWithValues(userId, latestState)
      }
      setPendingChanges(prev => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
    }, 800)

    setPendingChanges(prev => ({ ...prev, [userId]: timeout }))
  }

  const handleUpdate = async (userId: string) => {
    const state = editing[userId]
    if (!state) return
    await saveUserWithValues(userId, state)
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
            <button
              onClick={() => setActiveTab('niches')}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium transition-all ${
                activeTab === 'niches'
                  ? 'bg-gradient-to-r from-accent-violet to-accent-cyan text-white shadow-lg shadow-accent-violet/25'
                  : 'glass text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Niches
            </button>
          </div>

          {/* Tab Content Container - consistent width prevents layout shift */}
          <div className="min-h-[400px] w-full">
            <AnimatePresence mode="wait">
              {/* Users Tab */}
              {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full"
              >
              {/* Search Form */}
              <div className="glass rounded-2xl p-6 mb-8">
                <form onSubmit={handleSearch} className="flex gap-4">
                  <div className="flex-1 relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchEmail}
                      onChange={e => setSearchEmail(e.target.value)}
                      placeholder="Search by email..."
                      className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-violet to-accent-cyan text-white font-medium rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-accent-violet/25 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    Search
                  </button>
                  {searchEmail && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="flex items-center gap-2 px-4 py-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear
                    </button>
                  )}
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
                      {searchEmail ? 'Search Results' : 'Recent Signups'}
                      <span className="ml-3 text-sm font-normal text-white/40">
                        {users.length} user{users.length !== 1 ? 's' : ''}
                      </span>
                    </h3>
                    <button
                      onClick={fetchRecentUsers}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                    >
                      <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  </div>
                  <div>
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="w-[24%] px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">User</th>
                          <th className="w-[10%] px-3 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Plan</th>
                          <th className="w-[10%] px-3 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                          <th className="w-[18%] px-3 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Credits</th>
                          <th className="w-[10%] px-3 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Voice</th>
                          <th className="w-[12%] px-3 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Signed Up</th>
                          <th className="w-[10%] px-3 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map(user => {
                          const isUnlimited = user.subscription?.credits === -1
                          return (
                            <tr
                              key={user.user_id}
                              className={`transition-colors ${
                                isUnlimited
                                  ? 'bg-gradient-to-r from-amber-500/[0.03] via-transparent to-orange-500/[0.03] hover:from-amber-500/[0.06] hover:to-orange-500/[0.06]'
                                  : 'hover:bg-white/[0.02]'
                              }`}
                            >
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold ${
                                    isUnlimited
                                      ? 'bg-gradient-to-br from-amber-500/40 to-orange-500/40 ring-2 ring-amber-500/30'
                                      : 'bg-gradient-to-br from-accent-violet/30 to-accent-cyan/30'
                                  }`}>
                                    {isUnlimited ? (
                                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ) : (
                                      user.email.charAt(0).toUpperCase()
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-white text-sm font-medium truncate">{user.email}</p>
                                      {isUnlimited && (
                                        <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase text-amber-400 bg-amber-500/20">
                                          VIP
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4">
                                <select
                                  value={editing[user.user_id]?.plan || 'free'}
                                  onChange={e => handleFieldChange(user.user_id, 'plan', e.target.value)}
                                  className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-2 py-2 text-sm font-medium focus:outline-none focus:border-accent-violet/50 cursor-pointer transition-colors ${getPlanColor(editing[user.user_id]?.plan || 'free')}`}
                                >
                                  <option value="free" className="bg-background text-white">Free</option>
                                  <option value="starter" className="bg-background text-white">Starter</option>
                                  <option value="pro" className="bg-background text-white">Pro</option>
                                </select>
                              </td>
                              <td className="px-3 py-4">
                                <select
                                  value={editing[user.user_id]?.status || 'active'}
                                  onChange={e => handleFieldChange(user.user_id, 'status', e.target.value)}
                                  className={`w-full bg-white/[0.03] border border-white/10 rounded-lg px-2 py-2 text-sm font-medium focus:outline-none focus:border-accent-violet/50 cursor-pointer transition-colors ${getStatusColor(editing[user.user_id]?.status || 'active')}`}
                                >
                                  <option value="active" className="bg-background text-white">Active</option>
                                  <option value="inactive" className="bg-background text-white">Inactive</option>
                                  <option value="on_trial" className="bg-background text-white">On Trial</option>
                                  <option value="cancelled" className="bg-background text-white">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-3 py-4">
                                <div className="flex items-center gap-1">
                                  {isUnlimited ? (
                                    <>
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/20 border border-amber-500/40">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                        Unlimited
                                      </span>
                                      <button
                                        onClick={() => handleToggleUnlimited(user.user_id, user.subscription?.credits ?? 0, user.subscription?.plan || 'free')}
                                        disabled={togglingUnlimited[user.user_id]}
                                        className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-all disabled:opacity-50"
                                        title="Remove unlimited"
                                      >
                                        {togglingUnlimited[user.user_id] ? (
                                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        ) : (
                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        )}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <input
                                        type="number"
                                        value={editing[user.user_id]?.credits || '0'}
                                        onChange={e => handleFieldChange(user.user_id, 'credits', e.target.value)}
                                        className="w-16 bg-white/[0.03] border border-white/10 rounded px-2 py-1.5 text-sm text-white font-medium focus:outline-none focus:border-accent-violet/50 transition-colors"
                                      />
                                      <button
                                        onClick={() => handleToggleUnlimited(user.user_id, user.subscription?.credits ?? 0, user.subscription?.plan || 'free')}
                                        disabled={togglingUnlimited[user.user_id]}
                                        className="p-1.5 text-xs font-medium rounded text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                                        title="Set unlimited"
                                      >
                                        {togglingUnlimited[user.user_id] ? (
                                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        ) : (
                                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                        )}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-4">
                                <div className="flex items-center justify-center">
                                  <button
                                    onClick={() => handleTogglePrivateVoice(user.email, user.hasPrivateVoiceAccess)}
                                    disabled={togglingPrivateVoice[user.email]}
                                    className={`relative w-10 h-5 rounded-full transition-all ${
                                      user.hasPrivateVoiceAccess
                                        ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                                        : 'bg-white/10'
                                    } ${togglingPrivateVoice[user.email] ? 'opacity-50' : ''}`}
                                    title={user.hasPrivateVoiceAccess ? 'Disable private voice access' : 'Enable private voice access'}
                                  >
                                    <span
                                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                                        user.hasPrivateVoiceAccess ? 'left-5' : 'left-0.5'
                                      }`}
                                    />
                                    {togglingPrivateVoice[user.email] && (
                                      <span className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-3 h-3 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="px-3 py-4">
                                <span className="text-white/50 text-xs">
                                  {formatDate(user.created_at)}
                                </span>
                              </td>
                              <td className="px-3 py-4">
                                <div className="flex items-center justify-center">
                                  {saving[user.user_id] ? (
                                    <span className="flex items-center gap-1 text-white/50 text-xs">
                                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                      Saving
                                    </span>
                                  ) : successMsg[user.user_id] ? (
                                    <span className="flex items-center gap-1 text-green-400 text-xs">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                      Saved
                                    </span>
                                  ) : pendingChanges[user.user_id] ? (
                                    <span className="text-white/30 text-xs">...</span>
                                  ) : (
                                    <span className="text-white/20 text-xs">-</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && users.length === 0 && (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin mb-4" />
                  <p className="text-white/60">Loading users...</p>
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
                  <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
                  <p className="text-white/40 max-w-md mx-auto">
                    {searchEmail ? 'No users match your search. Try a different email.' : 'No users have signed up yet.'}
                  </p>
                </div>
              )}
              </motion.div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && (
              <motion.div
                key="usage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
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
              </motion.div>
              )}

              {/* Niches Tab */}
              {activeTab === 'niches' && (
              <motion.div
                key="niches"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {/* Success Message */}
              {nicheSuccess && (
                <div className="glass rounded-2xl p-5 mb-8 border border-green-500/30 bg-green-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-green-400 font-medium">{nicheSuccess}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {nichesError && (
                <div className="glass rounded-2xl p-5 mb-8 border border-red-500/30 bg-red-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-400 font-medium">Error</p>
                      <p className="text-red-400/70 text-sm">{nichesError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Create/Edit Niche Form */}
              <div className="glass rounded-2xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-violet/5 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {editingNicheId ? 'Edit Niche' : 'Create Niche'}
                    </h2>
                    <p className="text-white/40 text-sm">
                      {editingNicheId ? 'Update the niche details below' : 'Add a new niche to the platform'}
                    </p>
                  </div>
                  {editingNicheId && (
                    <button
                      onClick={handleCancelEdit}
                      className="ml-auto text-white/50 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleNicheSubmit} className="space-y-6">
                  {/* Row 1: Name, Category, Heat, Competition */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={nicheForm.name}
                        onChange={e => setNicheForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Reddit Stories"
                        required
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Category *</label>
                      <select
                        value={nicheForm.category}
                        onChange={e => setNicheForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-violet/50 cursor-pointer transition-all"
                      >
                        <option value="Entertainment" className="bg-background">Entertainment</option>
                        <option value="True Crime" className="bg-background">True Crime</option>
                        <option value="Finance" className="bg-background">Finance</option>
                        <option value="Military" className="bg-background">Military</option>
                        <option value="Gaming" className="bg-background">Gaming</option>
                        <option value="Tech" className="bg-background">Tech</option>
                        <option value="Sports" className="bg-background">Sports</option>
                        <option value="Lifestyle" className="bg-background">Lifestyle</option>
                        <option value="Education" className="bg-background">Education</option>
                        <option value="Other" className="bg-background">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Heat *</label>
                      <select
                        value={nicheForm.heat}
                        onChange={e => setNicheForm(prev => ({ ...prev, heat: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-violet/50 cursor-pointer transition-all"
                      >
                        <option value="exploding" className="bg-background">Exploding</option>
                        <option value="rising" className="bg-background">Rising</option>
                        <option value="stable" className="bg-background">Stable</option>
                        <option value="declining" className="bg-background">Declining</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Competition *</label>
                      <select
                        value={nicheForm.competition}
                        onChange={e => setNicheForm(prev => ({ ...prev, competition: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-violet/50 cursor-pointer transition-all"
                      >
                        <option value="low" className="bg-background">Low</option>
                        <option value="medium" className="bg-background">Medium</option>
                        <option value="high" className="bg-background">High</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Content Style, Est. Views, Posting Freq, Publish Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Content Style</label>
                      <input
                        type="text"
                        value={nicheForm.content_style}
                        onChange={e => setNicheForm(prev => ({ ...prev, content_style: e.target.value }))}
                        placeholder="e.g., voiceover, facecam"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Est. Views (28 days)</label>
                      <input
                        type="text"
                        value={nicheForm.estimated_views}
                        onChange={e => setNicheForm(prev => ({ ...prev, estimated_views: e.target.value }))}
                        placeholder="e.g., 500K-2M"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Posting Frequency</label>
                      <input
                        type="text"
                        value={nicheForm.posting_frequency}
                        onChange={e => setNicheForm(prev => ({ ...prev, posting_frequency: e.target.value }))}
                        placeholder="e.g., 3-5 per week"
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-2">Publish Date *</label>
                      <input
                        type="date"
                        value={nicheForm.publish_date}
                        onChange={e => setNicheForm(prev => ({ ...prev, publish_date: e.target.value }))}
                        required
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={nicheForm.description}
                      onChange={e => setNicheForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this niche and what makes it unique..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all resize-none"
                    />
                  </div>

                  {/* Row 4: How to Start */}
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">How to Start</label>
                    <textarea
                      value={nicheForm.how_to_start}
                      onChange={e => setNicheForm(prev => ({ ...prev, how_to_start: e.target.value }))}
                      placeholder="Steps to get started in this niche..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all resize-none"
                    />
                  </div>

                  {/* Row 5: Where to Find Ideas */}
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Where to Find Ideas</label>
                    <textarea
                      value={nicheForm.where_to_find_ideas}
                      onChange={e => setNicheForm(prev => ({ ...prev, where_to_find_ideas: e.target.value }))}
                      placeholder="Subreddits, hashtags, accounts, websites..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all resize-none"
                    />
                  </div>

                  {/* Row 6: Example Hooks */}
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-2">Example Hooks (one per line)</label>
                    <textarea
                      value={nicheForm.example_hooks}
                      onChange={e => setNicheForm(prev => ({ ...prev, example_hooks: e.target.value }))}
                      placeholder="This man discovered something terrifying...&#10;You won't believe what happened next...&#10;POV: You just found out..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all resize-none font-mono text-sm"
                    />
                  </div>

                  {/* Row 7: Reference Channels */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-white/60 text-sm font-medium">Reference Channels</label>
                      <button
                        type="button"
                        onClick={addReferenceChannel}
                        className="flex items-center gap-1.5 text-xs text-accent-violet hover:text-accent-cyan transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Channel
                      </button>
                    </div>
                    <div className="space-y-3">
                      {nicheForm.reference_channels.length === 0 ? (
                        <p className="text-white/30 text-sm py-4 text-center border border-dashed border-white/10 rounded-xl">
                          No reference channels added. Click &quot;Add Channel&quot; to add one.
                        </p>
                      ) : (
                        nicheForm.reference_channels.map((channel, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={channel.name}
                                onChange={e => updateReferenceChannel(index, 'name', e.target.value)}
                                placeholder="Channel name (e.g., MrBallen)"
                                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all text-sm"
                              />
                              <input
                                type="url"
                                value={channel.url}
                                onChange={e => updateReferenceChannel(index, 'url', e.target.value)}
                                placeholder="URL (e.g., https://youtube.com/@MrBallen)"
                                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all text-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeReferenceChannel(index)}
                              className="p-3 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={nicheSaving}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-violet to-accent-cyan text-white font-medium rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-accent-violet/25 transition-all disabled:opacity-50"
                    >
                      {nicheSaving ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {editingNicheId ? 'Update Niche' : 'Create Niche'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Niches List */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    All Niches
                    <span className="ml-3 text-sm font-normal text-white/40">
                      {niches.length} niche{niches.length !== 1 ? 's' : ''}
                    </span>
                  </h3>
                  <button
                    onClick={fetchNiches}
                    disabled={nichesLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
                  >
                    <svg className={`w-4 h-4 ${nichesLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                {nichesLoading && niches.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin mb-4" />
                    <p className="text-white/60">Loading niches...</p>
                  </div>
                ) : niches.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Niches Yet</h3>
                    <p className="text-white/40 max-w-md mx-auto">
                      Create your first niche using the form above. Niches help users discover trending content opportunities.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Heat</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Competition</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Publish Date</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {niches.map(niche => (
                          <tr key={niche.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-white font-medium">{niche.name}</p>
                              {niche.content_style && (
                                <p className="text-white/40 text-xs mt-0.5">{niche.content_style}</p>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-white/70 text-sm">{niche.category}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${getHeatColor(niche.heat)}`}>
                                {niche.heat}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-sm font-medium capitalize ${getCompetitionColor(niche.competition)}`}>
                                {niche.competition}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-white/50 text-sm">
                                {formatDate(niche.publish_date)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {isPublished(niche.publish_date) ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-green-400 bg-green-400/10">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-yellow-400 bg-yellow-400/10">
                                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                                  Scheduled
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditNiche(niche)}
                                  className="p-2 text-white/50 hover:text-accent-violet hover:bg-accent-violet/10 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                {deleteConfirm === niche.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleDeleteNiche(niche.id)}
                                      className="px-2.5 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-all"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm(null)}
                                      className="px-2.5 py-1.5 text-xs font-medium text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirm(niche.id)}
                                    className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    title="Delete"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              </motion.div>
              )}
            </AnimatePresence>
          </div>
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
