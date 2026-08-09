import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, ArrowLeft, Tag, Facebook, Twitter, Linkedin, MessageCircle, Link2, Check } from 'lucide-react'
import { getSupabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import OptimizedImage from '@/components/OptimizedImage'
import { useLocalizedLink } from '@/hooks/useLocalizedLink'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const getLocalizedLink = useLocalizedLink()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  
  // Detectar idioma actual desde la URL (con guard para StrictMode)
  const currentLang = location?.pathname?.startsWith('/en') ? 'en' : 'es'

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
      <div className="bg-white dark:bg-[#0C0D0D] text-gray-900 dark:text-white min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-purple"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-white dark:bg-[#0C0D0D] text-gray-900 dark:text-white min-h-screen pt-24">
        <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-16">
          <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-5 text-center sm:p-8">
            <p className="text-red-400 mb-4">Error al cargar el artículo</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{error || 'Artículo no encontrado'}</p>
            <Button onClick={() => navigate(getLocalizedLink('/blog'))} className="bg-accent-purple hover:bg-accent-purple/90">
              Volver al Blog
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Estas variables solo se calculan cuando post existe
  const postTags = parseTags(post?.tags || [])
  const articleUrl = `https://rium.com.mx/${currentLang}/blog/${post?.slug || post?.id || slug}`
  const shareText = `${post?.title || ''} - rium`
  const localizedContent = (post.content || post.excerpt || '').replace(
    /href=(["'])\/(?!\/|es(?:\/|["'])|en(?:\/|["']))/gi,
    `href=$1/${currentLang}/`
  )

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
      '@id': articleUrl,
    },
    articleSection: post.category,
    keywords: postTags.length > 0 ? postTags.join(', ') : post.category,
  }

  // URL absoluta de la imagen
  const ogImageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `https://rium.com.mx${post.image}`)
    : 'https://rium.com.mx/images/HERO.png'

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pt-20 text-gray-900 dark:bg-[#0C0D0D] dark:text-white sm:pt-24">
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
        <div>
          <div className="container mx-auto px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-12 md:pt-16">
            <Link
              to={getLocalizedLink('/blog')}
              className="mb-6 inline-flex min-h-11 items-center gap-2 text-gray-600 transition-colors active:text-accent-purple dark:text-gray-400 sm:mb-8 md:hover:text-accent-purple"
            >
              <ArrowLeft size={20} />
              Volver al Blog
            </Link>

            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              <div className="mb-4 sm:mb-6">
                <span className="inline-block max-w-full break-words rounded-full bg-accent-purple/20 px-3 py-1.5 text-xs font-semibold uppercase text-accent-purple sm:px-4 sm:py-2 sm:text-sm">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-5 break-words text-[clamp(1.875rem,9vw,3rem)] font-bold leading-[1.1] text-gray-900 dark:text-white md:mb-6 md:text-5xl lg:text-6xl">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400 sm:mb-8 sm:gap-6 sm:text-base">
                {post.author && (
                  <span className="break-words sm:text-lg">Por {post.author}</span>
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
                      className="px-3 py-1 bg-gray-200 dark:bg-white/10 rounded-full text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1"
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="mb-8 pt-6 border-t border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wider">Compartir este artículo</p>
                <div className="grid grid-cols-2 gap-2 min-[430px]:flex min-[430px]:flex-wrap min-[430px]:gap-3">
                  <Button
                    onClick={() => handleShare('facebook')}
                    variant="outline"
                    size="sm"
                    className="min-h-11 bg-gray-100 text-gray-900 transition-all active:scale-[.97] dark:bg-white/5 dark:text-white motion-reduce:transition-none md:hover:border-blue-600 md:hover:bg-blue-600 md:hover:text-white"
                  >
                    <Facebook size={18} className="mr-2" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => handleShare('twitter')}
                    variant="outline"
                    size="sm"
                    className="min-h-11 bg-gray-100 text-gray-900 transition-all active:scale-[.97] dark:bg-white/5 dark:text-white motion-reduce:transition-none md:hover:border-blue-400 md:hover:bg-blue-400 md:hover:text-white"
                  >
                    <Twitter size={18} className="mr-2" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare('linkedin')}
                    variant="outline"
                    size="sm"
                    className="min-h-11 bg-gray-100 text-gray-900 transition-all active:scale-[.97] dark:bg-white/5 dark:text-white motion-reduce:transition-none md:hover:border-blue-700 md:hover:bg-blue-700 md:hover:text-white"
                  >
                    <Linkedin size={18} className="mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleShare('whatsapp')}
                    variant="outline"
                    size="sm"
                    className="min-h-11 bg-gray-100 text-gray-900 transition-all active:scale-[.97] dark:bg-white/5 dark:text-white motion-reduce:transition-none md:hover:border-green-600 md:hover:bg-green-600 md:hover:text-white"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    size="sm"
                    className="col-span-2 min-h-11 bg-gray-100 text-gray-900 transition-all active:scale-[.97] dark:bg-white/5 dark:text-white motion-reduce:transition-none min-[430px]:col-span-1 md:hover:border-accent-purple md:hover:bg-accent-purple md:hover:text-white"
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
        </div>

        {/* Featured Image */}
        {post.image && (
          <div>
            <div className="container mx-auto mb-8 px-4 sm:mb-12 sm:px-6">
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video overflow-hidden rounded-xl shadow-2xl sm:rounded-2xl">
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
          </div>
        )}

        {/* Content */}
        <div>
          <div className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: localizedContent }}
              />
              <style>{`
                .blog-content {
                  color: #374151;
                  min-width: 0;
                  overflow-wrap: anywhere;
                }
                
                .dark .blog-content {
                  color: #d1d5db;
                }
                
                .blog-content h1 {
                  font-size: 2.25rem;
                  font-weight: 700;
                  margin-bottom: 1.5rem;
                  margin-top: 0;
                  color: #111827;
                }
                
                .dark .blog-content h1 {
                  color: #ffffff;
                }
                
                .blog-content h2 {
                  font-size: 1.875rem;
                  font-weight: 700;
                  margin-bottom: 1.25rem;
                  margin-top: 2rem;
                  color: #111827;
                }
                
                .dark .blog-content h2 {
                  color: #ffffff;
                }
                
                .blog-content h3 {
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin-bottom: 1rem;
                  margin-top: 1.5rem;
                  color: #111827;
                }
                
                .dark .blog-content h3 {
                  color: #ffffff;
                }
                
                .blog-content p {
                  margin-bottom: 1rem;
                  color: #374151;
                  line-height: 1.75;
                  font-size: 1.125rem;
                }
                
                .dark .blog-content p {
                  color: #d1d5db;
                }
                
                .blog-content ul, .blog-content ol {
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                  color: #374151;
                }
                
                .dark .blog-content ul, .dark .blog-content ol {
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
                  color: #3B82F6;
                  text-decoration: underline;
                  transition: color 0.2s;
                }
                
                .dark .blog-content a {
                  color: #a855f7;
                }
                
                .blog-content a:hover {
                  color: #2563eb;
                }
                
                .dark .blog-content a:hover {
                  color: rgba(168, 85, 247, 0.8);
                }
                
                .blog-content blockquote {
                  border-left: 4px solid #3B82F6;
                  padding-left: 1.5rem;
                  padding-top: 0.5rem;
                  padding-bottom: 0.5rem;
                  font-style: italic;
                  color: #6b7280;
                  margin: 1.5rem 0;
                  background-color: #f3f4f6;
                  border-radius: 0 0.5rem 0.5rem 0;
                }
                
                .dark .blog-content blockquote {
                  border-left-color: #a855f7;
                  color: #9ca3af;
                  background-color: rgba(255, 255, 255, 0.05);
                }
                
                .blog-content img {
                  border-radius: 0.5rem;
                  margin: 1.5rem 0;
                  width: 100%;
                  height: auto;
                  max-width: 100%;
                }
                
                .blog-content code {
                  background-color: #f3f4f6;
                  padding: 0.25rem 0.5rem;
                  border-radius: 0.25rem;
                  color: #3B82F6;
                  font-size: 1rem;
                  overflow-wrap: anywhere;
                }
                
                .dark .blog-content code {
                  background-color: rgba(255, 255, 255, 0.1);
                  color: #a855f7;
                }
                
                .blog-content pre {
                  background-color: #f9fafb;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  margin: 1rem 0;
                  border: 1px solid #e5e7eb;
                }
                
                .dark .blog-content pre {
                  background-color: #0C0D0D;
                  border: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .blog-content pre code {
                  background-color: transparent;
                  padding: 0;
                  color: inherit;
                }
                
                .blog-content strong {
                  font-weight: 700;
                  color: #111827;
                }
                
                .dark .blog-content strong {
                  color: #ffffff;
                }
                
                .blog-content em {
                  font-style: italic;
                  color: #374151;
                }
                
                .dark .blog-content em {
                  color: #e5e7eb;
                }
                
                .blog-content hr {
                  margin: 2rem 0;
                  border-color: #e5e7eb;
                }
                
                .dark .blog-content hr {
                  border-color: rgba(255, 255, 255, 0.2);
                }
                
                .blog-content table {
                  width: 100%;
                  margin: 1.5rem 0;
                  border-collapse: collapse;
                  display: block;
                  max-width: 100%;
                  overflow-x: auto;
                  -webkit-overflow-scrolling: touch;
                }
                
                .blog-content th {
                  border: 1px solid #e5e7eb;
                  padding: 0.5rem 1rem;
                  background-color: #f9fafb;
                  text-align: left;
                  color: #111827;
                }
                
                .dark .blog-content th {
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  background-color: rgba(255, 255, 255, 0.05);
                  color: #ffffff;
                }
                
                .blog-content td {
                  border: 1px solid #e5e7eb;
                  padding: 0.5rem 1rem;
                  color: #374151;
                }
                
                .dark .blog-content td {
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  color: #d1d5db;
                }

                .blog-content iframe, .blog-content video {
                  max-width: 100%;
                }

                @media (max-width: 639px) {
                  .blog-content h1 { font-size: 1.875rem; }
                  .blog-content h2 { font-size: 1.5rem; margin-top: 1.75rem; }
                  .blog-content h3 { font-size: 1.25rem; }
                  .blog-content p, .blog-content li { font-size: 1rem; line-height: 1.7; }
                  .blog-content blockquote { padding-left: 1rem; }
                  .blog-content pre { max-width: 100%; padding: .875rem; font-size: .875rem; }
                  .blog-content th, .blog-content td { min-width: 8rem; padding: .5rem .75rem; }
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Back to Blog CTA */}
        <div>
          <div className="container mx-auto px-4 pb-16 sm:px-6 md:pb-24">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-white/10 dark:bg-[#1E1E2A] sm:p-8">
                <h2 className="text-2xl font-bold mb-4">¿Te gustó este artículo?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Explora más artículos sobre diseño UI/UX y experiencia de usuario.
                </p>
                <Button
                  onClick={() => navigate(getLocalizedLink('/blog'))}
                  className="bg-accent-purple hover:bg-accent-purple/90"
                >
                  Ver todos los artículos
                  <ArrowLeft className="ml-2 rotate-180" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlogPost

