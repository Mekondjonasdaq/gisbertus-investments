import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

// The anon key is designed to be public. Real protection comes from the
// Row Level Security rules in supabase/schema.sql: everyone can READ, but only
// the signed-in owner can ADD, CHANGE or DELETE.
export const supabase = isSupabaseConfigured
  ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } })
  : null
