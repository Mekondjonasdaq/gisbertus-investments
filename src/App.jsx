import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ADMIN_BASE } from './config'
import { useSettings } from './context/SettingsContext'

import Layout from './components/Layout'
import AdminGate from './components/admin/AdminGate'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import VehicleDetails from './pages/VehicleDetails'
import OrderCar from './pages/OrderCar'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageVehicles from './pages/admin/ManageVehicles'
import AddVehicle from './pages/admin/AddVehicle'
import EditVehicle from './pages/admin/EditVehicle'
import AdminSettings from './pages/admin/AdminSettings'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
      }, 120)
      return () => clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export default function App() {
  const { loading } = useSettings()

  // Wait a moment for the business details so the page never flashes the wrong name/logo.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950" role="status" aria-label="Loading">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent-500" />
      </div>
    )
  }

  return (
    <>
      <ScrollManager />
      <Routes>
        {/* Public showcase: no accounts, no sign-in */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/vehicle/:id" element={<VehicleDetails />} />
          <Route path="/order" element={<OrderCar />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Secret owner portal. Not linked anywhere on the public site. */}
        <Route path={ADMIN_BASE} element={<AdminGate />}>
          <Route index element={<AdminDashboard />} />
          <Route path="vehicles" element={<ManageVehicles />} />
          <Route path="vehicles/new" element={<AddVehicle />} />
          <Route path="vehicles/:id/edit" element={<EditVehicle />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}