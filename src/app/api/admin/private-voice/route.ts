import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

// Toggle private voice access for a user
export async function POST(request: NextRequest) {
  // Verify the requester is the admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { email, enabled } = body

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'enabled must be a boolean' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  if (enabled) {
    // Add user to private_voice_users table
    const { error: insertError } = await adminClient
      .from('private_voice_users')
      .upsert({ email }, { onConflict: 'email' })

    if (insertError) {
      console.error('Error adding private voice access:', insertError)
      return NextResponse.json({ error: 'Failed to enable private voice access' }, { status: 500 })
    }
  } else {
    // Remove user from private_voice_users table
    const { error: deleteError } = await adminClient
      .from('private_voice_users')
      .delete()
      .eq('email', email)

    if (deleteError) {
      console.error('Error removing private voice access:', deleteError)
      return NextResponse.json({ error: 'Failed to disable private voice access' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, email, enabled })
}
