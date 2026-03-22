import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

// PUT - Update a niche
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const {
      name,
      category,
      heat,
      competition,
      content_style,
      description,
      how_to_start,
      where_to_find_ideas,
      example_hooks,
      reference_channels,
      estimated_views,
      posting_frequency,
      publish_date,
    } = body

    // Validate required fields
    if (!name || !category || !heat || !competition) {
      return NextResponse.json({ error: 'Name, category, heat, and competition are required' }, { status: 400 })
    }

    const validCategories = ['Entertainment', 'True Crime', 'Finance', 'Military', 'Gaming', 'Tech', 'Sports', 'Lifestyle', 'Education', 'Other']
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    const validHeats = ['exploding', 'rising', 'stable', 'declining']
    if (!validHeats.includes(heat)) {
      return NextResponse.json({ error: 'Invalid heat' }, { status: 400 })
    }

    const validCompetitions = ['low', 'medium', 'high']
    if (!validCompetitions.includes(competition)) {
      return NextResponse.json({ error: 'Invalid competition' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    const updateData = {
      name,
      category,
      heat,
      competition,
      content_style: content_style || null,
      description: description || null,
      how_to_start: how_to_start || null,
      where_to_find_ideas: where_to_find_ideas || null,
      example_hooks: example_hooks || [],
      reference_channels: reference_channels || [],
      estimated_views_28d: estimated_views || null,
      posting_frequency: posting_frequency || null,
      publish_date: publish_date || new Date().toISOString(),
    }

    console.log('Updating niche with data:', JSON.stringify(updateData, null, 2))

    const { data: niche, error } = await adminClient
      .from('niches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating niche:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error: `Failed to update niche: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ niche })
  } catch (err) {
    console.error('Unexpected error updating niche:', err)
    return NextResponse.json({ error: 'Unexpected error updating niche' }, { status: 500 })
  }
}

// DELETE - Delete a niche
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const adminClient = createAdminClient()

  const { error } = await adminClient
    .from('niches')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting niche:', error)
    return NextResponse.json({ error: 'Failed to delete niche' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
