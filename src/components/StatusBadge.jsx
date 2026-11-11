import { STATUS_META, statusKey } from '../utils/vehicles'

const DOT = { in_stock: 'bg-emerald-400', import: 'bg-amber-400', sold: 'bg-red-400' }

// Small, tidy pill (a little dot + a short label).
export default function StatusBadge({ vehicle, className = '' }) {
  const key = statusKey(vehicle)
  const meta = STATUS_META[key]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-5 sm:text-xs ${meta.className} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[key]}`} />
      {meta.label}
    </span>
  )
}