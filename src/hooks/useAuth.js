import { useState, useEffect } from 'react'
import { getSupabase, getIsSupabaseConfigured } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      // Cargar Supabase dinámicamente solo cuando se necesite
      const supabase = await getSupabase()
      const isConfigured = await getIsSupabaseConfigured()
      
      // Si Supabase no está configurado, no intentar autenticación
      if (!isConfigured) {
        setLoading(false)
        return
      }

      // Verificar sesión actual
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }).catch((error) => {
        console.error('Error getting session:', error)
        setLoading(false)
      })

      // Escuchar cambios de autenticación
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }

    initAuth()
  }, [])

  const signIn = async (email, password) => {
    const supabase = await getSupabase()
    const isConfigured = await getIsSupabaseConfigured()
    
    if (!isConfigured) {
      return { 
        data: null, 
        error: { message: 'Supabase no está configurado. Verifica las variables de entorno.' } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Error en signIn:', error)
        return { data: null, error }
      }
      
      // Actualizar el estado inmediatamente después del login exitoso
      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
        setLoading(false)
      }
      
      return { data, error: null }
    } catch (err) {
      console.error('Excepción en signIn:', err)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    const supabase = await getSupabase()
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    session,
    loading,
    signIn,
    signOut,
  }
}

