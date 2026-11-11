import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from '../Reveal'
import VehicleCard from '../VehicleCard'
import { useVehicles } from '../../context/VehicleContext'
import { hasDiscount, isAvailable } from '../../utils/vehicles'

// Special offers = discounted cars that are in stock right now.
export default function Offers() {
  const { stockVehicles } = useVehicles()
  const offers = stockVehicles.filter((v) => isAvailable(v) && hasDiscount(v)).slice(0, 3)

  return (
    <section id="offers" className="py-20">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent-500/30 bg-gradient-to-br from-accent-600 via-accent-500 to-red-900 p-8 sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="text-sm font-semibold text-red-100">Special offers</p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-5xl">New car, new journey. Start yours with us.</h2>
              <p className="mt-4 text-red-50/90">Look for the red price. These discounted cars are in stock in Windhoek and ready to buy.</p>
              <Link to="/inventory" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto">
                See cars in stock <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>

        {offers.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        ) : (
          <p className="mt-8 text-center text-ink-300">No discounted cars right now. Message us on WhatsApp for the latest deals.</p>
        )}
      </div>
    </section>
  )
}