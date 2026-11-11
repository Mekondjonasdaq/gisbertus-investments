import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchVehicles, insertVehicle, removeVehicle, saveVehicle, deleteImages } from '../lib/vehicleApi'

const VehicleContext = createContext(null)

const fail = (e) => ({ ok: false, error: e?.message || 'Something went wrong. Please try again.' })

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setVehicles(await fetchVehicles())
      setError('')
    } catch (e) {
      console.error('Could not load vehicles', e)
      setError('We could not load the latest cars. Please refresh the page in a moment.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load on page open, refresh when the tab is shown again, and update live
  // the moment the owner adds, edits or deletes a car.
  useEffect(() => {
    load()
    const onVisible = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVisible)
    const channel = supabase
      .channel('vehicles-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => load())
      .subscribe()
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(channel)
    }
  }, [load])

  const getVehicle = useCallback((id) => vehicles.find((v) => v.id === id) || null, [vehicles])

  // ---- Owner actions (the database rejects these unless the owner is signed in)
  const addVehicle = useCallback(async (data) => {
    try {
      await insertVehicle(data)
      await load()
      return { ok: true }
    } catch (e) {
      return fail(e)
    }
  }, [load])

  const updateVehicle = useCallback(async (id, patch) => {
    try {
      const existing = vehicles.find((v) => v.id === id)
      await saveVehicle(id, { ...existing, ...patch })
      await load()
      return { ok: true }
    } catch (e) {
      return fail(e)
    }
  }, [vehicles, load])

  const deleteVehicle = useCallback(async (id) => {
    try {
      const existing = vehicles.find((v) => v.id === id)
      await removeVehicle(id)
      if (existing?.images?.length) deleteImages(existing.images)
      await load()
      return { ok: true }
    } catch (e) {
      return fail(e)
    }
  }, [vehicles, load])

  // The public website shows cars that are in stock (sold ones too, with a SOLD label)
  // unless the owner chose to hide them. Import records are never shown.
  const stockVehicles = vehicles.filter((v) => !v.isImport && !v.hidden)

  const value = { vehicles, stockVehicles, loading, error, getVehicle, addVehicle, updateVehicle, deleteVehicle }
  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
}

export function useVehicles() {
  const ctx = useContext(VehicleContext)
  if (!ctx) throw new Error('useVehicles must be used inside <VehicleProvider>')
  return ctx
}