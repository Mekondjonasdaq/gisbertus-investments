// Pure pixel helpers that clean up a logo picture so it looks good on the dark header:
// - white / light background  -> made transparent, dark lettering turned white (reds stay red)
// - black / dark background   -> made transparent
// - transparent / other       -> left as it is
// Then the empty space around the artwork is cut off so the logo can be shown BIG.

const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))
const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

export function detectBackground(data, w, h) {
  const spots = [[1, 1], [w - 2, 1], [1, h - 2], [w - 2, h - 2]].map(([x, y]) => (y * w + x) * 4)
  let transparent = 0
  let light = 0
  let dark = 0
  for (const i of spots) {
    if (data[i + 3] < 10) transparent++
    else if (data[i + 3] > 200) {
      const l = lum(data[i], data[i + 1], data[i + 2])
      if (l > 205) light++
      else if (l < 55) dark++
    }
  }
  if (transparent >= 3) return 'transparent'
  if (light >= 3) return 'light'
  if (dark >= 3) return 'dark'
  return 'other'
}

// Edits `data` (RGBA, in place) and returns which kind of background it found.
export function processLogoPixels(data, w, h) {
  const bg = detectBackground(data, w, h)
  if (bg === 'light') {
    for (let i = 0; i < data.length; i += 4) {
      const ao = data[i + 3] / 255
      // flatten onto white first
      const r = data[i] * ao + 255 * (1 - ao)
      const g = data[i + 1] * ao + 255 * (1 - ao)
      const b = data[i + 2] * ao + 255 * (1 - ao)
      const a = Math.max(255 - r, 255 - g, 255 - b) / 255
      if (a < 0.03) {
        data[i + 3] = 0
        continue
      }
      let nr = clamp((r - 255 * (1 - a)) / a)
      let ng = clamp((g - 255 * (1 - a)) / a)
      let nb = clamp((b - 255 * (1 - a)) / a)
      const max = Math.max(nr, ng, nb)
      const min = Math.min(nr, ng, nb)
      const sat = max === 0 ? 0 : (max - min) / max
      let alpha = clamp(a * 255)
      if (lum(nr, ng, nb) < 140 && sat < 0.45) {
        nr = ng = nb = 255 // dark lettering becomes white
        alpha = clamp(Math.min(1, a * 1.25) * 255)
      } else if (a >= 0.55) {
        // coloured parts (e.g. a red car) keep their exact colour and stay solid
        nr = clamp(r)
        ng = clamp(g)
        nb = clamp(b)
        alpha = 255
      }
      data[i] = nr
      data[i + 1] = ng
      data[i + 2] = nb
      data[i + 3] = alpha
    }
  } else if (bg === 'dark') {
    for (let i = 0; i < data.length; i += 4) {
      const ao = data[i + 3] / 255
      const r = data[i] * ao
      const g = data[i + 1] * ao
      const b = data[i + 2] * ao
      const a = Math.max(r, g, b) / 255
      if (a < 0.05) {
        data[i + 3] = 0
        continue
      }
      data[i] = clamp(r / a)
      data[i + 1] = clamp(g / a)
      data[i + 2] = clamp(b / a)
      data[i + 3] = clamp(a * 255)
    }
  }
  return bg
}

// Smallest box that contains every visible pixel (alpha above the threshold).
export function findAlphaBounds(data, w, h, threshold = 24) {
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > threshold) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return null
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}