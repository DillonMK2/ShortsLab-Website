import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminPanel from './AdminPanel'

const ADMIN_EMAIL = 'dagingaking@gmail.com'

export default async function AdminPage() {
  let user = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Admin page auth error:', error.message)
      // Don't redirect here, let the check below handle it
    } else {
      user = data.user
    }
  } catch (err) {
    console.error('Admin page error:', err)
    // Return a static error page for unexpected errors
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Admin Panel Error</h1>
          <p className="text-white/60 mb-4">Unable to load admin panel. Please try again.</p>
          <a href="/" className="text-accent-violet hover:underline">Return to Home</a>
        </div>
      </main>
    )
  }

  // Server-side auth check - redirect if not admin
  // redirect() must be called outside of try/catch
  if (!user || user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  return <AdminPanel userEmail={user.email} />
}
