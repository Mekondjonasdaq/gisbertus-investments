import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Fuel, Gauge, Settings2 } from 'lucide-react'
import CarPlaceholder from './CarPlaceholder'
import StatusBadge from './StatusBadge'
import PhotoFit from './PhotoFit'
import Price from './Price'
import { formatKm } from '../utils/format'
import { discountPercent, hasDiscount, vehicleTitle } from '../utils/vehicles'

function Spec({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon size={14} className="shrink-0 text-accent-400" />
      <span className={value ? 'text-ink-200' : 'text-ink-500'}>{value || 'TBC'}</span>
    </div>
  )
}

export default function VehicleCard({ vehicle: v }) {
  const title = vehicleTitle(v)
  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative">
        <Link to={`/vehicle/${v.id}`} className="block aspect-[4/3] overflow-hidden" aria-label={`View ${title}${v.sold ? ' (sold)' : ''}`}>
          {v.images?.[0] ? (
            <PhotoFit src={v.images[0]} alt={title} sold={v.sold} imgClassName="transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <CarPlaceholder label={v.make} className="h-full w-full" />
          )}
        </Link>

        {v.sold && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="-rotate-12 rounded-md border-4 border-red-500 px-6 py-1 font-display text-4xl font-bold tracking-widest text-red-500">SOLD</span>
          </div>
        )}

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
          {!v.sold && <StatusBadge vehicle={v} />}
          {hasDiscount(v) && !v.sold && <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-bold leading-5 text-white sm:text-xs">-{discountPercent(v)}%</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-snug">{title}</h3>
        <div className="mt-2"><Price vehicle={v} /></div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-white/5 pt-4">
          <Spec icon={Calendar} value={v.year} />
          <Spec icon={Gauge} value={formatKm(v.mileage)} />
          <Spec icon={Settings2} value={v.transmission} />
          <Spec icon={Fuel} value={v.fuel} />
        </div>
        {v.condition && <p className="mt-3 text-xs text-ink-300">Condition: <span className="text-white">{v.condition}</span></p>}

        <div className="mt-auto pt-5">
          <Link to={`/vehicle/${v.id}`} className="btn-outline w-full">View details <ArrowRight size={16} /></Link>
        </div>
      </div>
    </article>
  )
}