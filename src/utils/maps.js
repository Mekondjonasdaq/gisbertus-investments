// Google Maps links. Works without any API key.
// For an exact pin, put coordinates (e.g. -22.5609, 17.0658) in Settings > "Map location".
export const mapQueryOf = (settings) => (settings.mapQuery || settings.location || '').trim()

export const mapsSearchUrl = (settings) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueryOf(settings))}`

export const mapsDirectionsUrl = (settings) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQueryOf(settings))}`

export const mapsEmbedUrl = (settings) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(mapQueryOf(settings))}&z=16&output=embed`