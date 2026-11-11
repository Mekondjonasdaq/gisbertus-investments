import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, MessageCircle, Phone, X } from 'lucide-react'
import Logo from './Logo'
import { useSettings } from '../context/SettingsContext'
import { buildWhatsAppLink, GENERAL_ENQUIRY_MESSAGE } from '../utils/whatsapp'

const linkBase =
  'relative px-1 py-2 text-sm font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent-400 after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100'
const navLinkClass = ({ isActive }) => `${linkBase} ${isActive ? 'text-white after:scale-x-100' : 'text-ink-200'}`

export default function Navbar() {
  const { settings } = useSettings()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const whatsappHref = buildWhatsAppLink(settings.whatsapp, GENERAL_ENQUIRY_MESSAGE)
  const mobileLinks = [
    { to: '/', label: 'Home' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/order', label: 'Order a Car' },
    { to: '/#offers', label: 'Special offers' },
    { to: '/#contact', label: 'Contact' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled || menuOpen ? 'border-white/10 bg-ink-950/90 backdrop-blur-xl' : 'border-transparent bg-ink-950/60 backdrop-blur-md'
      }`}
    >
      <nav className={`container-page flex items-center justify-between gap-3 transition-[height] duration-300 ${scrolled ? 'h-20' : 'h-24 sm:h-28'}`} aria-label="Main navigation">
        <Logo compact={scrolled} />

        <div className="hidden items-center gap-8 lg:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/inventory" className={navLinkClass}>Inventory</NavLink>
          <NavLink to="/order" className={navLinkClass}>Order a Car</NavLink>
          <Link to="/#offers" className={`${linkBase} text-ink-200`}>Offers</Link>
          <Link to="/#contact" className={`${linkBase} text-ink-200`}>Contact</Link>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn-ghost"><Phone size={16} /> Call us</a>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-primary"><MessageCircle size={16} /> WhatsApp</a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div className={`overflow-hidden border-white/10 bg-ink-950/95 transition-[max-height,opacity] duration-500 lg:hidden ${menuOpen ? 'max-h-[calc(100vh-6rem)] overflow-y-auto border-t opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container-page flex flex-col gap-1 py-6">
          {mobileLinks.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-xl px-4 py-3 text-lg font-medium text-ink-200 transition hover:bg-white/5 hover:text-white">
              {item.label}
            </Link>
          ))}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn-outline"><Phone size={16} /> Call</a>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-primary"><MessageCircle size={16} /> WhatsApp</a>
          </div>
        </div>
      </div>
    </header>
  )
}