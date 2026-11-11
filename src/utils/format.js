export const DEFAULT_HOURS = {
  0: { closed: true, open: '08:00', close: '13:00' },
  1: { closed: false, open: '08:00', close: '17:30' },
  2: { closed: false, open: '08:00', close: '17:30' },
  3: { closed: false, open: '08:00', close: '17:30' },
  4: { closed: false, open: '08:00', close: '17:30' },
  5: { closed: false, open: '08:00', close: '17:30' },
  6: { closed: false, open: '08:00', close: '13:00' },
}

// Used until the saved settings load from the database, and as the fallback
// for any field the owner has not set. Update the real values in the owner portal.
export const DEFAULT_SETTINGS = {
  dealershipName: 'GISBERTUS INVESTMENTS',
  tagline: 'We Buy & Sell Cars',
  logo: '',
  logoOnLight: false, // true when the logo image has a white background
  heroImage: '', // optional faint car-interior photo behind the hero
  phone: '+264 81 200 2291',
  phone2: '+264 85 200 2291',
  whatsapp: '264812002291',
  email: 'andjambagisbertus@icloud.com',
  location: 'Erf 5730, Dater Street, Khomasdal, Windhoek, Namibia',
  mapQuery: 'Dater Street, Khomasdal, Windhoek, Namibia', // what Google Maps searches for
  depositPercent: 75,
  importLeadTime: '3 to 4 months',
  hours: DEFAULT_HOURS,
  social: { facebook: '', instagram: '', tiktok: '', twitter: '', youtube: '' },
}

export function formatPrice(value) {
  const number = Number(value) || 0
  return `N$ ${number.toLocaleString('en-ZA', { maximumFractionDigits: 0 }).replace(/\u00a0/g, ' ')}`
}

export function formatKm(value) {
  if (value === '' || value == null) return ''
  return `${Number(value).toLocaleString('en-ZA').replace(/\u00a0/g, ' ')} km`
}