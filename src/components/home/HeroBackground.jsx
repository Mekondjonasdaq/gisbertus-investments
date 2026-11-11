// Barely-visible car interior behind the hero, with slow animation.
// - If the owner uploaded a "hero background" photo in Settings, that photo is
//   used (faint, slowly zooming).
// - Otherwise a drawn dashboard is shown: steering wheel, gauges with sweeping
//   needles, a navigation screen and vents, all very faint.
const CSS = `
@keyframes hb-drift { 0%,100% { transform: translate3d(0,0,0) scale(1.04); } 50% { transform: translate3d(-16px,-9px,0) scale(1.08); } }
@keyframes hb-kenburns { 0% { transform: scale(1.05) translate3d(0,0,0); } 100% { transform: scale(1.2) translate3d(-2.5%,-2%,0); } }
@keyframes hb-needle { 0%,100% { transform: rotate(-72deg); } 40% { transform: rotate(58deg); } 55% { transform: rotate(44deg); } 75% { transform: rotate(-20deg); } }
@keyframes hb-dash { to { stroke-dashoffset: -36; } }
@keyframes hb-sweep { 0% { transform: translateX(-70%) skewX(-18deg); opacity: 0; } 20% { opacity: 1; } 60% { opacity: 1; } 100% { transform: translateX(170%) skewX(-18deg); opacity: 0; } }
@keyframes hb-pulse { 0%,100% { opacity: .25; } 50% { opacity: .65; } }
`

function Gauge({ cx, cy, r, delay = 0 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.02)" stroke="#fff" strokeOpacity="0.1" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r - 16} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="10" strokeDasharray="2 13" />
      <circle cx={cx} cy={cy} r={r - 34} fill="none" stroke="#dc2626" strokeOpacity="0.35" strokeWidth="2" style={{ animation: 'hb-pulse 4s ease-in-out infinite' }} />
      <line
        x1={cx} y1={cy} x2={cx} y2={cy - (r - 24)}
        stroke="#ef4444" strokeWidth="4" strokeLinecap="round"
        style={{ transformOrigin: `${cx}px ${cy}px`, animation: `hb-needle 9s ease-in-out ${delay}s infinite` }}
      />
      <circle cx={cx} cy={cy} r="9" fill="#1c1c20" stroke="#fff" strokeOpacity="0.2" strokeWidth="2" />
    </g>
  )
}

function Dashboard() {
  return (
    <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" style={{ animation: 'hb-drift 26s ease-in-out infinite' }}>
      <defs>
        <radialGradient id="hb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#dc2626" stopOpacity="0.35" />
          <stop offset="1" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="620" cy="330" rx="520" ry="200" fill="url(#hb-glow)" />

      {/* instrument cluster */}
      <Gauge cx={330} cy={340} r={112} />
      <Gauge cx={530} cy={340} r={112} delay={-3} />

      {/* navigation screen */}
      <rect x="680" y="250" width="330" height="200" rx="22" fill="rgba(255,255,255,0.025)" stroke="#fff" strokeOpacity="0.12" strokeWidth="3" />
      <path d="M700 420 C 760 380, 800 400, 840 340 S 930 300, 990 270" fill="none" stroke="#ef4444" strokeOpacity="0.7" strokeWidth="4" strokeDasharray="10 8" strokeLinecap="round" style={{ animation: 'hb-dash 2.4s linear infinite' }} />
      <circle cx="990" cy="270" r="9" fill="#ef4444" style={{ animation: 'hb-pulse 2s ease-in-out infinite' }} />

      {/* air vents */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`l${i}`} x="90" y={300 + i * 26} width="150" height="10" rx="5" fill="#fff" fillOpacity="0.07" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`r${i}`} x="1050" y={300 + i * 26} width="100" height="10" rx="5" fill="#fff" fillOpacity="0.07" />
      ))}

      {/* steering wheel */}
      <circle cx="430" cy="610" r="250" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="38" />
      <circle cx="430" cy="610" r="250" fill="none" stroke="#dc2626" strokeOpacity="0.18" strokeWidth="3" />
      <circle cx="430" cy="610" r="64" fill="rgba(255,255,255,0.05)" stroke="#fff" strokeOpacity="0.14" strokeWidth="3" />
      <path d="M190 610 L366 610 M494 610 L670 610 M430 674 L430 760" stroke="#fff" strokeOpacity="0.1" strokeWidth="26" strokeLinecap="round" />

      {/* gear selector */}
      <circle cx="880" cy="620" r="46" fill="rgba(255,255,255,0.03)" stroke="#fff" strokeOpacity="0.1" strokeWidth="3" />
      <circle cx="880" cy="620" r="18" fill="#fff" fillOpacity="0.08" />
    </svg>
  )
}

export default function HeroBackground({ image }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{CSS}</style>

      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.22] blur-[1.5px] grayscale-[0.3]"
          style={{ animation: 'hb-kenburns 32s ease-in-out infinite alternate' }}
        />
      ) : (
        <div className="absolute inset-0 opacity-[0.75] blur-[1.2px]"><Dashboard /></div>
      )}

      {/* a slow light sweep across the dashboard */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
        style={{ animation: 'hb-sweep 9s ease-in-out 1.5s infinite' }}
      />

      {/* keep text readable and fade the picture into the page */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/20 to-ink-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,5,5,0.85)_100%)]" />
    </div>
  )
}