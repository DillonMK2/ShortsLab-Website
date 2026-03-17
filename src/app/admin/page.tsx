import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminPanel from './AdminPanel'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Server-side auth check - redirect if not admin
  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  return <AdminPanel userEmail={user.email} />
}
