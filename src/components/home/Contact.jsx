import { useState } from 'react'
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import { useSettings } from '../../context/SettingsContext'
import { groupHours } from '../../utils/businessHours'
import { buildWhatsAppLink } from '../../utils/whatsapp'
import { mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl } from '../../utils/maps'

const tel = (p) => `tel:${p.replace(/\s/g, '')}`

export default function Contact() {
  const { settings } = useSettings()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const onSubmit = (e) => {
    e.preventDefault()
    const message = `Hello, my name is ${form.name}.\n${form.message}\nPhone: ${form.phone}`
    window.open(buildWhatsAppLink(settings.whatsapp, message), '_blank', 'noopener')
    setForm({ name: '', phone: '', message: '' })
  }

  return (
    <section id="contact" className="bg-ink-900 py-20">
      <div className="container-page">
        <Reveal><SectionHeading eyebrow="Visit or contact us" title="Find us in Windhoek" /></Reveal>
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal className="space-y-6">
            <ul className="card divide-y divide-white/5 text-sm">
              <li className="flex gap-4 p-5"><MapPin className="shrink-0 text-accent-400" size={20} /><a href={mapsSearchUrl(settings)} target="_blank" rel="noreferrer" className="hover:text-accent-300">{settings.location}</a></li>
              <li className="flex gap-4 p-5">
                <Phone className="shrink-0 text-accent-400" size={20} />
                <span className="flex flex-col">
                  <a href={tel(settings.phone)} className="hover:text-accent-300">{settings.phone}</a>
                  {settings.phone2 && <a href={tel(settings.phone2)} className="hover:text-accent-300">{settings.phone2}</a>}
                </span>
              </li>
              <li className="flex gap-4 p-5"><Mail className="shrink-0 text-accent-400" size={20} /><a href={`mailto:${settings.email}`} className="break-all hover:text-accent-300">{settings.email}</a></li>
              <li className="flex gap-4 p-5">
                <Clock className="shrink-0 text-accent-400" size={20} />
                <span className="flex-1 space-y-1">
                  {groupHours(settings.hours).map((r) => (
                    <span key={r.label} className="flex justify-between gap-4"><span className="text-ink-300">{r.label}</span><span>{r.text}</span></span>
                  ))}
                </span>
              </li>
            </ul>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
              <iframe
                title="Map showing the dealership location"
                src={mapsEmbedUrl(settings)}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0 sm:h-80"
              />
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                <a href={mapsDirectionsUrl(settings)} target="_blank" rel="noreferrer" className="btn-primary"><Navigation size={16} /> Get directions</a>
                <a href={mapsSearchUrl(settings)} target="_blank" rel="noreferrer" className="btn-outline"><ExternalLink size={16} /> Open in Google Maps</a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8">
              <h3 className="font-sans text-xl font-semibold">Send us a message</h3>
              <p className="text-sm text-ink-300">Your message opens in WhatsApp so we can reply quickly.</p>
              <div>
                <label htmlFor="c-name" className="label">Your name</label>
                <input id="c-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="c-phone" className="label">Phone number</label>
                <input id="c-phone" type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="c-msg" className="label">Message</label>
                <textarea id="c-msg" rows={4} className="input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type="submit" className="btn-whatsapp w-full"><MessageCircle size={18} /> Send on WhatsApp</button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}