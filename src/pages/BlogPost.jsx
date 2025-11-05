import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import SEO from '@/components/SEO'
import SectionAnimator from '@/components/SectionAnimator'

const BlogPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single()

      if (fetchError) throw fetchError

      if (!data) {
        setError('Artículo no encontrado')
        return
      }

      setPost(data)
    } catch (err) {
      console.error('Error fetching post:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const parseTags = (tags) => {
    if (!tags) return []
    if (Array.isArray(tags)) return tags
    try {
      return JSON.parse(tags)
    } catch {
      return typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []
    }
  }

  if (loading) {
    return (
      <div className="bg-[#0C0D0D] text-white min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
          <p className="text-gray-400">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-[#0C0D0D] text-white min-h-screen pt-24">
        <div className="container mx-auto px-6 py-16">
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center">
            <p className="text-red-400 mb-4">Error al cargar el artículo</p>
            <p className="text-gray-400 text-sm mb-6">{error || 'Artículo no encontrado'}</p>
            <Button onClick={() => navigate('/blog')} className="bg-accent-purple hover:bg-accent-purple/90">
              Volver al Blog
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const postTags = parseTags(post.tags)

  // Structured Data para BlogPosting
  const blogPostingData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? (post.image.startsWith('http') ? post.image : `https://rium.com.mx${post.image}`) : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: post.author || 'Equipo rium',
    },
    publisher: {
      '@type': 'Organization',
      name: 'rium - Agencia de diseño UI/UX',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rium.com.mx/images/HERO.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rium.com.mx/blog/${id}`,
    },
    articleSection: post.category,
    keywords: postTags.length > 0 ? postTags.join(', ') : post.category,
  }

  return (
    <div className="bg-[#0C0D0D] text-white min-h-screen pt-24">
      <SEO
        title={post.title}
        description={post.excerpt}
        keywords={`${post.category}, ${postTags.join(', ')}, diseño UI/UX, blog rium`}
        url={`https://rium.com.mx/blog/${id}`}
        type="article"
        image={post.image}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(blogPostingData)}
        </script>
      </Helmet>

      <main>
        {/* Header */}
        <SectionAnimator>
          <div className="container mx-auto px-6 pt-16 pb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-accent-purple transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              Volver al Blog
            </Link>

            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              <div className="mb-6">
                <span className="px-4 py-2 bg-accent-purple/20 text-accent-purple rounded-full text-sm font-semibold uppercase">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
                {post.author && (
                  <span className="text-lg">Por {post.author}</span>
                )}
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {formatDate(post.created_at)}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-2">
                    <Clock size={18} />
                    {post.read_time}
                  </span>
                )}
              </div>

              {/* Tags */}
              {postTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {postTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 flex items-center gap-1"
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionAnimator>

        {/* Featured Image */}
        {post.image && (
          <SectionAnimator>
            <div className="container mx-auto px-6 mb-12">
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </SectionAnimator>
        )}

        {/* Content */}
        <SectionAnimator>
          <div className="container mx-auto px-6 pb-24">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {post.content || post.excerpt}
                </div>
              </div>
            </div>
          </div>
        </SectionAnimator>

        {/* Back to Blog CTA */}
        <SectionAnimator>
          <div className="container mx-auto px-6 pb-24">
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#1E1E2A] rounded-2xl p-8 border border-white/10 text-center">
                <h2 className="text-2xl font-bold mb-4">¿Te gustó este artículo?</h2>
                <p className="text-gray-400 mb-6">
                  Explora más artículos sobre diseño UI/UX y experiencia de usuario.
                </p>
                <Button
                  onClick={() => navigate('/blog')}
                  className="bg-accent-purple hover:bg-accent-purple/90"
                >
                  Ver todos los artículos
                  <ArrowLeft className="ml-2 rotate-180" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </SectionAnimator>
      </main>
    </div>
  )
}

export default BlogPost

