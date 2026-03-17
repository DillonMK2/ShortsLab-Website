import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

export async function POST(request: NextRequest) {
  // Verify the requester is the admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { user_id, credits, plan, status } = body

  if (!user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Build update object with only provided fields
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (credits !== undefined) {
    updates.credits = parseInt(credits, 10)
  }

  if (plan !== undefined) {
    if (!['free', 'starter', 'pro'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    updates.plan = plan
  }

  if (status !== undefined) {
    if (!['active', 'inactive', 'on_trial', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    updates.status = status
  }

  // Check if subscription exists
  const { data: existing } = await adminClient
    .from('subscriptions')
    .select('user_id')
    .eq('user_id', user_id)
    .single()

  if (!existing) {
    // Create subscription if it doesn't exist
    const { error: insertError } = await adminClient
      .from('subscriptions')
      .insert({
        user_id,
        plan: plan || 'free',
        status: status || 'active',
        credits: credits !== undefined ? parseInt(credits, 10) : 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Error creating subscription:', insertError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }
  } else {
    // Update existing subscription
    const { error: updateError } = await adminClient
      .from('subscriptions')
      .update(updates)
      .eq('user_id', user_id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
    }
  }

  // Fetch updated subscription
  const { data: updated, error: fetchError } = await adminClient
    .from('subscriptions')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (fetchError) {
    console.error('Error fetching updated subscription:', fetchError)
    return NextResponse.json({ error: 'Update succeeded but failed to fetch result' }, { status: 500 })
  }

  return NextResponse.json({ subscription: updated })
}
