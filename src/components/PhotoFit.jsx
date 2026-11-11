// Shows the WHOLE photo (never cropped), whatever shape it is. Any spare space
// is filled with a blurred copy of the same photo, so it still looks full.
export default function PhotoFit({ src, alt = '', sold = false, loading = 'lazy', className = '', imgClassName = '' }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-ink-800 ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading={loading}
        draggable="false"
        className={`absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl ${sold ? 'grayscale' : ''}`}
      />
      <img
        src={src}
        alt={alt}
        loading={loading}
        draggable="false"
        className={`relative h-full w-full object-contain ${sold ? 'grayscale' : ''} ${imgClassName}`}
      />
    </div>
  )
}