import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_SETTINGS } from '../utils/format'
import { fetchSettings, saveSettings } from '../lib/vehicleApi'

const SettingsContext = createContext(null)

function merge(base, saved) {
  return {
    ...base,
    ...saved,
    hours: { ...base.hours, ...(saved?.hours || {}) },
    social: { ...base.social, ...(saved?.social || {}) },
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchSettings()
      .then((data) => !cancelled && data && setSettings(merge(DEFAULT_SETTINGS, data)))
      .catch((e) => console.error('Could not load settings', e))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.title = `${settings.dealershipName} | ${settings.tagline}`
  }, [settings.dealershipName, settings.tagline])

  // Owner only (the database rejects this for anyone else). Returns { ok, error? }.
  const updateSettings = useCallback(
    async (patch) => {
      const next = merge(settings, patch)
      try {
        await saveSettings(next)
        setSettings(next)
        return { ok: true }
      } catch (e) {
        return { ok: false, error: e.message || 'Could not save settings.' }
      }
    },
    [settings]
  )

  return <SettingsContext.Provider value={{ settings, loading, updateSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>')
  return ctx
}
