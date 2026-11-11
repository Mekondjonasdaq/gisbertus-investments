import { NavLink } from 'react-router-dom'
import { ExternalLink, LayoutDashboard, LogOut, PlusCircle, Settings, Car, X } from 'lucide-react'
import Logo from '../Logo'
import { useAuth } from '../../context/AuthContext'
import { adminUrl } from '../../config'

const links = [
  { to: adminUrl(), label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: adminUrl('/vehicles'), label: 'Vehicles', icon: Car, end: true },
  { to: adminUrl('/vehicles/new'), label: 'Add vehicle', icon: PlusCircle },
  { to: adminUrl('/settings'), label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ open, onClose }) {
  const { signOut } = useAuth()
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-ink-900 p-6 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Logo to={adminUrl()} size="side" />
          <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 lg:hidden" aria-label="Close menu"><X size={22} /></button>
        </div>
        <p className="mt-2 text-xs text-ink-400">Owner portal</p>

        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Owner navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-accent-500 text-white shadow-glow' : 'text-ink-200 hover:bg-white/5 hover:text-white'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/5 pt-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-ink-200 transition hover:bg-white/5 hover:text-white"><ExternalLink size={18} /> View website</a>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-ink-200 transition hover:bg-white/5 hover:text-white"><LogOut size={18} /> Log out</button>
        </div>
      </aside>
    </>
  )
}