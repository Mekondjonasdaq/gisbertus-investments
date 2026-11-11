import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../../context/AuthContext'
import AdminLogin from '../../pages/admin/AdminLogin'
import AdminLayout from './AdminLayout'

// Everything under the secret address passes through here. Auth is mounted only
// here, so public visitors never trigger any sign-in code.
function Inner() {
  const { session, loading } = useAuth()

  // Keep the portal out of search engines.
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex,nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950" role="status" aria-label="Loading">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent-500" />
      </div>
    )
  }
  return session ? <AdminLayout /> : <AdminLogin />
}

export default function AdminGate() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  )
}
