import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, MessageCircle, Phone } from 'lucide-react'
import VehicleGallery from '../components/VehicleGallery'
import VehicleCard from '../components/VehicleCard'
import StatusBadge from '../components/StatusBadge'
import Price from '../components/Price'
import { useVehicles } from '../context/VehicleContext'
import { useSettings } from '../context/SettingsContext'
import { useExchangeRates } from '../hooks/useExchangeRates'
import { formatKm } from '../utils/format'
import { currentPrice, vehicleTitle } from '../utils/vehicles'
import { buildWhatsAppLink, vehicleEnquiryMessage } from '../utils/whatsapp'

function SpecRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 text-sm">
      <dt className="text-ink-300">{label}</dt>
      <dd className={`text-right font-medium ${value ? 'text-white' : 'text-ink-500'}`}>{value || 'To be confirmed'}</dd>
    </div>
  )
}

export default function VehicleDetails() {
  const { id } = useParams()
  const { stockVehicles, getVehicle, loading } = useVehicles()
  const { settings } = useSettings()
  const { rates } = useExchangeRates()
  const found = getVehicle(id)
  const v = found && !found.isImport && !found.hidden ? found : null

  useEffect(() => {
    if (v) document.title = `${vehicleTitle(v)} | ${settings.dealershipName}`
  }, [v, settings.dealershipName])

  if (loading && !v) {
    return <div className="container-page py-28"><div className="card h-96 animate-pulse bg-ink-800" aria-busy="true" /></div>
  }

  if (!v) {
    return (
      <div className="container-page py-28 text-center">
        <h1 className="section-title">Vehicle not found</h1>
        <p className="mt-3 text-ink-300">It may have been removed from our listings.</p>
        <Link to="/inventory" className="btn-primary mt-8">Browse inventory</Link>
      </div>
    )
  }

  const title = vehicleTitle(v)
  const message = v.sold
    ? `Hello, I saw the ${title} on your website, which is marked as sold. Do you have something similar available?`
    : vehicleEnquiryMessage(title)
  const whatsappHref = buildWhatsAppLink(settings.whatsapp, message)
  const similar = stockVehicles
    .filter((o) => o.id !== v.id && !o.sold && (o.make === v.make || Math.abs(currentPrice(o) - currentPrice(v)) <= currentPrice(v) * 0.3))
    .sort((a, b) => Math.abs(currentPrice(a) - currentPrice(v)) - Math.abs(currentPrice(b) - currentPrice(v)))
    .slice(0, 3)

  return (
    <div className="container-page py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-ink-300">
        <Link to="/" className="hover:text-white">Home</Link><ChevronRight size={14} />
        <Link to="/inventory" className="hover:text-white">Inventory</Link><ChevronRight size={14} />
        <span className="text-white">{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="relative">
          <VehicleGallery images={v.images || []} title={title} sold={v.sold} />
          {v.sold && (
            <div className="pointer-events-none absolute left-0 right-0 top-0 flex aspect-[4/3] items-center justify-center rounded-2xl bg-black/50">
              <span className="-rotate-12 rounded-md border-4 border-red-500 px-8 py-2 font-display text-4xl font-bold tracking-widest text-red-500 sm:text-6xl">SOLD</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge vehicle={v} />
            {v.condition && <span className="badge border-white/10 text-ink-200">{v.condition}</span>}
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>

          <div className="mt-5"><Price vehicle={v} size="lg" /></div>
          {rates && <p className="mt-2 text-sm text-ink-300">≈ US$ {Math.round(currentPrice(v) / rates.USD).toLocaleString('en-US')} at today's live rate</p>}

          {v.sold && (
            <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              This vehicle has been sold. Message us and we will help you find something similar.
            </p>
          )}
          {!v.sold && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" /> In stock in Windhoek · available now
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-whatsapp flex-1"><MessageCircle size={18} /> {v.sold ? 'Ask for similar cars' : 'WhatsApp enquiry'}</a>
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn-primary flex-1"><Phone size={18} /> Contact dealership</a>
          </div>

          <dl className="mt-8">
            <SpecRow label="Make" value={v.make} />
            <SpecRow label="Model" value={v.model} />
            <SpecRow label="Year" value={v.year} />
            <SpecRow label="Mileage" value={formatKm(v.mileage)} />
            <SpecRow label="Transmission" value={v.transmission} />
            <SpecRow label="Fuel type" value={v.fuel} />
            <SpecRow label="Engine capacity" value={v.engine} />
            <SpecRow label="Colour" value={v.colour} />
            <SpecRow label="Condition" value={v.condition} />
          </dl>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <section>
          <h2 className="text-2xl font-semibold">Description</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-ink-200">{v.description || 'Contact us for more details about this vehicle.'}</p>
        </section>
        {v.specs?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold">Additional specifications</h2>
            <ul className="mt-4 grid gap-2 text-sm text-ink-200">
              {v.specs.map((s, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-ink-850 px-4 py-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" /> {s}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 text-3xl font-semibold">Similar vehicles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <VehicleCard key={s.id} vehicle={s} />)}</div>
        </section>
      )}
    </div>
  )
}