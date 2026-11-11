import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { uploadImage } from '../../lib/vehicleApi'
import { detectLightBackground } from '../../utils/images'
import { DAY_NAMES, DAY_ORDER } from '../../utils/businessHours'

function Field({ label, id, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}

const SOCIALS = [
  ['facebook', 'Facebook page URL'],
  ['instagram', 'Instagram URL'],
  ['tiktok', 'TikTok URL'],
  ['twitter', 'X / Twitter URL'],
  ['youtube', 'YouTube URL'],
]

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings()
  const [form, setForm] = useState(() => ({
    ...settings,
    hours: { ...settings.hours },
    social: { ...settings.social },
  }))
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)
  const logoRef = useRef(null)
  const heroRef = useRef(null)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setSocial = (key) => (e) => setForm((f) => ({ ...f, social: { ...f.social, [key]: e.target.value } }))
  const setHours = (day, patch) => setForm((f) => ({ ...f, hours: { ...f.hours, [day]: { ...f.hours[day], ...patch } } }))

  const onLogo = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setMessage({ ok: true, text: 'Uploading logo…' })
      const url = await uploadImage(file, 'branding', { maxWidth: 1000, type: 'image/png', trim: true })
      const light = await detectLightBackground(file)
      setForm((f) => ({ ...f, logo: url, logoOnLight: light }))
      setMessage({ ok: true, text: light ? 'Logo uploaded. It has a white background, so it will be blended into the dark header. Click "Save settings" to apply it.' : 'Logo uploaded. Click "Save settings" to apply it.' })
    } catch (err) {
      setMessage({ ok: false, text: err.message || 'Could not upload the logo.' })
    }
    if (logoRef.current) logoRef.current.value = ''
  }

  const onHero = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setMessage({ ok: true, text: 'Uploading background photo…' })
      const url = await uploadImage(file, 'branding', { maxWidth: 1920, quality: 0.8 })
      setForm((f) => ({ ...f, heroImage: url }))
      setMessage({ ok: true, text: 'Background photo uploaded. Click "Save settings" to apply it.' })
    } catch (err) {
      setMessage({ ok: false, text: err.message || 'Could not upload the photo.' })
    }
    if (heroRef.current) heroRef.current.value = ''
  }

  const onSave = async (e) => {
    e.preventDefault()
    const digits = String(form.whatsapp).replace(/\D/g, '')
    if (digits.length < 9) return setMessage({ ok: false, text: 'Enter the WhatsApp number with country code, e.g. 264812002291.' })
    setBusy(true)
    const result = await updateSettings({
      ...form,
      whatsapp: digits,
      depositPercent: Number(form.depositPercent) || 0,
    })
    setBusy(false)
    setMessage(result.ok ? { ok: true, text: 'Settings saved. The website is updated for everyone.' } : { ok: false, text: result.error })
  }

  return (
    <form onSubmit={onSave} className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-ink-300">Business details shown across the website.</p>
      </div>

      <section className="card space-y-5 p-6">
        <h2 className="font-sans text-lg font-semibold">Branding</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Dealership name" id="s-name"><input id="s-name" className="input" value={form.dealershipName} onChange={set('dealershipName')} required /></Field>
          <Field label="Tagline" id="s-tag"><input id="s-tag" className="input" value={form.tagline} onChange={set('tagline')} /></Field>
        </div>
        <div>
          <span className="label">Logo</span>
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-24 w-48 items-center justify-center rounded-xl border border-white/10 bg-ink-800 p-3">
              {form.logo ? <img src={form.logo} alt="Logo preview" className="max-h-full max-w-full object-contain" style={form.logoOnLight ? { filter: 'invert(1) hue-rotate(180deg)', mixBlendMode: 'screen' } : undefined} /> : <span className="text-xs text-ink-400">Temporary text logo</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="btn-outline cursor-pointer"><ImagePlus size={16} /> Upload logo<input ref={logoRef} type="file" accept="image/*" className="sr-only" onChange={onLogo} /></label>
              {form.logo && <button type="button" className="btn-ghost" onClick={() => setForm((f) => ({ ...f, logo: '' }))}><Trash2 size={16} /> Remove</button>}
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-400">Empty space around the logo is trimmed automatically so it shows large in the header. A wide PNG works best. Click "Save settings" at the bottom to apply it.</p>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-red-600" checked={Boolean(form.logoOnLight)} onChange={(e) => setForm((f) => ({ ...f, logoOnLight: e.target.checked }))} />
            <span><strong>My logo has a white background</strong> <span className="text-ink-400">(removes the white box so the logo blends into the dark header. Untick if your logo is already made for a dark background.)</span></span>
          </label>
        </div>

        <div className="border-t border-white/5 pt-5">
          <span className="label">Hero background photo (optional)</span>
          <p className="mb-3 text-xs text-ink-400">A photo of a car interior, shown very faintly and slowly zooming behind the homepage hero. If you leave it empty, an animated dashboard is drawn instead.</p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-36 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-ink-800">
              {form.heroImage ? <img src={form.heroImage} alt="Hero background preview" className="h-full w-full object-cover opacity-60" /> : <span className="text-xs text-ink-400">Animated dashboard</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="btn-outline cursor-pointer"><ImagePlus size={16} /> Upload photo<input ref={heroRef} type="file" accept="image/*" className="sr-only" onChange={onHero} /></label>
              {form.heroImage && <button type="button" className="btn-ghost" onClick={() => setForm((f) => ({ ...f, heroImage: '' }))}><Trash2 size={16} /> Remove</button>}
            </div>
          </div>
        </div>
      </section>

      <section className="card space-y-5 p-6">
        <h2 className="font-sans text-lg font-semibold">Contact details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone number" id="s-phone"><input id="s-phone" className="input" value={form.phone} onChange={set('phone')} /></Field>
          <Field label="Second phone number" id="s-phone2"><input id="s-phone2" className="input" value={form.phone2} onChange={set('phone2')} /></Field>
          <Field label="WhatsApp number" id="s-wa" hint="Digits only with country code, no +. Example: 264812002291"><input id="s-wa" className="input" value={form.whatsapp} onChange={set('whatsapp')} /></Field>
          <Field label="Email address" id="s-email"><input id="s-email" type="email" className="input" value={form.email} onChange={set('email')} /></Field>
        </div>
        <Field label="Physical location" id="s-loc"><input id="s-loc" className="input" value={form.location} onChange={set('location')} /></Field>
        <Field label="Map location (for Google Maps)" id="s-map" hint="For an exact pin: in Google Maps, right-click your spot, click the numbers at the top of the menu to copy them (like -22.5609, 17.0658), and paste them here. Or type your business name and town.">
          <input id="s-map" className="input" value={form.mapQuery} onChange={set('mapQuery')} placeholder="-22.5609, 17.0658" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Deposit required (%)" id="s-dep"><input id="s-dep" type="number" min="0" max="100" className="input" value={form.depositPercent} onChange={set('depositPercent')} /></Field>
          <Field label="Import delivery time" id="s-lead"><input id="s-lead" className="input" value={form.importLeadTime} onChange={set('importLeadTime')} /></Field>
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="font-sans text-lg font-semibold">Opening hours (Namibian time)</h2>
        {DAY_ORDER.map((d) => {
          const h = form.hours[d]
          return (
            <div key={d} className="rounded-xl border border-white/5 p-3 sm:grid sm:grid-cols-[140px_auto_1fr_1fr] sm:items-center sm:gap-4 sm:border-0 sm:p-0">
              <div className="flex items-center justify-between sm:contents">
                <span className="text-sm font-medium">{DAY_NAMES[d]}</span>
                <label className="flex min-h-[44px] items-center gap-2 text-sm text-ink-300 sm:min-h-0 sm:text-xs">
                  <input type="checkbox" className="h-4 w-4 accent-red-600" checked={h.closed} onChange={(e) => setHours(d, { closed: e.target.checked })} /> Closed
                </label>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:mt-0 sm:contents">
                <input type="time" aria-label={`${DAY_NAMES[d]} opens`} className="input py-2.5 disabled:opacity-40" value={h.open} disabled={h.closed} onChange={(e) => setHours(d, { open: e.target.value })} />
                <input type="time" aria-label={`${DAY_NAMES[d]} closes`} className="input py-2.5 disabled:opacity-40" value={h.close} disabled={h.closed} onChange={(e) => setHours(d, { close: e.target.value })} />
              </div>
            </div>
          )
        })}
      </section>

      <section className="card space-y-5 p-6">
        <h2 className="font-sans text-lg font-semibold">Social media links</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {SOCIALS.map(([key, label]) => (
            <Field key={key} label={label} id={`s-${key}`}>
              <input id={`s-${key}`} type="url" className="input" placeholder="https://" value={form.social[key]} onChange={setSocial(key)} />
            </Field>
          ))}
        </div>
      </section>

      {message && <p role="status" className={`rounded-xl border px-4 py-3 text-sm ${message.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>{message.text}</p>}

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button type="submit" className="btn-primary w-full py-3.5! sm:w-auto" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
      </div>
    </form>
  )
}