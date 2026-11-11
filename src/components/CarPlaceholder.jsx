// Stylised car illustration shown when a vehicle has no photo yet.
export default function CarPlaceholder({ label = '', className = '', plain = false }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        plain ? '' : 'bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900'
      } ${className}`}
    >
      {!plain && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(220,38,38,0.28),transparent_65%)]" />
      )}
      <svg
        viewBox="0 0 400 200"
        className="relative w-[80%] max-w-md drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]"
        role="img"
        aria-label={label || 'Vehicle illustration'}
      >
        <defs>
          <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3f3f48" />
            <stop offset="1" stopColor="#17171b" />
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="180" rx="175" ry="8" fill="#000" opacity="0.5" />
        <path
          d="M28 138 L36 116 Q42 104 64 100 L118 94 Q140 64 176 58 L246 58 Q280 60 302 90 L346 98 Q374 104 376 130 L376 142 Q376 150 366 150 L36 150 Q24 150 28 138 Z"
          fill="url(#carBody)"
          stroke="#dc2626"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <path d="M132 94 Q150 70 180 66 L240 66 Q266 68 284 92 Z" fill="#0b0b0d" stroke="#fff" strokeOpacity="0.12" />
        <path d="M210 66 L212 92" stroke="#fff" strokeOpacity="0.15" />
        <path d="M356 112 L374 118 L374 128 L354 126 Z" fill="#fde68a" />
        <rect x="28" y="116" width="10" height="9" rx="2" fill="#dc2626" />
        <circle cx="104" cy="150" r="27" fill="#0a0a0a" stroke="#2c2c32" strokeWidth="3" />
        <circle cx="104" cy="150" r="13" fill="#4a4a52" />
        <circle cx="302" cy="150" r="27" fill="#0a0a0a" stroke="#2c2c32" strokeWidth="3" />
        <circle cx="302" cy="150" r="13" fill="#4a4a52" />
      </svg>
      {label && <span className="absolute bottom-3 left-4 text-xs text-ink-400">{label}</span>}
    </div>
  )
}
