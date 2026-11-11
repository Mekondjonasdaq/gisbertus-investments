import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import CarPlaceholder from './CarPlaceholder'
import PhotoFit from './PhotoFit'

export default function VehicleGallery({ images = [], title = '', sold = false }) {
  const [index, setIndex] = useState(0)
  const [full, setFull] = useState(false)
  const count = images.length
  const touchX = useRef(null)

  useEffect(() => setIndex(0), [title])

  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count])

  // Swipe left / right on a phone to change photo
  const swipe = {
    onTouchStart: (e) => { touchX.current = e.touches[0].clientX },
    onTouchEnd: (e) => {
      if (touchX.current == null || count < 2) return
      const dx = e.changedTouches[0].clientX - touchX.current
      touchX.current = null
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    },
  }

  useEffect(() => {
    if (!full) return
    const onKey = (e) => {
      if (e.key === 'Escape') setFull(false)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [full, go])

  if (count === 0) {
    return <CarPlaceholder label="Photos coming soon" className="aspect-[4/3] w-full rounded-2xl border border-white/5" />
  }

  return (
    <div>
      <div {...swipe} className="group relative aspect-[4/3] touch-pan-y overflow-hidden rounded-2xl border border-white/5 bg-ink-800">
        <button type="button" onClick={() => setFull(true)} className="block h-full w-full cursor-zoom-in" aria-label="Open full screen">
          <PhotoFit src={images[index]} alt={`${title} photo ${index + 1}`} sold={sold} loading="eager" />
        </button>
        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur">
          <Maximize2 size={12} /> {index + 1} / {count}
        </span>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur transition hover:bg-accent-500">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 backdrop-blur transition hover:bg-accent-500">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === index ? 'border-accent-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {full && (
        <div {...swipe} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label="Photo viewer">
          <button type="button" onClick={() => setFull(false)} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 p-3 transition hover:bg-accent-500">
            <X size={22} />
          </button>
          {count > 1 && (
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-4 rounded-full bg-white/10 p-3 transition hover:bg-accent-500">
              <ChevronLeft size={24} />
            </button>
          )}
          <img src={images[index]} alt={`${title} photo ${index + 1}`} className="max-h-[88vh] max-w-full rounded-lg object-contain" />
          {count > 1 && (
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-4 rounded-full bg-white/10 p-3 transition hover:bg-accent-500">
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}