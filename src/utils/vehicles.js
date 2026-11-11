export const TRANSMISSIONS = ['Automatic', 'Manual']
export const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
export const CONDITIONS = ['Brand new', 'Excellent', 'Good', 'Fair']

export const STATUS_META = {
  in_stock: { label: 'In stock', className: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300' },
  import: { label: 'Import order', className: 'border-amber-500/30 bg-amber-500/15 text-amber-300' },
  sold: { label: 'Sold', className: 'border-red-500/30 bg-red-500/15 text-red-300' },
}

export const statusKey = (v) => (v.sold ? 'sold' : v.isImport ? 'import' : 'in_stock')
export const isAvailable = (v) => !v.sold
export const vehicleTitle = (v) => [v.year, v.make, v.model].filter(Boolean).join(' ')

// Discounts: `price` is the regular price, `salePrice` is the discounted price.
export const hasDiscount = (v) => Number(v.salePrice) > 0 && Number(v.salePrice) < Number(v.price)
export const currentPrice = (v) => (hasDiscount(v) ? Number(v.salePrice) : Number(v.price))
export const discountPercent = (v) => (hasDiscount(v) ? Math.round((1 - Number(v.salePrice) / Number(v.price)) * 100) : 0)

export const SORTS = [
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'price_asc', label: 'Price: lowest first' },
  { value: 'price_desc', label: 'Price: highest first' },
  { value: 'year_desc', label: 'Year: newest first' },
  { value: 'mileage_asc', label: 'Mileage: lowest first' },
]

const num = (x) => (x === '' || x == null ? null : Number(x))

export function applyFilters(list, f) {
  const q = (f.q || '').trim().toLowerCase()
  const minP = num(f.minPrice)
  const maxP = num(f.maxPrice)
  const minY = num(f.minYear)
  const maxY = num(f.maxYear)
  const maxM = num(f.maxMileage)
  const avail = f.availability || 'all'

  return list.filter((v) => {
    const price = currentPrice(v)
    if (avail === 'available' && v.sold) return false
    if (avail === 'sold' && !v.sold) return false
    if (f.make && v.make !== f.make) return false
    if (f.model && v.model !== f.model) return false
    if (minP != null && price < minP) return false
    if (maxP != null && price > maxP) return false
    if (minY != null && !(Number(v.year) >= minY)) return false
    if (maxY != null && !(Number(v.year) <= maxY)) return false
    if (maxM != null && !(v.mileage !== '' && v.mileage != null && Number(v.mileage) <= maxM)) return false
    if (f.transmission && v.transmission !== f.transmission) return false
    if (f.fuel && v.fuel !== f.fuel) return false
    if (q) {
      const hay = [v.make, v.model, v.year, v.colour, v.fuel, v.transmission, v.condition].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

// Sold cars always go to the end of the list (they show a SOLD overlay).
export function sortVehicles(list, sort) {
  const copy = [...list]
  switch (sort) {
    case 'price_asc': copy.sort((a, b) => currentPrice(a) - currentPrice(b)); break
    case 'price_desc': copy.sort((a, b) => currentPrice(b) - currentPrice(a)); break
    case 'year_desc': copy.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0)); break
    case 'mileage_asc':
      copy.sort((a, b) => (a.mileage === '' ? Infinity : a.mileage) - (b.mileage === '' ? Infinity : b.mileage))
      break
    default: copy.sort((a, b) => b.createdAt - a.createdAt)
  }
  return [...copy.filter((v) => !v.sold), ...copy.filter((v) => v.sold)]
}