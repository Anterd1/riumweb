import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, ArrowLeft, Tag, Facebook, Twitter, Linkedin, MessageCircle, Link2, Check } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import SectionAnimator from '@/components/SectionAnimator'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import OptimizedImage from '@/components/OptimizedImage'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = await getSupabase()
      
      // Detectar si el parámetro es un UUID o un slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
      
      let data, fetchError
      
      if (isUUID) {
        // Buscar por ID (compatibilidad con URLs antiguas)
        const result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', slug)
          .eq('published', true)
          .single()
        data = result.data
        fetchError = result.error
      } else {
        // Buscar por slug (limpiar guiones finales por si acaso)
        const cleanSlug = slug.replace(/-+$/, '').trim()
        
        const result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', cleanSlug)
          .eq('published', true)
          .single()
        data = result.data
        fetchError = result.error
        
        // Si no se encuentra por slug, intentar buscar por ID como fallback
        if (fetchError && fetchError.code === 'PGRST116') {
          // PGRST116 = no rows returned, intentar buscar por ID si el slug parece un UUID
          const fallbackResult = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', slug)
            .eq('published', true)
            .single()
          
          if (fallbackResult.data) {
            data = fallbackResult.data
            fetchError = null
          }
        }
      }

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching post:', fetchError)
        throw fetchError
      }

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

  // Estas variables solo se calculan cuando post existe
  const postTags = parseTags(post?.tags || [])
  const articleUrl = `https://rium.com.mx/blog/${post?.slug || post?.id || slug}`
  const shareText = `${post?.title || ''} - rium`

  // Funciones de compartir
  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(articleUrl)
    const encodedText = encodeURIComponent(shareText)
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'width=600,height=400')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank', 'width=600,height=400')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank', 'width=600,height=400')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(articleUrl).then(() => {
          setCopied(true)
          toast({
            title: 'Enlace copiado',
            description: 'El enlace se ha copiado al portapapeles',
          })
          setTimeout(() => setCopied(false), 2000)
        })
        break
      default:
        break
    }
  }

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
      '@id': `https://rium.com.mx/blog/${post.slug || post.id}`,
    },
    articleSection: post.category,
    keywords: postTags.length > 0 ? postTags.join(', ') : post.category,
  }

  // URL absoluta de la imagen
  const ogImageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `https://rium.com.mx${post.image}`)
    : 'https://rium.com.mx/images/HERO.png'
  
  const articleUrl = `https://rium.com.mx/blog/${post?.slug || post?.id || slug}`

  return (
    <div className="bg-[#0C0D0D] text-white min-h-screen pt-24">
      <Helmet prioritizeSeoTags>
        {/* Meta tags básicos */}
        <title>{post.title} | rium - Blog</title>
        <meta name="description" content={post.excerpt || post.title} />
        <link rel="canonical" href={articleUrl} />
        
        {/* Open Graph - Sobrescribir con datos específicos del artículo */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:site_name" content="rium - Agencia de diseño UI/UX" />
        <meta property="og:locale" content="es_ES" />
        
        {/* Open Graph Article específicos */}
        <meta property="og:article:published_time" content={post.created_at} />
        {post.updated_at && (
          <meta property="og:article:modified_time" content={post.updated_at} />
        )}
        <meta property="og:article:author" content={post.author || 'Equipo rium'} />
        <meta property="og:article:section" content={post.category} />
        {postTags.length > 0 && (
          postTags.map((tag, index) => (
            <meta key={index} property="og:article:tag" content={tag} />
          ))
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        <meta name="twitter:image" content={ogImageUrl} />
        
        {/* Structured Data JSON-LD */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingData) }}
        />
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
                <div className="flex flex-wrap gap-2 mb-6">
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

              {/* Share Buttons */}
              <div className="mb-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-4 uppercase tracking-wider">Compartir este artículo</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => handleShare('facebook')}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all"
                  >
                    <Facebook size={18} className="mr-2" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare('twitter')}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-blue-400 hover:border-blue-400 hover:text-white transition-all"
                  >
                    <Twitter size={18} className="mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare('linkedin')}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-blue-700 hover:border-blue-700 hover:text-white transition-all"
                  >
                    <Linkedin size={18} className="mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleShare('whatsapp')}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-green-600 hover:border-green-600 hover:text-white transition-all"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-accent-purple hover:border-accent-purple hover:text-white transition-all"
                  >
                    {copied ? (
                      <>
                        <Check size={18} className="mr-2" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Link2 size={18} className="mr-2" />
                        Copiar enlace
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SectionAnimator>

        {/* Featured Image */}
        {post.image && (
          <SectionAnimator>
            <div className="container mx-auto px-6 mb-12">
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    width={1200}
                    height={675}
                    priority
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
              <div 
                className="prose prose-invert prose-lg max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
                style={{
                  color: '#d1d5db',
                }}
              />
              <style>{`
                .blog-content h1 {
                  font-size: 2.25rem;
                  font-weight: 700;
                  margin-bottom: 1.5rem;
                  margin-top: 0;
                  color: #ffffff;
                }
                
                .blog-content h2 {
                  font-size: 1.875rem;
                  font-weight: 700;
                  margin-bottom: 1.25rem;
                  margin-top: 2rem;
                  color: #ffffff;
                }
                
                .blog-content h3 {
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin-bottom: 1rem;
                  margin-top: 1.5rem;
                  color: #ffffff;
                }
                
                .blog-content p {
                  margin-bottom: 1rem;
                  color: #d1d5db;
                  line-height: 1.75;
                  font-size: 1.125rem;
                }
                
                .blog-content ul, .blog-content ol {
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                  color: #d1d5db;
                }
                
                .blog-content ul {
                  list-style-type: disc;
                }
                
                .blog-content ol {
                  list-style-type: decimal;
                }
                
                .blog-content li {
                  margin-bottom: 0.5rem;
                  line-height: 1.75;
                }
                
                .blog-content a {
                  color: #a855f7;
                  text-decoration: underline;
                  transition: color 0.2s;
                }
                
                .blog-content a:hover {
                  color: rgba(168, 85, 247, 0.8);
                }
                
                .blog-content blockquote {
                  border-left: 4px solid #a855f7;
                  padding-left: 1.5rem;
                  padding-top: 0.5rem;
                  padding-bottom: 0.5rem;
                  font-style: italic;
                  color: #9ca3af;
                  margin: 1.5rem 0;
                  background-color: rgba(255, 255, 255, 0.05);
                  border-radius: 0 0.5rem 0.5rem 0;
                }
                
                .blog-content img {
                  border-radius: 0.5rem;
                  margin: 1.5rem 0;
                  width: 100%;
                  height: auto;
                }
                
                .blog-content code {
                  background-color: rgba(255, 255, 255, 0.1);
                  padding: 0.25rem 0.5rem;
                  border-radius: 0.25rem;
                  color: #a855f7;
                  font-size: 1rem;
                }
                
                .blog-content pre {
                  background-color: #0C0D0D;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  margin: 1rem 0;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .blog-content pre code {
                  background-color: transparent;
                  padding: 0;
                  color: inherit;
                }
                
                .blog-content strong {
                  font-weight: 700;
                  color: #ffffff;
                }
                
                .blog-content em {
                  font-style: italic;
                  color: #e5e7eb;
                }
                
                .blog-content hr {
                  margin: 2rem 0;
                  border-color: rgba(255, 255, 255, 0.2);
                }
                
                .blog-content table {
                  width: 100%;
                  margin: 1.5rem 0;
                  border-collapse: collapse;
                }
                
                .blog-content th {
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  padding: 0.5rem 1rem;
                  background-color: rgba(255, 255, 255, 0.05);
                  text-align: left;
                }
                
                .blog-content td {
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  padding: 0.5rem 1rem;
                }
              `}</style>
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
      <Toaster />
    </div>
  )
}

export default BlogPost

