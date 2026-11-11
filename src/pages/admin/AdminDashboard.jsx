import { Link } from 'react-router-dom'
import { Banknote, Car, CheckCircle2, Clock, Percent, Plus, Truck } from 'lucide-react'
import { useVehicles } from '../../context/VehicleContext'
import { formatPrice } from '../../utils/format'
import { currentPrice, hasDiscount, isAvailable, vehicleTitle } from '../../utils/vehicles'
import Price from '../../components/Price'
import { adminUrl } from '../../config'

function Stat({ icon: Icon, label, value, note }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-ink-300 sm:text-sm">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400"><Icon size={18} /></span>
      </div>
      <p className="mt-3 break-words text-2xl font-semibold sm:text-3xl">{value}</p>
      {note && <p className="mt-1 text-xs text-ink-400">{note}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { vehicles, loading } = useVehicles()
  const available = vehicles.filter((v) => isAvailable(v) && !v.isImport && !v.hidden)
  const sold = vehicles.filter((v) => v.sold)
  const discounted = available.filter(hasDiscount)
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent = vehicles.filter((v) => v.createdAt >= weekAgo)
  const stockValue = available.reduce((sum, v) => sum + currentPrice(v), 0)

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-ink-300">Everything you change here goes live for all customers straight away.</p>
        </div>
        <Link to={adminUrl('/vehicles/new')} className="btn-primary"><Plus size={16} /> Add car</Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <Stat icon={Car} label="Total cars" value={loading ? '…' : vehicles.length} />
        <Stat icon={CheckCircle2} label="In stock (on website)" value={loading ? '…' : available.length} />
        <Stat icon={Truck} label="Sold" value={loading ? '…' : sold.length} />
        <Stat icon={Percent} label="On discount" value={loading ? '…' : discounted.length} />
        <Stat icon={Clock} label="Added in last 7 days" value={loading ? '…' : recent.length} />
        <Stat icon={Banknote} label="Value of available cars" value={loading ? '…' : formatPrice(stockValue)} note="Using today's selling prices" />
      </div>

      <section className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-sans text-lg font-semibold">Recently added</h2>
          <Link to={adminUrl('/vehicles')} className="text-sm text-accent-400 hover:underline">Manage all</Link>
        </div>
        <ul className="divide-y divide-white/5">
          {vehicles.slice(0, 6).map((v) => (
            <li key={v.id} className="flex flex-wrap items-center justify-between gap-4 py-3 text-sm">
              <Link to={adminUrl(`/vehicles/${v.id}/edit`)} className="font-medium hover:text-accent-300">{vehicleTitle(v)}{v.sold ? ' (sold)' : ''}</Link>
              <Price vehicle={v} />
            </li>
          ))}
          {!loading && vehicles.length === 0 && <li className="py-3 text-sm text-ink-300">No cars yet. Add your first one.</li>}
        </ul>
      </section>
    </div>
  )
}