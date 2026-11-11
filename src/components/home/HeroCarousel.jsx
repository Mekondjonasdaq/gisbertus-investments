import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import { currentPrice, vehicleTitle } from '../../utils/vehicles'

const INTERVAL = 3500
const FEATHER =
  'linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (e) => setReduced(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// A "cover flow" of the cars in stock. No frame: each photo fades softly into
// the background so it looks like it floats in the hero. The cars keep rotating
// one by one (the car in front moves on, the next one swings in).
export default function HeroCarousel({ cars }) {
  const n = cars.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = usePrefersReducedMotion()
  const touchX = useRef(null)
  const active = ((index % n) + n) % n
  const current = cars[active]

  // Always advances (people with "reduce motion" get an instant switch instead of a slide).
  useEffect(() => {
    if (n < 2 || paused) return
    const timer = setInterval(() => setIndex((i) => i + 1), INTERVAL)
    return () => clearInterval(timer)
  }, [n, paused])

  const offsetOf = (i) => {
    let d = (((i - active) % n) + n) % n
    if (d > n / 2) d -= n
    return d
  }
  const goTo = (i) => setIndex((c) => c + offsetOf(i))

  return (
    <div
      className="mx-auto w-full [--w:270px] sm:[--w:380px] lg:[--w:420px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Cars in stock"
    >
      <div
        className="relative h-[calc(var(--w)*0.82)] w-full touch-pan-y overflow-hidden"
        style={{ perspective: '1300px' }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          touchX.current = null
          if (Math.abs(dx) > 40) setIndex((i) => i + (dx < 0 ? 1 : -1))
        }}
      >
        <div className="absolute left-1/2 top-1/2 h-[62%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/25 blur-3xl" />
        <div className="absolute bottom-[8%] left-1/2 h-5 w-[48%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-lg" />

        {cars.map((car, i) => {
          const d = n === 1 ? 0 : offsetOf(i)
          const abs = Math.abs(d)
          const scale = abs === 0 ? 1 : abs === 1 ? 0.72 : 0.5
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.6 : abs === 2 ? 0.22 : 0
          const rotate = d === 0 ? 0 : d > 0 ? -30 : 30
          const isActive = d === 0

          return (
            <Link
              key={car.id}
              to={`/vehicle/${car.id}`}
              onClick={(e) => {
                if (!isActive) {
                  e.preventDefault()
                  goTo(i)
                }
              }}
              tabIndex={isActive ? 0 : -1}
              aria-label={`${vehicleTitle(car)}${isActive ? '' : ' (bring to front)'}`}
              className="absolute block"
              style={{
                left: '50%',
                top: '50%',
                width: 'var(--w)',
                height: 'calc(var(--w) * 0.72)',
                marginLeft: 'calc(var(--w) / -2)',
                marginTop: 'calc(var(--w) * -0.36)',
                transform: `translateX(${d * 54}%) translateZ(${-abs * 110}px) rotateY(${rotate}deg) scale(${scale})`,
                opacity,
                zIndex: 10 - abs,
                pointerEvents: abs > 2 ? 'none' : 'auto',
                transition: reduced ? 'none' : 'transform 950ms cubic-bezier(0.65,0,0.35,1), opacity 950ms ease',
              }}
            >
              <img
                src={car.images[0]}
                alt=""
                draggable="false"
                loading={i < 3 ? 'eager' : 'lazy'}
                className="h-full w-full object-contain"
                style={{ WebkitMaskImage: FEATHER, maskImage: FEATHER, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }}
              />
            </Link>
          )
        })}
      </div>

      <div className="mt-2 text-center">
        <p className="font-display text-2xl font-semibold sm:text-3xl">{vehicleTitle(current)}</p>
        <p className="mt-1 text-lg font-semibold text-accent-300">{formatPrice(currentPrice(current))}</p>
        <Link to={`/vehicle/${current.id}`} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-ink-200 transition hover:text-white">
          View details <ArrowRight size={14} />
        </Link>
      </div>

      {n > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button type="button" onClick={() => setIndex((i) => i - 1)} aria-label="Previous car" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-accent-400 hover:text-accent-300">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose a car">
            {cars.map((car, i) => (
              <button
                key={car.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${vehicleTitle(car)}`}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${i === active ? 'w-7 bg-accent-500' : 'w-2.5 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => setIndex((i) => i + 1)} aria-label="Next car" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-accent-400 hover:text-accent-300">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}