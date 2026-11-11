import { useEffect, useState } from 'react'
import { findAlphaBounds, processLogoPixels } from '../utils/logoProcessing'

// Takes the logo that was uploaded (whatever it looks like) and returns a clean,
// trimmed version for the dark header. If the browser is not allowed to read the
// picture's pixels, status becomes "fallback" and the original is shown instead.
const cache = new Map()

function loadWithCors(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('logo load failed'))
    img.src = url
  })
}

async function cleanLogo(url) {
  const img = await loadWithCors(url)
  const scale = Math.min(1, 1100 / img.naturalWidth)
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const imageData = ctx.getImageData(0, 0, w, h) // throws if the picture is cross-origin without permission
  const bg = processLogoPixels(imageData.data, w, h)
  ctx.putImageData(imageData, 0, 0)

  const box = findAlphaBounds(imageData.data, w, h)
  const pad = Math.round(Math.max(w, h) * 0.015)
  let out = canvas
  let ow = w
  let oh = h
  if (box && box.w * box.h < w * h * 0.97) {
    const x = Math.max(0, box.x - pad)
    const y = Math.max(0, box.y - pad)
    ow = Math.min(w - x, box.w + pad * 2)
    oh = Math.min(h - y, box.h + pad * 2)
    out = document.createElement('canvas')
    out.width = ow
    out.height = oh
    out.getContext('2d').drawImage(canvas, x, y, ow, oh, 0, 0, ow, oh)
  }
  return { src: out.toDataURL('image/png'), ratio: ow / oh, bg }
}

export function useCleanLogo(url) {
  const [state, setState] = useState(() => {
    if (!url) return { status: 'none' }
    return cache.has(url) ? { status: 'ready', ...cache.get(url) } : { status: 'loading' }
  })

  useEffect(() => {
    if (!url) {
      setState({ status: 'none' })
      return
    }
    if (cache.has(url)) {
      setState({ status: 'ready', ...cache.get(url) })
      return
    }
    let cancelled = false
    let settled = false
    setState({ status: 'loading' })
    const timeout = setTimeout(() => {
      if (!cancelled && !settled) setState({ status: 'fallback' })
    }, 5000)
    cleanLogo(url)
      .then((result) => {
        settled = true
        cache.set(url, result)
        if (!cancelled) setState({ status: 'ready', ...result })
      })
      .catch(() => {
        settled = true
        if (!cancelled) setState({ status: 'fallback' })
      })
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [url])

  return state
}