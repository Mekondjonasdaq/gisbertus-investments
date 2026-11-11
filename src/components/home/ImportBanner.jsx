import { Link } from 'react-router-dom'
import { ArrowRight, Ship } from 'lucide-react'
import Reveal from '../Reveal'

// Points customers to the separate import service page.
export default function ImportBanner() {
  return (
    <section className="bg-ink-900 py-20">
      <div className="container-page">
        <Reveal>
          <div className="grid items-center gap-8 rounded-3xl border border-white/10 bg-ink-850 p-8 sm:p-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400"><Ship size={24} /></span>
              <p className="section-eyebrow mt-5">Import service</p>
              <h2 className="section-title">Want a car we do not have?</h2>
              <p className="mt-4 max-w-xl text-ink-300">
                We can import your dream car from Japan or China. Just tell us the car you want, and we will source it for you.
              </p>
            </div>
            <Link to="/order" className="btn-primary w-full py-4! text-base!">
              Order a car <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}