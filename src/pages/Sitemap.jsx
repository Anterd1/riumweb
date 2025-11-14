/**
 * Componente Sitemap - Genera sitemap dinámico
 * 
 * Nota: Este componente puede ser usado como alternativa al sitemap estático.
 * El sitemap estático se genera automáticamente con el script generate-sitemap.js
 * antes del build, pero esta ruta puede servir un sitemap dinámico en tiempo real.
 */

import { useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'

const Sitemap = () => {
  const [xmlContent, setXmlContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // Obtener artículos y noticias publicados
        const supabase = await getSupabase()
        const { data: blogPosts, error } = await supabase
          .from('blog_posts')
          .select('id, slug, post_type, created_at, updated_at')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching blog posts:', error)
        }

        const baseUrl = 'https://rium.com.mx'
        const today = new Date().toISOString().split('T')[0]

        // URLs estáticas
        const staticUrls = [
          { loc: '/', priority: '1.0', changefreq: 'weekly' },
          { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
          { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
          { loc: '/noticias', priority: '0.8', changefreq: 'weekly' },
          { loc: '/project/social-media-app', priority: '0.7', changefreq: 'monthly' },
          { loc: '/project/fintech-dashboard', priority: '0.7', changefreq: 'monthly' },
          { loc: '/project/digital-marketing-agency-site', priority: '0.7', changefreq: 'monthly' },
        ]

        // Generar XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

        // Agregar URLs estáticas
        staticUrls.forEach((url) => {
          xml += `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`
        })

        // Agregar URLs de artículos y noticias
        if (blogPosts && blogPosts.length > 0) {
          blogPosts.forEach((post) => {
            const lastmod = post.updated_at 
              ? new Date(post.updated_at).toISOString().split('T')[0]
              : new Date(post.created_at).toISOString().split('T')[0]
            
            // Determinar la ruta según el tipo de post
            const path = post.post_type === 'news' ? '/noticias' : '/blog'
            const slug = post.slug || post.id
            
            xml += `  <url>
    <loc>${baseUrl}${path}/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
          })
        }

        xml += `</urlset>`

        setXmlContent(xml)
      } catch (error) {
        console.error('Error generating sitemap:', error)
        setXmlContent('')
      } finally {
        setLoading(false)
      }
    }

    generateSitemap()
  }, [])

  // Renderizar XML directamente
  if (!loading && xmlContent) {
    // Establecer el content-type correcto
    if (typeof document !== 'undefined') {
      document.contentType = 'application/xml'
    }
    return (
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        wordWrap: 'break-word',
        fontFamily: 'monospace',
        fontSize: '12px',
        padding: '20px',
        backgroundColor: '#0C0D0D',
        color: '#fff',
        margin: 0
      }}>
        {xmlContent}
      </pre>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0D0D] text-white flex items-center justify-center">
      <p>Generando sitemap...</p>
    </div>
  )
}

export default Sitemap

