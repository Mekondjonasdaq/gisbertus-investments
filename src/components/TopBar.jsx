import { useEffect, useState } from 'react'
import { Clock, Phone } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'
import { useExchangeRates } from '../hooks/useExchangeRates'
import { getOpenStatus } from '../utils/businessHours'

function RateItem({ code, value }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-ink-400">{code}</span> <span className="font-semibold text-white">N$ {value.toFixed(2)}</span>
    </span>
  )
}

export default function TopBar() {
  const { settings } = useSettings()
  const { status, rates } = useExchangeRates()
  const [open, setOpen] = useState(() => getOpenStatus(settings.hours))

  useEffect(() => {
    setOpen(getOpenStatus(settings.hours))
    const timer = setInterval(() => setOpen(getOpenStatus(settings.hours)), 30 * 1000)
    return () => clearInterval(timer)
  }, [settings.hours])

  return (
    <div className="border-b border-white/5 bg-ink-900 text-xs text-ink-200">
      <div className="container-page flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {open.isOpen && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${open.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
          </span>
          <span className="font-semibold text-white">{open.isOpen ? 'Open now' : 'Closed now'}</span>
          <span className="hidden items-center gap-1 text-ink-400 sm:inline-flex">
            <Clock size={12} /> Windhoek {open.time}
          </span>
        </div>

        <div className="hidden items-center gap-4 md:flex" aria-label="Live exchange rates">
          <span className="text-ink-400">Live rates</span>
          {status === 'ok' && rates && (
            <>
              <RateItem code="US$" value={rates.USD} />
              <RateItem code="€" value={rates.EUR} />
              <RateItem code="£" value={rates.GBP} />
              <RateItem code="R" value={rates.ZAR} />
            </>
          )}
          {status === 'loading' && <span className="text-ink-400">Loading…</span>}
          {status === 'offline' && <span className="text-ink-400">Rates offline</span>}
        </div>

        <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 transition hover:text-accent-300">
          <Phone size={12} />
          <span className="hidden sm:inline">{settings.phone}</span>
          <span className="sm:hidden">Call us</span>
        </a>
      </div>
    </div>
  )
}
