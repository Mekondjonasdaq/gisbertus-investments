import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-24">
      <div className="max-w-xl text-center">
        <p className="section-eyebrow">Error 404</p>
        <h1 className="section-title">This page took a wrong turn</h1>
        <p className="mt-4 text-ink-300">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Back to home</Link>
          <Link to="/inventory" className="btn-outline">Browse cars</Link>
        </div>
      </div>
    </div>
  )
}
