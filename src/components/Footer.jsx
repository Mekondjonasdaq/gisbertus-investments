import { Link } from 'react-router-dom'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Logo from './Logo'
import { useSettings } from '../context/SettingsContext'
import { groupHours } from '../utils/businessHours'
import { buildWhatsAppLink, GENERAL_ENQUIRY_MESSAGE } from '../utils/whatsapp'
import { mapsSearchUrl } from '../utils/maps'

const SOCIAL_LABELS = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', twitter: 'X / Twitter', youtube: 'YouTube' }
const tel = (p) => `tel:${p.replace(/\s/g, '')}`

export default function Footer() {
  const { settings } = useSettings()
  const socials = Object.entries(settings.social || {}).filter(([, url]) => url)

  return (
    <footer className="border-t border-white/5 bg-ink-900">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="lg" showTagline />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-300">
            Quality vehicles, honest prices and direct service. Browse our latest cars and enquire on WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.length > 0 ? (
              socials.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-ink-200 transition hover:border-accent-400 hover:text-accent-300">
                  {SOCIAL_LABELS[key] || key}
                </a>
              ))
            ) : (
              <span className="text-xs text-ink-400">Social media links coming soon</span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm text-ink-300">
            <li><Link className="transition hover:text-accent-300" to="/">Home</Link></li>
            <li><Link className="transition hover:text-accent-300" to="/inventory">Vehicle inventory</Link></li>
            <li><Link className="transition hover:text-accent-300" to="/order">Order a car</Link></li>
            <li><Link className="transition hover:text-accent-300" to="/#offers">Special offers</Link></li>
            <li><Link className="transition hover:text-accent-300" to="/#sell">Sell your car</Link></li>
            <li><Link className="transition hover:text-accent-300" to="/#faq">FAQ</Link></li>
            <li><Link className="transition hover:text-accent-300" to="/#contact">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm text-ink-300">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-accent-400" /><a className="transition hover:text-accent-300" href={mapsSearchUrl(settings)} target="_blank" rel="noreferrer">{settings.location}</a></li>
            <li className="flex gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-accent-400" />
              <span className="flex flex-col">
                <a className="transition hover:text-accent-300" href={tel(settings.phone)}>{settings.phone}</a>
                {settings.phone2 && <a className="transition hover:text-accent-300" href={tel(settings.phone2)}>{settings.phone2}</a>}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-accent-400" />
              <a className="break-all transition hover:text-accent-300" href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li className="flex gap-3">
              <MessageCircle size={16} className="mt-0.5 shrink-0 text-accent-400" />
              <a className="transition hover:text-accent-300" href={buildWhatsAppLink(settings.whatsapp, GENERAL_ENQUIRY_MESSAGE)} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold text-white">Showroom hours</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {groupHours(settings.hours).map((row) => (
              <li key={row.label} className="flex justify-between gap-4 border-b border-white/5 pb-3 text-ink-300">
                <span>{row.label}</span>
                <span className="font-medium text-white">{row.text}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-400">Namibian time (CAT)</p>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.dealershipName}. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span>All prices in Namibian Dollars (N$)</span>
          </p>
        </div>
      </div>
    </footer>
  )
}