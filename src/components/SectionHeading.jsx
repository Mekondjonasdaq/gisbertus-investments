import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function SectionHeading({ eyebrow, title, text, linkTo, linkLabel, center = false }) {
  return (
    <div className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${center ? 'items-center text-center sm:flex-col sm:items-center' : ''}`}>
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {text && <p className="mt-3 text-ink-300">{text}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="btn-outline shrink-0">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
