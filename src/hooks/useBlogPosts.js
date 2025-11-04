import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export const useBlogPosts = (category = null) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
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
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category])

  return { posts, loading, error }
}

