// Resizes an image in the browser and returns a Blob ready to upload.
// Vehicle photos: JPEG, up to 1600 px wide (sharp but light). Logos: PNG.
// With `trim: true` (used for logos) empty space around the artwork is cut off,
// so a logo saved with big margins still shows large in the header.

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Could not open ${file.name}. Use a JPG, PNG or WebP photo.`))
    }
    img.src = objectUrl
  })
}

function trimBorders(canvas) {
  const w = canvas.width
  const h = canvas.height
  const { data } = canvas.getContext('2d').getImageData(0, 0, w, h)
  const cornerTransparent = data[3] < 10
  const [cr, cg, cb] = [data[0], data[1], data[2]]
  const tol = 28

  const isBackground = (i) => {
    const a = data[i + 3]
    if (cornerTransparent) return a < 10
    if (a < 10) return true
    return Math.abs(data[i] - cr) <= tol && Math.abs(data[i + 1] - cg) <= tol && Math.abs(data[i + 2] - cb) <= tol
  }

  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!isBackground((y * w + x) * 4)) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return canvas

  const pad = Math.round(Math.max(w, h) * 0.02)
  const x0 = Math.max(0, minX - pad)
  const y0 = Math.max(0, minY - pad)
  const x1 = Math.min(w, maxX + 1 + pad)
  const y1 = Math.min(h, maxY + 1 + pad)
  const tw = x1 - x0
  const th = y1 - y0
  if (tw * th > w * h * 0.96) return canvas

  const out = document.createElement('canvas')
  out.width = tw
  out.height = th
  out.getContext('2d').drawImage(canvas, x0, y0, tw, th, 0, 0, tw, th)
  return out
}

export async function compressImage(file, { maxWidth = 1600, quality = 0.85, type = 'image/jpeg', trim = false } = {}) {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`)
  if (file.type === 'image/svg+xml') return file

  const img = await loadImage(file)
  const scale = Math.min(1, maxWidth / img.width)
  let canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  if (type === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  if (trim) canvas = trimBorders(canvas)

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not process the image.'))), type, quality)
  )
}

// Is the picture drawn on a white / very light background? (used for logos)
export async function detectLightBackground(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return false
  try {
    const img = await loadImage(file)
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, 32, 32)
    const { data } = ctx.getImageData(0, 0, 32, 32)
    const corners = [0, 31, 31 * 32, 31 * 32 + 31].map((p) => p * 4)
    let light = 0
    for (const i of corners) {
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      if (data[i + 3] > 200 && luminance > 215) light++
    }
    return light >= 3
  } catch {
    return false
  }
}