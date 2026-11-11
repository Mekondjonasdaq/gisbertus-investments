import { useEffect, useState } from 'react'

// Live rates from open.er-api.com (free, no API key, includes NAD).
// Credit: "Rates By Exchange Rate API" (https://www.exchangerate-api.com).
// If the request fails we say "offline". We never display made-up numbers.
const URL = 'https://open.er-api.com/v6/latest/USD'
const REFRESH_MS = 30 * 60 * 1000

let cache = null
let inflight = null

async function fetchRates() {
  if (cache && Date.now() - cache.at < REFRESH_MS) return cache.value
  if (inflight) return inflight
  inflight = (async () => {
    const res = await fetch(URL)
    if (!res.ok) throw new Error('Bad response')
    const data = await res.json()
    const r = data?.rates
    if (data?.result !== 'success' || !r?.NAD || !r?.EUR || !r?.GBP || !r?.ZAR) {
      throw new Error('Missing rates')
    }
    const value = {
      updated: data.time_last_update_unix ? new Date(data.time_last_update_unix * 1000) : null,
      // How many Namibian Dollars buy one unit of each currency
      rates: { USD: r.NAD, EUR: r.NAD / r.EUR, GBP: r.NAD / r.GBP, ZAR: r.NAD / r.ZAR },
    }
    cache = { at: Date.now(), value }
    return value
  })().finally(() => {
    inflight = null
  })
  return inflight
}

export function useExchangeRates() {
  const [state, setState] = useState(
    cache ? { status: 'ok', ...cache.value } : { status: 'loading', rates: null, updated: null }
  )

  useEffect(() => {
    let cancelled = false
    const load = () =>
      fetchRates()
        .then((value) => !cancelled && setState({ status: 'ok', ...value }))
        .catch(() => !cancelled && setState({ status: 'offline', rates: null, updated: null }))
    load()
    const timer = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [])

  return state
}
