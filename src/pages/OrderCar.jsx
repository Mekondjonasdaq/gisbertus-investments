import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { formatPrice } from '../utils/format'
import { buildWhatsAppLink } from '../utils/whatsapp'

const EMPTY = { make: '', model: '', year: '', budget: '' }

export default function OrderCar() {
  const { settings } = useSettings()
  const [form, setForm] = useState(EMPTY)
  const [link, setLink] = useState('')
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    document.title = `Order a Car | ${settings.dealershipName}`
  }, [settings.dealershipName])

  const onSubmit = (e) => {
    e.preventDefault()
    const message = [
      'Hello, I would like to order a car.',
      '',
      `Make: ${form.make.trim()}`,
      `Model: ${form.model.trim()}`,
      `Year: ${form.year.trim() || 'Any'}`,
      `Budget: ${form.budget ? formatPrice(form.budget) : 'Not sure yet'}`,
    ].join('\n')
    const href = buildWhatsAppLink(settings.whatsapp, message)
    setLink(href)
    window.open(href, '_blank', 'noopener')
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5 bg-ink-900 py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(220,38,38,0.25),transparent_55%)]" />
        <div className="container-page relative">
          <p className="section-eyebrow">Import service</p>
          <h1 className="section-title">Order a car</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-200">
            We can import your dream car from Japan or China. Just tell us the car you want, and we will source it for you.
          </p>
          <p className="mt-4 max-w-2xl rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            Please note: a {settings.depositPercent}% deposit is required and delivery takes {settings.importLeadTime}.
          </p>
        </div>
      </section>

      <div className="container-page mx-auto max-w-3xl space-y-8 py-10 sm:py-14">
        <form onSubmit={onSubmit} className="card space-y-5 p-5 sm:p-8">
          <h2 className="font-sans text-xl font-semibold">Which car do you want?</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="o-make" className="label">Make *</label>
              <input id="o-make" className="input" placeholder="e.g. Toyota" value={form.make} onChange={set('make')} required />
            </div>
            <div>
              <label htmlFor="o-model" className="label">Model *</label>
              <input id="o-model" className="input" placeholder="e.g. Hilux" value={form.model} onChange={set('model')} required />
            </div>
            <div>
              <label htmlFor="o-year" className="label">Year</label>
              <input id="o-year" className="input" placeholder="e.g. 2018" value={form.year} onChange={set('year')} />
            </div>
            <div>
              <label htmlFor="o-budget" className="label">Your budget (N$)</label>
              <input id="o-budget" type="number" min="0" inputMode="numeric" className="input" placeholder="e.g. 250000" value={form.budget} onChange={set('budget')} />
            </div>
          </div>

          <button type="submit" className="btn-whatsapp w-full py-4! text-base!"><MessageCircle size={20} /> Submit</button>
          <p className="text-center text-xs text-ink-400">Submit opens WhatsApp with your request ready to send to us. Nothing is sent until you press send.</p>

          {link && (
            <div role="status" className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
              <p>WhatsApp should have opened. If it did not, <a href={link} target="_blank" rel="noreferrer" className="font-semibold underline">tap here to open it</a>, then press send.</p>
            </div>
          )}
        </form>

        <div className="card p-5 text-center sm:p-8">
          <p className="text-ink-300">Prefer to talk to us?</p>
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn-primary mt-4 w-full py-5! text-lg!">
            <Phone size={22} /> Call us: {settings.phone}
          </a>
        </div>

        <p className="text-center text-sm text-ink-300">
          Looking for a car we already have? <Link to="/inventory" className="font-semibold text-accent-400 hover:underline">Browse cars in stock in Windhoek</Link>.
        </p>
      </div>
    </>
  )
}