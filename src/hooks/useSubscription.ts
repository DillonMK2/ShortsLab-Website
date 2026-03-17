'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'

export type Subscription = {
  id: string
  user_id: string
  plan: 'free' | 'starter' | 'pro'
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'on_trial' | 'paused'
  credits: number
  trial_ends_at: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export function useSubscription() {
  const { user } = useUser()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    const fetchSubscription = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
        setSubscription(null)
      } else {
        setSubscription(data)
      }
      setLoading(false)
    }

    fetchSubscription()
  }, [user])

  const isActive = subscription?.status === 'active' || subscription?.status === 'on_trial'
  const isPro = subscription?.plan === 'pro' && isActive
  const isStarter = subscription?.plan === 'starter' && isActive

  return {
    subscription,
    loading,
    isActive,
    isPro,
    isStarter,
  }
}
