import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import Reveal from '../Reveal'
import { useSettings } from '../../context/SettingsContext'
import { buildWhatsAppLink } from '../../utils/whatsapp'

export default function SellYourCar() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ car: '', year: '', mileage: '', name: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const message = `Hello, I would like to sell my car to you.\nCar: ${form.car}\nYear: ${form.year || 'n/a'}\nMileage: ${form.mileage || 'n/a'} km\nName: ${form.name}`
    window.open(buildWhatsAppLink(settings.whatsapp, message), '_blank', 'noopener')
  }

  return (
    <section id="sell" className="py-20">
      <div className="container-page">
        <Reveal>
          <div className="grid gap-10 overflow-hidden rounded-3xl border border-white/10 bg-ink-850 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="section-eyebrow">We buy cars</p>
              <h2 className="section-title">Sell your car to us</h2>
              <p className="mt-4 max-w-md text-ink-300">
                Tell us about your car and we will reply on WhatsApp with next steps. No obligation.
              </p>
            </div>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="sell-car" className="label">Make and model</label>
                <input id="sell-car" className="input" placeholder="e.g. Toyota Hilux" value={form.car} onChange={set('car')} required />
              </div>
              <div>
                <label htmlFor="sell-year" className="label">Year</label>
                <input id="sell-year" type="number" className="input" placeholder="2016" value={form.year} onChange={set('year')} />
              </div>
              <div>
                <label htmlFor="sell-km" className="label">Mileage (km)</label>
                <input id="sell-km" type="number" className="input" placeholder="120000" value={form.mileage} onChange={set('mileage')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="sell-name" className="label">Your name</label>
                <input id="sell-name" className="input" value={form.name} onChange={set('name')} required />
              </div>
              <button type="submit" className="btn-whatsapp sm:col-span-2"><MessageCircle size={18} /> Get an offer on WhatsApp</button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
