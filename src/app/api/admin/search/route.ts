import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

export async function GET(request: NextRequest) {
  // Verify the requester is the admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')

  if (!email || email.length < 3) {
    return NextResponse.json({ error: 'Email search term must be at least 3 characters' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Search users by email using the admin API
  const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers({
    perPage: 50,
  })

  if (authError) {
    console.error('Error fetching users:', authError)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  // Filter users by email search term
  const matchingUsers = authUsers.users.filter(u =>
    u.email?.toLowerCase().includes(email.toLowerCase())
  )

  // Get subscriptions for matching users
  const userIds = matchingUsers.map(u => u.id)

  const { data: subscriptions, error: subError } = await adminClient
    .from('subscriptions')
    .select('*')
    .in('user_id', userIds)

  if (subError) {
    console.error('Error fetching subscriptions:', subError)
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  }

  // Combine user and subscription data
  const results = matchingUsers.map(u => {
    const subscription = subscriptions?.find(s => s.user_id === u.id)
    return {
      user_id: u.id,
      email: u.email,
      created_at: u.created_at,
      subscription: subscription || null,
    }
  })

  return NextResponse.json({ users: results })
}
