import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const useBlogPosts = (category = null) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      // Si Supabase no está configurado, no intentar cargar posts
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured. Blog posts will not be loaded.')
        setPosts([])
        setLoading(false)
        setError('Supabase no está configurado')
        return
      }

      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (category && category !== 'Todos') {
          query = query.eq('category', category)
        }

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError

        setPosts(data || [])
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        setError(err.message)
        // No romper la app, solo mostrar posts vacíos
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category])

  return { posts, loading, error }
}

