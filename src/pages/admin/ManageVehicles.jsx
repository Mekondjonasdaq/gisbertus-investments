import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import CarPlaceholder from '../../components/CarPlaceholder'
import Price from '../../components/Price'
import { useVehicles } from '../../context/VehicleContext'
import { formatKm } from '../../utils/format'
import { vehicleTitle } from '../../utils/vehicles'
import { adminUrl } from '../../config'

export default function ManageVehicles() {
  const { vehicles, loading, updateVehicle, deleteVehicle } = useVehicles()
  const location = useLocation()
  const [flash, setFlash] = useState(location.state?.flash ? { ok: true, text: location.state.flash } : null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const rows = useMemo(
    () =>
      vehicles.filter((v) => {
        if (filter === 'available' && v.sold) return false
        if (filter === 'sold' && !v.sold) return false
        if (filter === 'import' && !v.isImport) return false
        if (filter === 'hidden' && !v.hidden) return false
        if (q && !vehicleTitle(v).toLowerCase().includes(q.trim().toLowerCase())) return false
        return true
      }),
    [vehicles, q, filter]
  )

  const run = async (v, patch, message) => {
    setBusyId(v.id)
    const r = await updateVehicle(v.id, patch)
    setBusyId(null)
    setFlash(r.ok ? { ok: true, text: message } : { ok: false, text: r.error })
  }
  const toggleSold = (v) => run(v, { sold: !v.sold }, `${vehicleTitle(v)} is now marked as ${v.sold ? 'available' : 'SOLD'}.`)
  const toggleHidden = (v) => run(v, { hidden: !v.hidden }, `${vehicleTitle(v)} is now ${v.hidden ? 'shown on' : 'hidden from'} the website.`)
  const changeType = (v, value) => run(v, { isImport: value === 'import' }, `${vehicleTitle(v)} is now "${value === 'import' ? 'Import (hidden)' : 'In Stock'}".`)

  const confirmDelete = async () => {
    const v = toDelete
    setBusyId(v.id)
    const r = await deleteVehicle(v.id)
    setBusyId(null)
    setToDelete(null)
    setFlash(r.ok ? { ok: true, text: `${vehicleTitle(v)} was deleted.` } : { ok: false, text: r.error })
  }

  const soldButton = (v, extra = '') => (
    <button
      type="button"
      onClick={() => toggleSold(v)}
      disabled={busyId === v.id}
      aria-pressed={v.sold}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${extra} ${v.sold ? 'border-red-500 bg-red-600 text-white hover:bg-red-500' : 'border-white/20 text-ink-200 hover:border-red-500 hover:text-red-400'}`}
    >
      {v.sold ? 'SOLD · Mark available' : 'Mark as sold'}
    </button>
  )
  const hiddenButton = (v, extra = '') => (
    <button
      type="button"
      onClick={() => toggleHidden(v)}
      disabled={busyId === v.id}
      aria-pressed={v.hidden}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${extra} ${v.hidden ? 'border-amber-500/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'}`}
    >
      {v.hidden ? 'Hidden · Show' : 'Visible · Hide'}
    </button>
  )
  const typeSelect = (v, className) => (
    <select value={v.isImport ? 'import' : 'in_stock'} onChange={(e) => changeType(v, e.target.value)} disabled={busyId === v.id} aria-label={`Stock type for ${vehicleTitle(v)}`} className={className}>
      <option value="in_stock">In Stock</option>
      <option value="import">Import (hidden)</option>
    </select>
  )
  const thumb = (v, cls) => (
    <div className={`shrink-0 overflow-hidden rounded-lg ${cls}`}>
      {v.images?.[0] ? <img src={v.images[0]} alt="" className={`h-full w-full object-cover ${v.sold ? 'grayscale' : ''}`} /> : <CarPlaceholder className="h-full w-full [&_svg]:w-[90%]" />}
    </div>
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Vehicles ({vehicles.length})</h1>
          <p className="mt-1 text-sm text-ink-300">Only cars set to <strong>In Stock</strong> appear on the website. Sold cars stay visible with a SOLD label unless you hide them.</p>
        </div>
        <Link to={adminUrl('/vehicles/new')} className="btn-primary w-full sm:w-auto"><Plus size={16} /> Add car</Link>
      </div>

      {flash && <p role="status" className={`mb-6 rounded-xl border px-4 py-3 text-sm ${flash.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>{flash.text}</p>}

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input className="input pl-10" placeholder="Search cars" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search cars" />
        </div>
        <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
          <option value="">All cars</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="hidden">Hidden from website</option>
          <option value="import">Import (hidden)</option>
        </select>
      </div>

      {loading ? (
        <div className="card h-48 animate-pulse bg-ink-800" aria-busy="true" />
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center text-ink-300">No cars match. <Link to={adminUrl('/vehicles/new')} className="text-accent-400 hover:underline">Add one</Link>.</div>
      ) : (
        <>
          {/* Phones and small tablets: one card per car with big buttons */}
          <ul className="space-y-4 md:hidden">
            {rows.map((v) => (
              <li key={v.id} className="card p-4">
                <div className="flex gap-4">
                  {thumb(v, 'h-20 w-28')}
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{vehicleTitle(v)}</p>
                    <div className="mt-1"><Price vehicle={v} /></div>
                    <p className="mt-1 text-xs text-ink-400">{v.images?.length || 0} photo(s){v.mileage !== '' ? ` · ${formatKm(v.mileage)}` : ''}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {soldButton(v, 'w-full min-h-[44px]')}
                  {hiddenButton(v, 'w-full min-h-[44px]')}
                </div>
                {typeSelect(v, 'input mt-3')}
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Link to={adminUrl(`/vehicles/${v.id}/edit`)} className="btn-outline min-h-[44px] px-2! py-2!"><Pencil size={16} /> Edit</Link>
                  <Link to={`/vehicle/${v.id}`} target="_blank" className="btn-outline min-h-[44px] px-2! py-2!"><Eye size={16} /> View</Link>
                  <button type="button" onClick={() => setToDelete(v)} className="btn-outline min-h-[44px] px-2! py-2! hover:border-red-500! hover:text-red-400!"><Trash2 size={16} /> Delete</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Tablets and computers: table */}
          <div className="card hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="border-b border-white/5 text-xs text-ink-400">
                <tr>
                  <th className="p-4 font-medium">Car</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Mileage</th>
                  <th className="p-4 font-medium">Stock type</th>
                  <th className="p-4 font-medium">Sold?</th>
                  <th className="p-4 font-medium">On website</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((v) => (
                  <tr key={v.id} className="transition hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        {thumb(v, 'h-14 w-20')}
                        <div>
                          <p className="font-semibold">{vehicleTitle(v)}</p>
                          <p className="text-xs text-ink-400">{v.images?.length || 0} photo(s)</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><Price vehicle={v} /></td>
                    <td className="p-4 text-ink-300">{formatKm(v.mileage) || '—'}</td>
                    <td className="p-4">{typeSelect(v, 'rounded-lg border border-white/10 bg-ink-800 px-3 py-1.5 text-xs font-semibold outline-none focus:border-accent-500')}</td>
                    <td className="p-4">{soldButton(v)}</td>
                    <td className="p-4">{hiddenButton(v)}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <Link to={`/vehicle/${v.id}`} target="_blank" aria-label="View on website" className="rounded-full p-2.5 text-ink-300 transition hover:bg-white/10 hover:text-white"><Eye size={16} /></Link>
                        <Link to={adminUrl(`/vehicles/${v.id}/edit`)} aria-label="Edit" className="rounded-full p-2.5 text-ink-300 transition hover:bg-white/10 hover:text-white"><Pencil size={16} /></Link>
                        <button type="button" onClick={() => setToDelete(v)} aria-label="Delete" className="rounded-full p-2.5 text-ink-300 transition hover:bg-red-500/20 hover:text-red-400"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {toDelete && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="del-title">
          <div className="card w-full max-w-md p-6">
            <h2 id="del-title" className="font-sans text-xl font-semibold">Delete this car?</h2>
            <p className="mt-2 text-sm text-ink-300">{vehicleTitle(toDelete)} and its photos will be removed from the website for everyone. This cannot be undone. To keep it listed, mark it as sold instead.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
              <button type="button" className="btn-outline" onClick={() => setToDelete(null)}>Keep car</button>
              <button type="button" className="btn-danger" onClick={confirmDelete} disabled={busyId === toDelete.id}>Delete car</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}