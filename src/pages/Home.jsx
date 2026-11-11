import { useMemo } from 'react'
import Hero from '../components/home/Hero'
import VehicleSection from '../components/home/VehicleSection'
import Offers from '../components/home/Offers'
import ImportBanner from '../components/home/ImportBanner'
import WhyUs from '../components/home/WhyUs'
import SellYourCar from '../components/home/SellYourCar'
import Faq from '../components/home/Faq'
import Contact from '../components/home/Contact'
import { useVehicles } from '../context/VehicleContext'
import { isAvailable } from '../utils/vehicles'

export default function Home() {
  const { stockVehicles: vehicles } = useVehicles()

  const featured = useMemo(() => {
    const available = vehicles.filter(isAvailable)
    const picked = available.filter((v) => v.featured)
    return (picked.length ? picked : available).slice(0, 6)
  }, [vehicles])

  const latest = useMemo(
    () => vehicles.filter(isAvailable).sort((a, b) => b.createdAt - a.createdAt).slice(0, 4),
    [vehicles]
  )

  return (
    <>
      <Hero />
      <VehicleSection eyebrow="Featured vehicles" title="Hand-picked for you" text="Our top choices right now." vehicles={featured} />
      <VehicleSection eyebrow="Latest arrivals" title="Just added" vehicles={latest} tinted cols="lg:grid-cols-4" linkLabel="See all arrivals" />
      <Offers />
      <ImportBanner />
      <WhyUs />
      <SellYourCar />
      <Faq />
      <Contact />
    </>
  )
}