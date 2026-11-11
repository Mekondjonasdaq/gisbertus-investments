import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Search } from 'lucide-react'
import CarPlaceholder from '../CarPlaceholder'
import HeroCarousel from './HeroCarousel'
import HeroBackground from './HeroBackground'
import { useVehicles } from '../../context/VehicleContext'
import { useSettings } from '../../context/SettingsContext'
import { formatPrice } from '../../utils/format'
import { isAvailable } from '../../utils/vehicles'
import { buildWhatsAppLink, GENERAL_ENQUIRY_MESSAGE } from '../../utils/whatsapp'

const PRICE_STEPS = [75000, 100000, 150000, 200000, 300000, 500000, 1000000]
const MAX_SHOWCASE = 8

export default function Hero() {
  const { stockVehicles: vehicles } = useVehicles()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const [make, setMake] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const available = useMemo(() => vehicles.filter(isAvailable), [vehicles])
  const makes = useMemo(() => [...new Set(available.map((v) => v.make).filter(Boolean))].sort(), [available])

  // The showcase: main photo of every in-stock car (featured first, then newest).
  const showcase = useMemo(
    () =>
      available
        .filter((v) => v.images?.[0])
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt)
        .slice(0, MAX_SHOWCASE),
    [available]
  )

  const onSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (make) params.set('make', make)
    if (maxPrice) params.set('maxPrice', maxPrice)
    navigate(`/inventory${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <HeroBackground image={settings.heroImage} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(220,38,38,0.30),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="container-page relative grid items-center gap-10 pb-10 pt-14 grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pb-16 lg:pt-20">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-ink-200">
            <span className="h-2 w-2 rounded-full bg-accent-500" /> {settings.tagline} · Windhoek
          </p>
          <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.08] sm:text-6xl xl:text-7xl">
            New car,
            <br />
            new journey.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-200">
            Quality cars in stock in Windhoek, ready to buy and drive away today.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/inventory" className="btn-primary w-full px-8! py-4! sm:w-auto"><Search size={18} /> Search vehicles</Link>
            <a href={buildWhatsAppLink(settings.whatsapp, GENERAL_ENQUIRY_MESSAGE)} target="_blank" rel="noreferrer" className="btn-outline w-full px-8! py-4! sm:w-auto">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-6">
            <div className="min-w-0"><dt className="text-xs text-ink-400">Location</dt><dd className="mt-1 whitespace-nowrap text-lg font-semibold sm:text-2xl">Windhoek</dd></div>
            <div className="min-w-0"><dt className="text-xs text-ink-400">Status</dt><dd className="mt-1 whitespace-nowrap text-lg font-semibold sm:text-2xl">In stock</dd></div>
            <div className="min-w-0"><dt className="text-xs text-ink-400">Cars available</dt><dd className="mt-1 whitespace-nowrap text-lg font-semibold sm:text-2xl">{available.length}</dd></div>
          </dl>
        </div>

        <div className="relative animate-fade-in">
          {showcase.length > 0 ? (
            <HeroCarousel cars={showcase} />
          ) : (
            <div className="relative">
              <div className="animate-float"><CarPlaceholder plain className="w-full" /></div>
              <div
                className="animate-road mx-auto -mt-3 h-1 w-[85%] rounded-full opacity-60"
                style={{ backgroundImage: 'repeating-linear-gradient(90deg, #dc2626 0 48px, transparent 48px 96px)' }}
                aria-hidden="true"
              />
              <p className="mt-6 text-center text-sm text-ink-400">New cars arriving soon.</p>
            </div>
          )}
        </div>
      </div>

      <div className="container-page relative pb-14">
        <form onSubmit={onSearch} className="grid gap-3 rounded-2xl border border-white/10 bg-ink-900/80 p-4 backdrop-blur-xl sm:grid-cols-[1fr_1fr_auto] sm:p-5" aria-label="Quick vehicle search">
          <div>
            <label htmlFor="hero-make" className="label">Make</label>
            <select id="hero-make" className="input" value={make} onChange={(e) => setMake(e.target.value)}>
              <option value="">Any make</option>
              {makes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="hero-price" className="label">Maximum price</label>
            <select id="hero-price" className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="">Any price</option>
              {PRICE_STEPS.map((p) => <option key={p} value={p}>Up to {formatPrice(p)}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary self-end py-3.5!"><Search size={18} /> Search</button>
        </form>
      </div>
    </section>
  )
}