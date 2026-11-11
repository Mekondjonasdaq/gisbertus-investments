import Logo from './Logo'
import CarPlaceholder from './CarPlaceholder'
import { useSettings } from '../context/SettingsContext'

// Layout of the owner sign-in screen.
export default function AuthShell({ title, subtitle, children }) {
  const { settings } = useSettings()
  return (
    <div className="grid min-h-screen bg-ink-950 lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_100%,rgba(220,38,38,0.35),transparent_60%)]" />
        <div className="relative"><Logo to="/" size="lg" showTagline /></div>
        <div className="relative">
          <CarPlaceholder plain className="animate-float" />
          <h2 className="mt-8 max-w-md text-4xl font-semibold leading-tight">Manage your stock in one place.</h2>
          <p className="mt-4 max-w-md text-ink-300">Add cars, update prices, add discounts and mark cars as sold. Changes go live for every customer straight away.</p>
        </div>
        <p className="relative text-xs text-ink-400">{settings.location}</p>
      </aside>
      <main className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo to="/" /></div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-ink-300">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
