// The owner portal lives at a secret address. Set VITE_ADMIN_PATH in your .env
// file (and in Netlify) to something long and random. Nothing on the public
// website links to this address.
const raw = (import.meta.env.VITE_ADMIN_PATH || 'admin-portal-xyz').trim().replace(/^\/+|\/+$/g, '')

export const ADMIN_BASE = `/${raw}`
export const adminUrl = (sub = '') => `${ADMIN_BASE}${sub}`
export const IMAGE_BUCKET = 'vehicle-images'
