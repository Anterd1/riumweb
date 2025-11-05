// Lazy loading de Supabase para reducir JavaScript inicial (~34.6 KiB)
// Solo se carga cuando se necesita en páginas que usan Blog o Admin
let supabaseClient = null
let isSupabaseConfigured = false
let supabasePromise = null

// Función para inicializar Supabase (solo se carga cuando se necesita)
const initSupabase = async () => {
  if (supabaseClient) {
    return supabaseClient
  }

  if (supabasePromise) {
    return supabasePromise
  }

  // Cargar dinámicamente el módulo de Supabase solo cuando se necesite
  supabasePromise = (async () => {
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    
    // Verificar si las credenciales están configuradas
    isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== ''
    
    if (!isSupabaseConfigured) {
      console.warn('⚠️ Supabase credentials not found. Some features may not work properly.')
      console.warn('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.')
    }

    // Crear cliente de Supabase
    supabaseClient = isSupabaseConfigured 
      ? createClient(supabaseUrl, supabaseAnonKey)
      : createClient('https://placeholder.supabase.co', 'placeholder-key')
    
    return supabaseClient
  })()

  return supabasePromise
}

// Función helper para usar Supabase (carga automáticamente)
export const getSupabase = async () => {
  return await initSupabase()
}

// Función para obtener isSupabaseConfigured (async porque se carga después)
export const getIsSupabaseConfigured = async () => {
  await initSupabase()
  return isSupabaseConfigured
}

