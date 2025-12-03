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

        // URLs estáticas - generar para ambos idiomas
        const staticUrls = [
          { loc: '/es', priority: '1.0', changefreq: 'weekly', lang: 'es' },
          { loc: '/en', priority: '1.0', changefreq: 'weekly', lang: 'en' },
          { loc: '/es/contact', priority: '0.8', changefreq: 'monthly', lang: 'es' },
          { loc: '/en/contact', priority: '0.8', changefreq: 'monthly', lang: 'en' },
          { loc: '/es/blog', priority: '0.8', changefreq: 'weekly', lang: 'es' },
          { loc: '/en/blog', priority: '0.8', changefreq: 'weekly', lang: 'en' },
          { loc: '/es/noticias', priority: '0.8', changefreq: 'weekly', lang: 'es' },
          { loc: '/en/noticias', priority: '0.8', changefreq: 'weekly', lang: 'en' },
          { loc: '/es/project/social-media-app', priority: '0.7', changefreq: 'monthly', lang: 'es' },
          { loc: '/en/project/social-media-app', priority: '0.7', changefreq: 'monthly', lang: 'en' },
          { loc: '/es/project/fintech-dashboard', priority: '0.7', changefreq: 'monthly', lang: 'es' },
          { loc: '/en/project/fintech-dashboard', priority: '0.7', changefreq: 'monthly', lang: 'en' },
          { loc: '/es/project/digital-marketing-agency-site', priority: '0.7', changefreq: 'monthly', lang: 'es' },
          { loc: '/en/project/digital-marketing-agency-site', priority: '0.7', changefreq: 'monthly', lang: 'en' },
        ]

        // Generar XML con namespace para hreflang
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

        // Agregar URLs estáticas con hreflang
        staticUrls.forEach((url) => {
          const alternateLang = url.lang === 'es' ? 'en' : 'es';
          const alternateUrl = url.loc.replace(`/${url.lang}`, `/${alternateLang}`);
          
          xml += `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <xhtml:link rel="alternate" hreflang="${url.lang}" href="${baseUrl}${url.loc}"/>
    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${baseUrl}${alternateUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/es"/>
  </url>
`
        })

        // Agregar URLs de artículos y noticias con prioridades dinámicas
        if (blogPosts && blogPosts.length > 0) {
          blogPosts.forEach((post, index) => {
            const lastmod = post.updated_at 
              ? new Date(post.updated_at).toISOString().split('T')[0]
              : new Date(post.created_at).toISOString().split('T')[0]
            
            // Determinar la ruta según el tipo de post
            const path = post.post_type === 'news' ? '/noticias' : '/blog'
            const slug = post.slug || post.id
            
            // Prioridad dinámica: más alta para posts recientes
            // Los primeros 10 posts tienen prioridad 0.8, luego 0.7, y finalmente 0.6
            let priority = '0.6'
            if (index < 10) {
              priority = '0.8'
            } else if (index < 30) {
              priority = '0.7'
            }
            
            // Frecuencia de actualización según tipo y antigüedad
            // Noticias se actualizan más frecuentemente que artículos del blog
            let changefreq = 'monthly'
            const daysSinceUpdate = Math.floor(
              (new Date() - new Date(post.updated_at || post.created_at)) / (1000 * 60 * 60 * 24)
            )
            
            if (post.post_type === 'news') {
              // Noticias recientes se actualizan semanalmente
              changefreq = daysSinceUpdate < 30 ? 'weekly' : 'monthly'
            } else {
              // Artículos del blog se actualizan mensualmente o menos frecuentemente
              changefreq = daysSinceUpdate < 90 ? 'monthly' : 'yearly'
            }
            
            // Generar URLs para ambos idiomas
            const esUrl = `${baseUrl}/es${path}/${slug}`;
            const enUrl = `${baseUrl}/en${path}/${slug}`;
            
            // URL en español
            xml += `  <url>
    <loc>${esUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}"/>
  </url>
`
            // URL en inglés
            xml += `  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${esUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${esUrl}"/>
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

