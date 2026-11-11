import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import { useSettings } from '../../context/SettingsContext'

export default function Faq() {
  const { settings } = useSettings()
  const [open, setOpen] = useState(0)

  const items = [
    ['Can I buy a car today?', 'Yes. Cars marked "In stock" are physically in Windhoek and can be bought straight away. Message us on WhatsApp to arrange a viewing.'],
    ['What if the car I want is not in stock?', `Use the Order a Car page. We order it for you from Japan or China. A ${settings.depositPercent}% deposit is required and delivery takes ${settings.importLeadTime}.`],
    ['Why is a deposit required on custom orders?', `A ${settings.depositPercent}% deposit is required when you order a car that is not in stock. Ask us on WhatsApp for the exact payment terms.`],
    ['How long does a custom order take?', `Cars ordered from Japan or China take ${settings.importLeadTime} to arrive.`],
    ['Are the prices on the website final?', 'Message us to confirm the current price before you buy or order.'],
    ['Can I choose the year, colour or mileage?', 'Tell us what you are looking for on WhatsApp and we will confirm what is available.'],
    ['Do you buy cars?', 'Yes. We buy and sell cars. Use the "Sell your car" form on this page and we will reply on WhatsApp.'],
    ['Where can I find you?', `${settings.location}. Check the opening hours in the footer before you visit.`],
    ['Do you offer financing or trade-ins?', 'Message or call us to discuss payment options for the car you want.'],
  ]

  return (
    <section id="faq" className="py-20">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <Reveal><SectionHeading eyebrow="FAQ" title="Questions we hear often" text="Cannot find your answer? Message us and we will help." /></Reveal>
        <Reveal className="space-y-3">
          {items.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <div key={q} className="card overflow-hidden">
                <h3 className="font-sans">
                  <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold">
                    {q}
                    <ChevronDown size={18} className={`shrink-0 text-accent-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </h3>
                <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-ink-300">{a}</p></div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}