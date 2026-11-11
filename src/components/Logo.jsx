import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { useCleanLogo } from '../hooks/useCleanLogo'

// The uploaded logo is cleaned automatically (white or black box removed, dark
// lettering made light, empty margins trimmed) and shown BIG:
//   md (website header) = 72px tall on phones, 96px on desktop, and it shrinks
//   to 56 / 64px once the page is scrolled (compact). lg = footer. side = admin menu.
// If the picture can't be cleaned, the original is shown. If it can't load at
// all, or it is just a small icon, the brand name is written in text beside it.
export default function Logo({ to = '/', size = 'md', showTagline = false, className = '', compact = false }) {
  const { settings } = useSettings()
  const clean = useCleanLogo(settings.logo)
  const [failed, setFailed] = useState(false)
  const [rawRatio, setRawRatio] = useState(null)

  useEffect(() => {
    setFailed(false)
    setRawRatio(null)
  }, [settings.logo])

  const name = settings.dealershipName || 'YOUR DEALERSHIP'
  const initial = name.trim().charAt(0).toUpperCase() || 'D'
  const hasImage = Boolean(settings.logo) && !failed
  const waiting = hasImage && clean.status === 'loading'
  const usingClean = clean.status === 'ready'
  const src = usingClean ? clean.src : settings.logo
  const ratio = usingClean ? clean.ratio : rawRatio
  const showName = !hasImage || (ratio !== null && ratio < 1.3)

  const sizes = {
    sm: { img: 'h-12', box: 'h-10 w-10 text-lg', text: 'text-xs' },
    side: { img: 'h-16', box: 'h-12 w-12 text-xl', text: 'text-sm' },
    md: compact
      ? { img: 'h-14 sm:h-16', box: 'h-12 w-12 text-xl sm:h-14 sm:w-14', text: 'text-sm sm:text-base' }
      : { img: 'h-[72px] sm:h-24', box: 'h-14 w-14 text-2xl sm:h-16 sm:w-16', text: 'text-base sm:text-lg' },
    lg: { img: 'h-20 sm:h-24', box: 'h-14 w-14 text-2xl', text: 'text-lg' },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link to={to} className={`group flex min-w-0 items-center gap-3 ${className}`} aria-label={`${name} home`}>
      {waiting ? (
        <span className={`${s.img} block w-36 shrink-0`} aria-hidden="true" />
      ) : hasImage ? (
        <img
          src={src}
          alt={showName ? '' : name}
          onLoad={(e) => setRawRatio(e.currentTarget.naturalWidth / (e.currentTarget.naturalHeight || 1))}
          onError={() => setFailed(true)}
          className={`${s.img} block w-auto max-w-[68vw] shrink-0 object-contain object-left transition-[height] duration-300 sm:max-w-[420px]`}
          style={!usingClean && settings.logoOnLight ? { filter: 'invert(1) hue-rotate(180deg)', mixBlendMode: 'screen' } : undefined}
        />
      ) : (
        <span className={`${s.box} flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 font-display font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-105`}>
          {initial}
        </span>
      )}
      {showName && !waiting && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className={`${s.text} font-display font-semibold uppercase tracking-[0.1em] text-white sm:tracking-[0.14em]`}>{name}</span>
          {showTagline && settings.tagline && <span className="mt-0.5 text-[11px] text-ink-300">{settings.tagline}</span>}
        </span>
      )}
    </Link>
  )
}