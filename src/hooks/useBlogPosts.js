import { useState, useEffect, useRef } from 'react'
import { getSupabase, getIsSupabaseConfigured } from '@/lib/supabase'

export const useBlogPosts = (category = null, postType = 'article') => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo AbortController para esta petición
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar Supabase dinámicamente solo cuando se necesite
        const supabase = await getSupabase()
        const isConfigured = await getIsSupabaseConfigured()
        
        // Si Supabase no está configurado, no intentar cargar posts
        if (!isConfigured) {
          console.warn('Supabase not configured. Blog posts will not be loaded.')
          setPosts([])
          setLoading(false)
          return
        }

        let query = supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        // Filtrar por tipo de post (article o news)
        if (postType) {
          query = query.eq('post_type', postType)
        }

        if (category && category !== 'Todos') {
          query = query.eq('category', category)
        }

        const { data, error: fetchError } = await query

        // Verificar si la petición fue cancelada
        if (signal.aborted) return

        if (fetchError) throw fetchError

        setPosts(data || [])
      } catch (err) {
        // Ignorar errores de cancelación
        if (err.name === 'AbortError' || signal.aborted) return
        
        console.error('Error fetching blog posts:', err)
        setError(err.message)
        // No romper la app, solo mostrar posts vacíos
        setPosts([])
      } finally {
        if (!signal.aborted) {
        setLoading(false)
        }
      }
    }

    fetchPosts()

    // Cleanup: cancelar petición si el componente se desmonta o cambian las dependencias
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [category, postType])

  return { posts, loading, error }
}

