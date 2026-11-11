import { Car, MessageCircle, Ship, Handshake } from 'lucide-react'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import { useSettings } from '../../context/SettingsContext'

export default function WhyUs() {
  const { settings } = useSettings()
  const reasons = [
    { icon: Car, title: 'Cars in stock', text: 'Browse cars that are physically in Windhoek and ready to buy straight away.' },
    { icon: Ship, title: 'We order for you', text: 'Want something we do not have? We order it from Japan or China. Delivery takes ' + settings.importLeadTime + ', with a ' + settings.depositPercent + '% deposit.' },
    { icon: Handshake, title: 'We buy cars too', text: 'Thinking of selling? Send us your car details and we will make you an offer.' },
    { icon: MessageCircle, title: 'Talk to a real person', text: 'Message us on WhatsApp or call. We reply directly, no call centre.' },
  ]
  const steps = [
    ['Tell us the car', 'Use the Order a Car form with the make, model, year and budget.'],
    ['Pay the deposit', `A ${settings.depositPercent}% deposit secures your custom order.`],
    ['We order it', `We source it from Japan or China. It arrives in ${settings.importLeadTime}.`],
    ['Drive away', 'We confirm the final details and hand over your car.'],
  ]

  return (
    <section className="bg-ink-900 py-20">
      <div className="container-page">
        <Reveal><SectionHeading eyebrow="Why choose us" title="Buying a car should feel simple" /></Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 80}>
              <div className="card card-hover h-full p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400"><Icon size={22} /></span>
                <h3 className="mt-5 font-sans text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <h3 className="text-2xl font-semibold">How a custom order works</h3>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {steps.map(([title, text], i) => (
              <li key={title} className="relative border-t-2 border-accent-500/40 pt-5">
                <span className="font-display text-3xl font-semibold text-accent-400">{i + 1}</span>
                <p className="mt-2 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-ink-300">{text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}