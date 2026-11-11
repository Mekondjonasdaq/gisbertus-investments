import { supabase } from './supabase'
import { IMAGE_BUCKET } from '../config'
import { compressImage } from '../utils/images'

// ---------- mapping between the database (snake_case) and the app (camelCase)
const blankToNull = (x) => (x === '' || x == null ? null : x)

export const fromRow = (r) => ({
  id: r.id,
  createdAt: new Date(r.created_at).getTime(),
  make: r.make,
  model: r.model,
  year: r.year ?? '',
  price: Number(r.price),
  salePrice: r.sale_price == null ? '' : Number(r.sale_price),
  mileage: r.mileage ?? '',
  transmission: r.transmission || '',
  fuel: r.fuel || '',
  engine: r.engine || '',
  colour: r.colour || '',
  condition: r.condition || '',
  description: r.description || '',
  specs: r.specs || [],
  images: r.images || [],
  featured: Boolean(r.featured),
  sold: Boolean(r.sold),
  isImport: Boolean(r.is_import),
  hidden: Boolean(r.hidden),
})

const toRow = (v) => ({
  make: v.make,
  model: v.model,
  year: v.year === '' || v.year == null ? null : Number(v.year),
  price: Number(v.price),
  sale_price: v.salePrice === '' || v.salePrice == null ? null : Number(v.salePrice),
  mileage: v.mileage === '' || v.mileage == null ? null : Number(v.mileage),
  transmission: blankToNull(v.transmission),
  fuel: blankToNull(v.fuel),
  engine: blankToNull(v.engine),
  colour: blankToNull(v.colour),
  condition: blankToNull(v.condition),
  description: blankToNull(v.description),
  specs: v.specs || [],
  images: v.images || [],
  featured: Boolean(v.featured),
  sold: Boolean(v.sold),
  is_import: Boolean(v.isImport),
  hidden: Boolean(v.hidden),
})

// ---------- vehicles
export async function fetchVehicles() {
  const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data.map(fromRow)
}

export async function insertVehicle(vehicle) {
  const { error } = await supabase.from('vehicles').insert(toRow(vehicle))
  if (error) throw error
}

export async function saveVehicle(id, vehicle) {
  const { error } = await supabase.from('vehicles').update(toRow(vehicle)).eq('id', id)
  if (error) throw error
}

export async function removeVehicle(id) {
  const { error } = await supabase.from('vehicles').delete().eq('id', id)
  if (error) throw error
}

// ---------- images (Supabase Storage)
export async function uploadImage(file, folder = 'vehicles', options = {}) {
  const blob = await compressImage(file, options)
  const ext = blob.type === 'image/png' ? 'png' : blob.type === 'image/svg+xml' ? 'svg' : 'jpg'
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: '31536000',
  })
  if (error) throw error
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

export async function deleteImages(urls = []) {
  const marker = `/object/public/${IMAGE_BUCKET}/`
  const paths = urls.map((u) => (u.includes(marker) ? decodeURIComponent(u.split(marker)[1]) : null)).filter(Boolean)
  if (!paths.length) return
  try {
    await supabase.storage.from(IMAGE_BUCKET).remove(paths)
  } catch (e) {
    console.warn('Could not delete old images', e)
  }
}

// ---------- site settings (one row)
export async function fetchSettings() {
  const { data, error } = await supabase.from('site_settings').select('data').eq('id', 1).maybeSingle()
  if (error) throw error
  return data?.data || null
}

export async function saveSettings(settings) {
  const { error } = await supabase.from('site_settings').upsert({ id: 1, data: settings, updated_at: new Date().toISOString() })
  if (error) throw error
}