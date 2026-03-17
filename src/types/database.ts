export type Subscription = {
  user_id: string
  ls_customer_id: string | null
  ls_subscription_id: string | null
  plan: 'free' | 'starter' | 'pro'
  status: 'active' | 'cancelled' | 'past_due' | 'paused'
  credits: number
  trial_ends_at: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}
