import { Outlet } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'
import { useSettings } from '../context/SettingsContext'
import { useVehicles } from '../context/VehicleContext'
import { buildWhatsAppLink, GENERAL_ENQUIRY_MESSAGE } from '../utils/whatsapp'

export default function Layout() {
  const { settings } = useSettings()
  const { error } = useVehicles()
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      {error && <p role="alert" className="bg-red-600 px-4 py-2 text-center text-sm font-medium">{error}</p>}
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <a
        href={buildWhatsAppLink(settings.whatsapp, GENERAL_ENQUIRY_MESSAGE)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-110"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  )
}