import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Verificar si las credenciales están configuradas
const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== ''

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials not found. Some features may not work properly.')
  console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.')
}

// Crear cliente de Supabase (funcionará incluso sin credenciales, pero las peticiones fallarán)
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// Exportar flag para verificar si está configurado
export const isSupabaseConfigured = isConfigured

