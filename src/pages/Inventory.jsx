import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import VehicleCard from '../components/VehicleCard'
import { useVehicles } from '../context/VehicleContext'
import { applyFilters, SORTS, sortVehicles } from '../utils/vehicles'

const FILTER_KEYS = ['q', 'make', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear', 'maxMileage', 'transmission', 'fuel', 'availability']
const PAGE = 9

export default function Inventory() {
  const { stockVehicles: vehicles, loading } = useVehicles()
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [visible, setVisible] = useState(PAGE)

  const filters = useMemo(() => {
    const f = {}
    FILTER_KEYS.forEach((k) => (f[k] = params.get(k) || ''))
    return f
  }, [params])
  const sort = params.get('sort') || 'newest'

  const update = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => (v === '' || v == null ? next.delete(k) : next.set(k, v)))
    setParams(next, { replace: true })
    setVisible(PAGE)
  }
  const clear = () => {
    setParams({}, { replace: true })
    setVisible(PAGE)
  }

  const results = useMemo(() => sortVehicles(applyFilters(vehicles, filters), sort), [vehicles, filters, sort])
  const activeCount = FILTER_KEYS.filter((k) => filters[k]).length

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5 bg-ink-900 py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(220,38,38,0.22),transparent_55%)]" />
        <div className="container-page relative">
          <p className="section-eyebrow">Our vehicles</p>
          <h1 className="section-title">Vehicle inventory</h1>
          <p className="mt-3 max-w-xl text-ink-300">Cars in stock in Windhoek, ready to buy now. Every price is in Namibian Dollars.</p>
        </div>
      </section>

      <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <button type="button" onClick={() => setShowFilters((s) => !s)} className="btn-outline mb-4 w-full lg:hidden" aria-expanded={showFilters}>
            <SlidersHorizontal size={16} /> {showFilters ? 'Hide filters' : 'Show filters'}{activeCount > 0 && ` (${activeCount})`}
          </button>
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <SearchBar filters={filters} onChange={update} onClear={clear} vehicles={vehicles} />
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-300" role="status">
              <span className="font-semibold text-white">{results.length}</span> {results.length === 1 ? 'vehicle' : 'vehicles'} found
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm text-ink-300">Sort by</label>
              <select id="sort" className="input w-auto py-2" value={sort} onChange={(e) => update({ sort: e.target.value === 'newest' ? '' : e.target.value })}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
              {[0, 1, 2].map((i) => <div key={i} className="card h-96 animate-pulse bg-ink-800" />)}
            </div>
          ) : results.length === 0 ? (
            <div className="card p-12 text-center">
              <h2 className="text-2xl font-semibold">No vehicles match your search</h2>
              <p className="mt-2 text-ink-300">Try removing a filter, or tell us what you want and we will import it for you.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button type="button" onClick={clear} className="btn-outline">Clear all filters</button>
                <Link to="/order" className="btn-primary">Order a car</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.slice(0, visible).map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
              {visible < results.length && (
                <div className="mt-10 text-center">
                  <button type="button" className="btn-outline" onClick={() => setVisible((n) => n + PAGE)}>
                    Load more ({results.length - visible} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  )
}