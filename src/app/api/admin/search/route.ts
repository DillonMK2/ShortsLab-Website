import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

export async function GET(request: NextRequest) {
  try {
    // Verify the requester is the admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const recent = searchParams.get('recent') === 'true'

    const adminClient = createAdminClient()

    // Get all users using the admin API
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers({
      perPage: 100,
    })

    if (authError) {
      console.error('Error fetching users from auth.admin.listUsers:', JSON.stringify(authError, null, 2))
      return NextResponse.json({ error: `Failed to fetch users: ${authError.message}` }, { status: 500 })
    }

    console.log(`Admin search: Found ${authUsers.users.length} total users in auth`)

    let matchingUsers = authUsers.users

    // If searching by email, filter the results
    if (email && email.length >= 3) {
      console.log('Admin search: Filtering by email:', email)
      matchingUsers = matchingUsers.filter(u =>
        u.email?.toLowerCase().includes(email.toLowerCase())
      )
      console.log(`Admin search: ${matchingUsers.length} users match the search term`)
    }

    // Sort by created_at descending (most recent first)
    matchingUsers.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // If requesting recent users, limit to 20
    if (recent && !email) {
      matchingUsers = matchingUsers.slice(0, 20)
      console.log('Admin search: Returning 20 most recent users')
    }

    if (matchingUsers.length === 0) {
      return NextResponse.json({ users: [] })
    }

    // Get subscriptions for matching users
    const userIds = matchingUsers.map(u => u.id)
    const userEmails = matchingUsers.map(u => u.email).filter(Boolean) as string[]

    const { data: subscriptions, error: subError } = await adminClient
      .from('subscriptions')
      .select('*')
      .in('user_id', userIds)

    if (subError) {
      console.error('Error fetching subscriptions:', JSON.stringify(subError, null, 2))
      // Don't fail completely - just return users without subscription data
      console.log('Continuing without subscription data')
    }

    // Get private voice access for matching users
    const { data: privateVoiceUsers, error: pvError } = await adminClient
      .from('private_voice_users')
      .select('email')
      .in('email', userEmails)

    if (pvError) {
      console.error('Error fetching private voice users:', JSON.stringify(pvError, null, 2))
      console.log('Continuing without private voice data')
    }

    const privateVoiceEmails = new Set(privateVoiceUsers?.map(pv => pv.email) || [])

    // Combine user and subscription data
    const results = matchingUsers.map(u => {
      const subscription = subscriptions?.find(s => s.user_id === u.id)
      return {
        user_id: u.id,
        email: u.email,
        created_at: u.created_at,
        subscription: subscription || null,
        hasPrivateVoiceAccess: u.email ? privateVoiceEmails.has(u.email) : false,
      }
    })

    console.log(`Admin search: Returning ${results.length} user results`)
    return NextResponse.json({ users: results })
  } catch (err) {
    console.error('Unexpected error in admin search:', err)
    return NextResponse.json({ error: 'Unexpected error searching users' }, { status: 500 })
  }
}
