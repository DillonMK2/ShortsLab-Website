import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client for server-side use (no auth needed for public config)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Compare semantic versions: returns true if current < latest
function isOlderVersion(current: string, latest: string): boolean {
  const currentParts = current.replace(/^v/, '').split('.').map(Number)
  const latestParts = latest.replace(/^v/, '').split('.').map(Number)

  for (let i = 0; i < 3; i++) {
    const curr = currentParts[i] || 0
    const lat = latestParts[i] || 0
    if (curr < lat) return true
    if (curr > lat) return false
  }
  return false
}

interface UpdateConfig {
  latest_version: string
  update_url_windows: string
  update_signature: string
  update_notes?: string
  pub_date?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ target: string; arch: string; current_version: string }> }
) {
  const { target, arch, current_version } = await params

  try {
    // Fetch update configuration from app_config table
    const { data, error } = await supabase
      .from('app_config')
      .select('key, value')
      .in('key', ['latest_version', 'update_url_windows', 'update_signature', 'update_notes', 'pub_date'])

    if (error) {
      console.error('Error fetching app_config:', error)
      return new NextResponse(null, { status: 500 })
    }

    // Convert array to object
    const config: Partial<UpdateConfig> = {}
    for (const row of data || []) {
      config[row.key as keyof UpdateConfig] = row.value
    }

    // Check if we have the required config
    if (!config.latest_version || !config.update_url_windows || !config.update_signature) {
      console.error('Missing required update config:', {
        hasVersion: !!config.latest_version,
        hasUrl: !!config.update_url_windows,
        hasSignature: !!config.update_signature
      })
      return new NextResponse(null, { status: 204 })
    }

    // Check if current version is older than latest
    if (!isOlderVersion(current_version, config.latest_version)) {
      // Already up to date
      return new NextResponse(null, { status: 204 })
    }

    // Determine the download URL based on target/arch
    // For now, we only support Windows x64
    let url = config.update_url_windows
    if (target !== 'windows' || (arch !== 'x86_64' && arch !== 'x64')) {
      // Unsupported platform - no update available
      return new NextResponse(null, { status: 204 })
    }

    // Return update info in Tauri's expected format
    const updateResponse = {
      version: config.latest_version,
      notes: config.update_notes || `Update to version ${config.latest_version}`,
      pub_date: config.pub_date || new Date().toISOString(),
      url,
      signature: config.update_signature
    }

    return NextResponse.json(updateResponse)
  } catch (err) {
    console.error('Update check error:', err)
    return new NextResponse(null, { status: 500 })
  }
}
