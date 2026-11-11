import { useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { FUELS, TRANSMISSIONS } from '../utils/vehicles'

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

// Filter panel for the inventory page. `filters` values are strings.
export default function SearchBar({ filters, onChange, onClear, vehicles }) {
  const makes = useMemo(() => [...new Set(vehicles.map((v) => v.make).filter(Boolean))].sort(), [vehicles])
  const models = useMemo(
    () =>
      [...new Set(vehicles.filter((v) => !filters.make || v.make === filters.make).map((v) => v.model).filter(Boolean))].sort(),
    [vehicles, filters.make]
  )

  return (
    <div className="card space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-base font-semibold">Filters</h2>
        <button type="button" onClick={onClear} className="flex items-center gap-1 text-xs text-ink-300 transition hover:text-accent-300">
          <X size={12} /> Clear all
        </button>
      </div>

      <Field label="Search">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-10" placeholder="e.g. Golf, red, petrol" value={filters.q} onChange={(e) => onChange({ q: e.target.value })} />
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
        <Field label="Make">
          <select className="input" value={filters.make} onChange={(e) => onChange({ make: e.target.value, model: '' })}>
            <option value="">All makes</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Model">
          <select className="input" value={filters.model} onChange={(e) => onChange({ model: e.target.value })}>
            <option value="">All models</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Min price (N$)">
          <input type="number" min="0" inputMode="numeric" className="input" placeholder="0" value={filters.minPrice} onChange={(e) => onChange({ minPrice: e.target.value })} />
        </Field>
        <Field label="Max price (N$)">
          <input type="number" min="0" inputMode="numeric" className="input" placeholder="Any" value={filters.maxPrice} onChange={(e) => onChange({ maxPrice: e.target.value })} />
        </Field>
        <Field label="Year from">
          <input type="number" min="1980" inputMode="numeric" className="input" placeholder="Any" value={filters.minYear} onChange={(e) => onChange({ minYear: e.target.value })} />
        </Field>
        <Field label="Year to">
          <input type="number" min="1980" inputMode="numeric" className="input" placeholder="Any" value={filters.maxYear} onChange={(e) => onChange({ maxYear: e.target.value })} />
        </Field>
      </div>

      <Field label="Maximum mileage (km)">
        <input type="number" min="0" inputMode="numeric" className="input" placeholder="Any" value={filters.maxMileage} onChange={(e) => onChange({ maxMileage: e.target.value })} />
      </Field>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
        <Field label="Transmission">
          <select className="input" value={filters.transmission} onChange={(e) => onChange({ transmission: e.target.value })}>
            <option value="">Any</option>
            {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Fuel type">
          <select className="input" value={filters.fuel} onChange={(e) => onChange({ fuel: e.target.value })}>
            <option value="">Any</option>
            {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Availability">
        <select className="input" value={filters.availability} onChange={(e) => onChange({ availability: e.target.value })}>
          <option value="">All cars (sold shown last)</option>
          <option value="available">Available only</option>
          <option value="sold">Sold only</option>
        </select>
      </Field>
    </div>
  )
}