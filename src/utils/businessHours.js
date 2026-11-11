// Open/closed status is always evaluated in Namibian time (Africa/Windhoek),
// so visitors anywhere in the world see the correct status.
export const DEALERSHIP_TIMEZONE = 'Africa/Windhoek'

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const toMinutes = (hhmm = '00:00') => {
  const [h, m] = hhmm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function getOpenStatus(hours, date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DEALERSHIP_TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (type) => parts.find((p) => p.type === type)?.value
  const day = WEEKDAYS[get('weekday')]
  const hour = Number(get('hour')) % 24
  const minute = Number(get('minute'))
  const now = hour * 60 + minute
  const today = hours?.[day]
  const isOpen = Boolean(today) && !today.closed && now >= toMinutes(today.open) && now < toMinutes(today.close)
  return { isOpen, time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` }
}

// Groups identical consecutive days, e.g. "Monday – Friday  08:00 – 17:30"
export function groupHours(hours) {
  const rows = []
  DAY_ORDER.forEach((d) => {
    const h = hours?.[d]
    const text = !h || h.closed ? 'Closed' : `${h.open} – ${h.close}`
    const last = rows[rows.length - 1]
    if (last && last.text === text) last.end = d
    else rows.push({ start: d, end: d, text })
  })
  return rows.map((r) => ({
    label: r.start === r.end ? DAY_NAMES[r.start] : `${DAY_NAMES[r.start]} – ${DAY_NAMES[r.end]}`,
    text: r.text,
  }))
}
