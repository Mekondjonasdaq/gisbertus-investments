import { useRef, useState } from 'react'
import { ImagePlus, Star, Trash2 } from 'lucide-react'
import { deleteImages, uploadImage } from '../../lib/vehicleApi'
import { formatPrice } from '../../utils/format'
import { CONDITIONS, FUELS, TRANSMISSIONS } from '../../utils/vehicles'

const MAX_PHOTOS = 12
let counter = 0
const uid = () => `img_${Date.now()}_${counter++}`

const EMPTY = {
  make: '', model: '', year: '', price: '', salePrice: '', mileage: '', transmission: '', fuel: '', engine: '',
  colour: '', condition: '', description: '', specsText: '', featured: false, sold: false, isImport: false, hidden: false,
}

const fromVehicle = (v) => ({
  ...EMPTY,
  ...v,
  year: v.year ?? '', price: v.price ?? '', salePrice: v.salePrice ?? '', mileage: v.mileage ?? '',
  specsText: (v.specs || []).join('\n'),
})

const pctFrom = (price, sale) => (price > 0 && sale > 0 && sale < price ? String(Math.round((1 - sale / price) * 1000) / 10) : '')

function Field({ label, htmlFor, children, hint }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}

// Shared by Add and Edit. onSubmit(payload) must return a Promise of { ok, error? }.
export default function VehicleForm({ vehicle, onSubmit, submitLabel = 'Save vehicle' }) {
  const [form, setForm] = useState(() => (vehicle ? fromVehicle(vehicle) : EMPTY))
  const [photos, setPhotos] = useState(() => (vehicle?.images || []).map((url) => ({ id: uid(), url })))
  const [removed, setRemoved] = useState([])
  const [discountOn, setDiscountOn] = useState(() => Boolean(vehicle && Number(vehicle.salePrice) > 0))
  const [pct, setPct] = useState(() => (vehicle ? pctFrom(Number(vehicle.price), Number(vehicle.salePrice)) : ''))
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  // ---- discount helpers: percent and sale price stay in sync
  const onPrice = (e) => {
    const price = e.target.value
    setForm((f) => {
      const next = { ...f, price }
      if (discountOn && pct !== '') next.salePrice = String(Math.round(Number(price) * (1 - Number(pct) / 100)))
      return next
    })
  }
  const onPct = (e) => {
    const value = e.target.value
    setPct(value)
    const p = Number(form.price)
    setForm((f) => ({ ...f, salePrice: value !== '' && p > 0 ? String(Math.round(p * (1 - Number(value) / 100))) : '' }))
  }
  const onSale = (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, salePrice: value }))
    setPct(pctFrom(Number(form.price), Number(value)))
  }
  const toggleDiscount = (e) => {
    setDiscountOn(e.target.checked)
    if (!e.target.checked) {
      setForm((f) => ({ ...f, salePrice: '' }))
      setPct('')
    }
  }

  // ---- photos
  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return setError('Please choose image files (JPG, PNG or WebP).')
    const room = MAX_PHOTOS - photos.length
    if (room <= 0) return setError(`You can add up to ${MAX_PHOTOS} photos per car.`)
    setError(files.length > room ? `Only the first ${room} photo(s) were added (max ${MAX_PHOTOS}).` : '')
    const added = files.slice(0, room).map((file) => ({ id: uid(), url: URL.createObjectURL(file), file }))
    setPhotos((p) => [...p, ...added])
    if (fileRef.current) fileRef.current.value = ''
  }
  const makeMain = (i) => setPhotos((p) => [p[i], ...p.filter((_, idx) => idx !== i)])
  const removePhoto = (i) => {
    const photo = photos[i]
    if (!photo.file) setRemoved((r) => [...r, photo.url])
    setPhotos((p) => p.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const price = Number(form.price)
    if (!form.make.trim() || !form.model.trim()) return setError('Make and model are required.')
    if (!(price > 0)) return setError('Enter a regular price greater than 0.')
    if (discountOn && !(Number(form.salePrice) > 0 && Number(form.salePrice) < price)) {
      return setError('The discounted price must be lower than the regular price.')
    }

    setBusy(true)
    const newlyUploaded = []
    try {
      const urls = []
      const total = photos.filter((p) => p.file).length
      let done = 0
      for (const photo of photos) {
        if (photo.file) {
          done += 1
          setProgress(`Uploading photo ${done} of ${total}…`)
          const url = await uploadImage(photo.file)
          newlyUploaded.push(url)
          urls.push(url)
        } else urls.push(photo.url)
      }
      setProgress('Saving…')
      const result = await onSubmit({
        make: form.make.trim(),
        model: form.model.trim(),
        year: form.year === '' ? '' : Number(form.year),
        price,
        salePrice: discountOn ? Number(form.salePrice) : '',
        mileage: form.mileage === '' ? '' : Number(form.mileage),
        transmission: form.transmission,
        fuel: form.fuel,
        engine: form.engine.trim(),
        colour: form.colour.trim(),
        condition: form.condition,
        description: form.description.trim(),
        specs: form.specsText.split('\n').map((s) => s.trim()).filter(Boolean),
        images: urls,
        featured: form.featured,
        sold: form.sold,
        isImport: form.isImport,
        hidden: form.hidden,
      })
      if (result.ok) {
        if (removed.length) deleteImages(removed)
        return
      }
      if (newlyUploaded.length) deleteImages(newlyUploaded)
      setError(result.error || 'Could not save this vehicle.')
    } catch (err) {
      if (newlyUploaded.length) deleteImages(newlyUploaded)
      setError(err.message || 'Upload failed. Check your internet connection and try again.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }

  const salePreview = discountOn && Number(form.salePrice) > 0 && Number(form.salePrice) < Number(form.price)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="card space-y-5 p-6">
        <h2 className="font-sans text-lg font-semibold">Vehicle details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Make *" htmlFor="f-make"><input id="f-make" className="input" value={form.make} onChange={set('make')} placeholder="e.g. Volkswagen" required /></Field>
          <Field label="Model *" htmlFor="f-model"><input id="f-model" className="input" value={form.model} onChange={set('model')} placeholder="e.g. Golf 7 GTi" required /></Field>
          <Field label="Manufacturing year" htmlFor="f-year"><input id="f-year" type="number" min="1950" max={new Date().getFullYear() + 1} className="input" value={form.year} onChange={set('year')} /></Field>
          <Field label="Mileage (km)" htmlFor="f-km"><input id="f-km" type="number" min="0" className="input" value={form.mileage} onChange={set('mileage')} /></Field>
          <Field label="Transmission" htmlFor="f-trans">
            <select id="f-trans" className="input" value={form.transmission} onChange={set('transmission')}>
              <option value="">Not specified</option>{TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Fuel type" htmlFor="f-fuel">
            <select id="f-fuel" className="input" value={form.fuel} onChange={set('fuel')}>
              <option value="">Not specified</option>{FUELS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Engine capacity" htmlFor="f-engine"><input id="f-engine" className="input" value={form.engine} onChange={set('engine')} placeholder="e.g. 2.0L" /></Field>
          <Field label="Exterior colour" htmlFor="f-colour"><input id="f-colour" className="input" value={form.colour} onChange={set('colour')} /></Field>
          <Field label="Condition" htmlFor="f-cond">
            <select id="f-cond" className="input" value={form.condition} onChange={set('condition')}>
              <option value="">Not specified</option>{CONDITIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Description" htmlFor="f-desc"><textarea id="f-desc" rows={5} className="input resize-y" value={form.description} onChange={set('description')} /></Field>
        <Field label="Additional specifications" htmlFor="f-specs" hint="One per line, e.g. Leather seats, Reverse camera, Service history."><textarea id="f-specs" rows={4} className="input resize-y" value={form.specsText} onChange={set('specsText')} /></Field>
      </section>

      <section className="card space-y-5 p-6">
        <h2 className="font-sans text-lg font-semibold">Price and discount</h2>
        <Field label="Regular price (N$) *" htmlFor="f-price"><input id="f-price" type="number" min="0" className="input max-w-xs" value={form.price} onChange={onPrice} required /></Field>

        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <input type="checkbox" className="h-4 w-4 accent-red-600" checked={discountOn} onChange={toggleDiscount} /> Put this car on discount
        </label>

        {discountOn && (
          <div className="space-y-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Discount (%)" htmlFor="f-pct"><input id="f-pct" type="number" min="1" max="99" step="0.1" className="input" value={pct} onChange={onPct} placeholder="e.g. 10" /></Field>
              <Field label="Discounted price (N$)" htmlFor="f-sale" hint="Type a percentage or the new price. They update each other."><input id="f-sale" type="number" min="0" className="input" value={form.salePrice} onChange={onSale} /></Field>
            </div>
            {salePreview && (
              <p className="text-sm text-ink-300">
                Customers will see: <span className="mx-1 text-ink-400 line-through">{formatPrice(form.price)}</span>
                <span className="text-lg font-bold text-red-500">{formatPrice(form.salePrice)}</span>
              </p>
            )}
          </div>
        )}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-sans text-lg font-semibold">Status</h2>
        <Field
          label="Stock type"
          htmlFor="f-type"
          hint={form.isImport ? 'Import orders are NOT shown on the website. Use this only to keep a record.' : 'Shown on the website. Customers can buy this car now.'}
        >
          <select id="f-type" className="input" value={form.isImport ? 'import' : 'in_stock'} onChange={(e) => setForm((f) => ({ ...f, isImport: e.target.value === 'import' }))}>
            <option value="in_stock">In Stock (in Windhoek, available to buy now)</option>
            <option value="import">Import Order (hidden, not shown on the website)</option>
          </select>
        </Field>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-red-600" checked={form.sold} onChange={set('sold')} />
          <span><strong>Mark as SOLD</strong> <span className="text-ink-400">(the car stays on the website with a big SOLD label)</span></span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-red-600" checked={form.hidden} onChange={set('hidden')} />
          <span><strong>Hide from website</strong> <span className="text-ink-400">(customers will not see this car at all. A sold car stays visible with a SOLD label unless you tick this.)</span></span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-red-600" checked={form.featured} onChange={set('featured')} />
          <span><strong>Featured</strong> <span className="text-ink-400">(show in "Featured vehicles" on the homepage)</span></span>
        </label>
      </section>

      <section className="card space-y-5 p-6">
        <h2 className="font-sans text-lg font-semibold">Photographs ({photos.length}/{MAX_PHOTOS})</h2>
        <label
          htmlFor="f-photos"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 px-6 py-10 text-center transition hover:border-accent-500"
        >
          <ImagePlus className="text-accent-400" size={32} />
          <span className="font-semibold">Click or drop photos here</span>
          <span className="text-xs text-ink-400">You can pick many at once. Photos are kept sharp (up to 1600 px wide) and the first one is the main photo.</span>
          <input ref={fileRef} id="f-photos" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
        </label>

        {photos.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.id} className="relative overflow-hidden rounded-xl border border-white/10">
                <img src={p.url} alt={`Photo ${i + 1}`} className="aspect-[4/3] w-full object-cover" />
                {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-semibold">Main photo</span>}
                {p.file && <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs">New</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-between gap-2 bg-gradient-to-t from-black/90 to-transparent p-2">
                  {i !== 0 ? <button type="button" onClick={() => makeMain(i)} className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-2 text-xs font-medium hover:bg-white/30"><Star size={14} /> Make main</button> : <span />}
                  <button type="button" onClick={() => removePhoto(i)} aria-label={`Remove photo ${i + 1}`} className="rounded-full bg-red-600/90 p-2.5 hover:bg-red-500"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button type="submit" className="btn-primary w-full py-3.5! sm:w-auto" disabled={busy}>{busy ? 'Please wait…' : submitLabel}</button>
        {progress && <span className="text-sm text-ink-300" role="status">{progress}</span>}
      </div>
    </form>
  )
}