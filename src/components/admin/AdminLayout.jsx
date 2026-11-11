import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import AdminSidebar from './AdminSidebar'
import Logo from '../Logo'

export default function AdminLayout() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [location.pathname])

  return (
    <div className="min-h-screen bg-ink-950 lg:flex">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-white/5 bg-ink-900 px-4 py-3 lg:hidden">
          <Logo to="/" size="sm" />
          <button type="button" onClick={() => setOpen(true)} className="rounded-full p-2 hover:bg-white/10" aria-label="Open menu"><Menu size={22} /></button>
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
