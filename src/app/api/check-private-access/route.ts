import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Public endpoint for Cloudflare Worker to check private voice access
// GET /api/check-private-access?email={email}
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'email parameter is required' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  const { data, error } = await adminClient
    .from('private_voice_users')
    .select('email')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is expected for users without access
    console.error('Error checking private voice access:', error)
    return NextResponse.json({ error: 'Failed to check access' }, { status: 500 })
  }

  const hasAccess = !!data

  return NextResponse.json({
    email,
    hasPrivateVoiceAccess: hasAccess
  })
}
