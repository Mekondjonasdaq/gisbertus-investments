import Reveal from '../Reveal'
import SectionHeading from '../SectionHeading'
import VehicleCard from '../VehicleCard'

export default function VehicleSection({ id, eyebrow, title, text, vehicles, linkTo = '/inventory', linkLabel = 'View all', tinted = false, cols = 'lg:grid-cols-3' }) {
  if (!vehicles.length) return null
  return (
    <section id={id} className={`py-20 ${tinted ? 'bg-ink-900' : ''}`}>
      <div className="container-page">
        <Reveal><SectionHeading eyebrow={eyebrow} title={title} text={text} linkTo={linkTo} linkLabel={linkLabel} /></Reveal>
        <div className={`grid gap-6 sm:grid-cols-2 ${cols}`}>
          {vehicles.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 80}><VehicleCard vehicle={v} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
