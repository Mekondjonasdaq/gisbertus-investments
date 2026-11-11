import { formatPrice } from '../utils/format'
import { currentPrice, discountPercent, hasDiscount } from '../utils/vehicles'

// Regular price, or: original price crossed out + new price in red when discounted.
export default function Price({ vehicle, size = 'md' }) {
  const big = size === 'lg'
  if (!hasDiscount(vehicle)) {
    return <p className={`font-semibold text-white ${big ? 'text-3xl' : 'text-xl'}`}>{formatPrice(vehicle.price)}</p>
  }
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <p className={`font-bold text-red-500 ${big ? 'text-4xl' : 'text-xl'}`}>{formatPrice(currentPrice(vehicle))}</p>
      <p className={`text-ink-400 line-through ${big ? 'text-xl' : 'text-sm'}`}>{formatPrice(vehicle.price)}</p>
      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">Save {discountPercent(vehicle)}%</span>
    </div>
  )
}
