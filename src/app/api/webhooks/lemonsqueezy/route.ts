import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Lazy initialization to avoid build-time errors
let supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return supabaseAdmin
}

type WebhookEvent = {
  meta: {
    event_name: string
    custom_data?: {
      user_id?: string
    }
  }
  data: {
    id: string
    attributes: {
      customer_id: number
      product_id: number
      variant_id: number
      status: string
      product_name: string
      variant_name: string
      user_email: string
      renews_at: string | null
      ends_at: string | null
      trial_ends_at: string | null
      cancelled: boolean
    }
  }
}

function verifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

function getPlanFromAttributes(attributes: WebhookEvent['data']['attributes']): string {
  const { variant_name, product_name, variant_id, product_id } = attributes

  // Log for debugging - helps identify the actual IDs/names from LemonSqueezy
  console.log('LemonSqueezy attributes:', {
    variant_id,
    variant_name,
    product_id,
    product_name
  })

  // Check variant_name first
  const variantLower = (variant_name || '').toLowerCase()
  if (variantLower.includes('pro')) return 'pro'
  if (variantLower.includes('starter')) return 'starter'

  // Check product_name as fallback
  const productLower = (product_name || '').toLowerCase()
  if (productLower.includes('pro')) return 'pro'
  if (productLower.includes('starter')) return 'starter'

  // Fallback: check combined names for "shorts lab" products
  // Pro tier is typically higher-priced, starter is entry-level
  const combined = `${variantLower} ${productLower}`
  if (combined.includes('pro') || combined.includes('premium') || combined.includes('unlimited')) return 'pro'
  if (combined.includes('starter') || combined.includes('basic') || combined.includes('lite')) return 'starter'

  // If we still can't determine, log a warning and default to starter for paid subscriptions
  // (since free users wouldn't trigger a subscription webhook)
  console.warn(`Could not determine plan from variant_name="${variant_name}" product_name="${product_name}". Defaulting to starter.`)
  return 'starter'
}

function getCreditsForPlan(plan: string): number {
  switch (plan) {
    case 'pro':
      return 2000
    case 'starter':
      return 500
    default:
      return 0
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('LEMONSQUEEZY_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify the webhook signature
    const isValid = verifySignature(payload, signature, webhookSecret)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event: WebhookEvent = JSON.parse(payload)
    const eventName = event.meta.event_name
    const { attributes, id: subscriptionId } = event.data

    console.log(`Processing LemonSqueezy event: ${eventName}`)

    // Get user_id from custom_data (passed during checkout)
    const userId = event.meta.custom_data?.user_id

    if (!userId) {
      console.error('No user_id in custom_data')
      return NextResponse.json(
        { error: 'Missing user_id in custom_data' },
        { status: 400 }
      )
    }

    const plan = getPlanFromAttributes(attributes)
    const credits = getCreditsForPlan(plan)

    switch (eventName) {
      case 'subscription_created': {
        const { error } = await getSupabaseAdmin()
          .from('subscriptions')
          .upsert({
            user_id: userId,
            ls_customer_id: String(attributes.customer_id),
            ls_subscription_id: subscriptionId,
            plan,
            status: attributes.status,
            credits,
            trial_ends_at: attributes.trial_ends_at,
            current_period_end: attributes.renews_at,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          })

        if (error) {
          console.error('Error creating subscription:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`Subscription created for user ${userId}: ${plan}`)
        break
      }

      case 'subscription_updated': {
        const { error } = await getSupabaseAdmin()
          .from('subscriptions')
          .update({
            plan,
            status: attributes.status,
            credits,
            current_period_end: attributes.renews_at,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        if (error) {
          console.error('Error updating subscription:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`Subscription updated for user ${userId}: ${plan}`)
        break
      }

      case 'subscription_cancelled': {
        const { error } = await getSupabaseAdmin()
          .from('subscriptions')
          .update({
            status: 'cancelled',
            current_period_end: attributes.ends_at,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        if (error) {
          console.error('Error cancelling subscription:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`Subscription cancelled for user ${userId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${eventName}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
