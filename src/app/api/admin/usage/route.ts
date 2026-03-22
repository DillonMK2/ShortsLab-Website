import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

export async function GET() {
  try {
    // Verify admin access
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Admin usage: Fetching usage stats')

    const adminClient = createAdminClient()

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thirtyDaysAgo = new Date(todayStart)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Check if usage_logs table exists by doing a simple query
    const { error: tableCheckError } = await adminClient
      .from('usage_logs')
      .select('id')
      .limit(1)

    if (tableCheckError) {
      console.error('Usage logs table error:', JSON.stringify(tableCheckError, null, 2))
      // Return empty data if table doesn't exist
      if (tableCheckError.code === '42P01' || tableCheckError.message?.includes('does not exist')) {
        console.log('Admin usage: usage_logs table does not exist, returning empty data')
        return NextResponse.json({
          totals: { today: 0, week: 0, month: 0 },
          featureBreakdown: { chat: 0, rewrite: 0, voiceover: 0, research: 0 },
          topUsers: [],
          dailyData: generateEmptyDailyData(thirtyDaysAgo),
        })
      }
    }

    // Get total API calls for today, this week, this month
    const [todayResult, weekResult, monthResult] = await Promise.all([
      adminClient
        .from('usage_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString()),
      adminClient
        .from('usage_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', weekStart.toISOString()),
      adminClient
        .from('usage_logs')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString()),
    ])

    console.log(`Admin usage: Today=${todayResult.count}, Week=${weekResult.count}, Month=${monthResult.count}`)

    // Get breakdown by feature (this month)
    const { data: featureBreakdown } = await adminClient
      .from('usage_logs')
      .select('feature')
      .gte('created_at', monthStart.toISOString())

    const featureCounts: Record<string, number> = {
      chat: 0,
      rewrite: 0,
      voiceover: 0,
      research: 0,
    }

    featureBreakdown?.forEach((log) => {
      if (log.feature in featureCounts) {
        featureCounts[log.feature]++
      }
    })

    // Get top 10 users by credit usage this month
    const { data: topUsersRaw } = await adminClient
      .from('usage_logs')
      .select('user_id, credits_used')
      .gte('created_at', monthStart.toISOString())

    const userCredits: Record<string, number> = {}
    topUsersRaw?.forEach((log) => {
      if (log.user_id) {
        userCredits[log.user_id] = (userCredits[log.user_id] || 0) + (log.credits_used || 0)
      }
    })

    const topUserIds = Object.entries(userCredits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Get user emails for top users
    const topUsers: { user_id: string; email: string; credits_used: number }[] = []
    for (const [userId, credits] of topUserIds) {
      try {
        const { data: userData } = await adminClient.auth.admin.getUserById(userId)
        topUsers.push({
          user_id: userId,
          email: userData.user?.email || 'Unknown',
          credits_used: credits,
        })
      } catch {
        topUsers.push({
          user_id: userId,
          email: 'Unknown',
          credits_used: credits,
        })
      }
    }

    // Get daily API calls for last 30 days
    const { data: dailyLogs } = await adminClient
      .from('usage_logs')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    const dailyCounts: Record<string, number> = {}

    // Initialize all days with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      dailyCounts[dateStr] = 0
    }

    // Count logs per day
    dailyLogs?.forEach((log) => {
      const dateStr = log.created_at.split('T')[0]
      if (dateStr in dailyCounts) {
        dailyCounts[dateStr]++
      }
    })

    const dailyData = Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      totals: {
        today: todayResult.count || 0,
        week: weekResult.count || 0,
        month: monthResult.count || 0,
      },
      featureBreakdown: featureCounts,
      topUsers,
      dailyData,
    })
  } catch (error) {
    console.error('Usage fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    )
  }
}

function generateEmptyDailyData(startDate: Date) {
  const dailyData = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    dailyData.push({
      date: date.toISOString().split('T')[0],
      count: 0,
    })
  }
  return dailyData
}
