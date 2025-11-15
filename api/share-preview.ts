import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync } from 'fs'
import { join } from 'path'

// Tipos para TypeScript
interface Post {
  id: string
  title: string
  excerpt: string | null
  content: string
  image: string | null
  category: string
  author: string | null
  created_at: string
  updated_at: string | null
  tags: string | string[] | null
  slug: string | null
  post_type: 'article' | 'news'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Normalizar query params (pueden venir como string o string[])
    const typeParam = req.query.type
    const slugParam = req.query.slug
    
    // Normalizar type
    const type: string = Array.isArray(typeParam) 
      ? (typeParam[0] || 'article') 
      : (typeParam || 'article')
    
    // Normalizar slug a string o undefined
    let slug: string | undefined
    if (Array.isArray(slugParam)) {
      slug = slugParam[0] || undefined
    } else if (typeof slugParam === 'string') {
      slug = slugParam
    } else {
      slug = undefined
    }
    
    // Detectar si es un bot de redes sociales
    const userAgent = req.headers['user-agent'] || ''
    // Usar flag 'i' para case-insensitive en lugar de (?i) que no existe en JavaScript
    const isBot = /(facebookexternalhit|LinkedInBot|Twitterbot|Slackbot|WhatsApp|TelegramBot|SkypeUriPreview|Applebot|Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver)/i.test(userAgent)
    
    // Logging para debug (solo en desarrollo o para debugging)
    console.log('🔍 share-preview called:', {
      slug,
      type,
      userAgent: userAgent.substring(0, 100),
      isBot,
      url: req.url,
    })
    
    // Si NO es un bot, hacer rewrite interno a index.html
    // Esto permite que Vercel sirva index.html y la SPA maneje el routing
    if (!isBot) {
      console.log('👤 Usuario normal detectado, haciendo rewrite interno a index.html')
      // En Vercel, podemos usar res.rewrite() para hacer rewrite interno
      // Si no está disponible, usar el método estándar de Vercel
      if (typeof (res as any).rewrite === 'function') {
        (res as any).rewrite('/index.html')
        return
      }
      // Fallback: redirigir a la raíz y dejar que el rewrite genérico maneje
      res.writeHead(302, {
        'Location': '/',
        'Cache-Control': 'no-cache',
      })
      res.end()
      return
    }
    
    console.log('🤖 Bot detectado, generando preview específico')

    // Validar que tenemos el slug
    if (!slug || typeof slug !== 'string') {
      res.status(400)
      res.setHeader('Content-Type', 'text/html')
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error - rium</title>
            <meta property="og:title" content="Error - rium" />
          </head>
          <body>
            <h1>Slug no proporcionado</h1>
          </body>
        </html>
      `)
      return
    }

    // slug ahora es garantizado como string
    const slugString: string = slug

    // Obtener variables de entorno
    // En funciones serverless, Vercel expone todas las variables de entorno
    // Intentar primero con VITE_ (para compatibilidad) y luego sin prefijo
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Error: Variables de entorno de Supabase no configuradas')
      res.status(500)
      res.setHeader('Content-Type', 'text/html')
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error - rium</title>
            <meta property="og:title" content="Error - rium" />
          </head>
          <body>
            <h1>Error de configuración del servidor</h1>
          </body>
        </html>
      `)
      return
    }

    // Crear cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Detectar si el slug es un UUID o un slug legible
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugString)

    let post: Post | null = null
    let fetchError: any = null

    if (isUUID) {
      // Buscar por ID
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', slugString)
        .eq('published', true)
        .single()
      post = result.data as Post | null
      fetchError = result.error
    } else {
      // Buscar por slug (limpiar guiones finales por si acaso)
      const cleanSlug = slugString.replace(/-+$/, '').trim()
      
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', cleanSlug)
        .eq('published', true)
        .single()
      post = result.data as Post | null
      fetchError = result.error

      // Si no se encuentra por slug, intentar buscar por ID como fallback
      if (fetchError && fetchError.code === 'PGRST116') {
        const fallbackResult = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', slugString)
          .eq('published', true)
          .single()
        
        if (fallbackResult.data) {
          post = fallbackResult.data as Post
          fetchError = null
        }
      }
    }

    // Si no se encuentra el post, retornar página genérica
    if (!post || fetchError) {
      res.status(404)
      res.setHeader('Content-Type', 'text/html')
      res.send(`
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Artículo no encontrado | rium</title>
            <meta name="description" content="El artículo que buscas no está disponible." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://rium.com.mx/${type === 'news' ? 'noticias' : 'blog'}/${slugString}" />
            <meta property="og:title" content="Artículo no encontrado | rium" />
            <meta property="og:description" content="El artículo que buscas no está disponible." />
            <meta property="og:image" content="https://rium.com.mx/images/HERO.png" />
            <meta property="og:site_name" content="rium - Agencia de diseño UI/UX" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Artículo no encontrado | rium" />
            <meta name="twitter:description" content="El artículo que buscas no está disponible." />
            <meta name="twitter:image" content="https://rium.com.mx/images/HERO.png" />
          </head>
          <body>
            <h1>Artículo no encontrado</h1>
          </body>
        </html>
      `)
      return
    }

    // Parsear tags
    const parseTags = (tags: string | string[] | null): string[] => {
      if (!tags) return []
      if (Array.isArray(tags)) return tags
      try {
        return JSON.parse(tags)
      } catch {
        return typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []
      }
    }

    const postTags = parseTags(post.tags)
    const baseUrl = 'https://rium.com.mx'
    const path = post.post_type === 'news' ? '/noticias' : '/blog'
    const articleUrl = `${baseUrl}${path}/${post.slug || post.id}`
    
    // URL absoluta de la imagen
    const ogImageUrl = post.image 
      ? (post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`)
      : `${baseUrl}/images/HERO.png`

    // Generar HTML con meta tags Open Graph
    const html = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Meta tags básicos -->
    <title>${escapeHtml(post.title)} | rium - ${post.post_type === 'news' ? 'Noticias Tech' : 'Blog'}</title>
    <meta name="description" content="${escapeHtml(post.excerpt || post.title)}" />
    <link rel="canonical" href="${articleUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:description" content="${escapeHtml(post.excerpt || post.title)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(post.title)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:site_name" content="rium - Agencia de diseño UI/UX" />
    <meta property="og:locale" content="es_ES" />
    
    <!-- Open Graph Article específicos -->
    <meta property="og:article:published_time" content="${post.created_at}" />
    ${post.updated_at ? `<meta property="og:article:modified_time" content="${post.updated_at}" />` : ''}
    <meta property="og:article:author" content="${escapeHtml(post.author || 'Equipo rium')}" />
    <meta property="og:article:section" content="${escapeHtml(post.category)}" />
    ${postTags.map(tag => `<meta property="og:article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${articleUrl}" />
    <meta name="twitter:title" content="${escapeHtml(post.title)}" />
    <meta name="twitter:description" content="${escapeHtml(post.excerpt || post.title)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    
    <!-- Redirigir a usuarios normales a la SPA -->
    <script>
      // Solo redirigir si NO es un bot (los bots no ejecutan JS)
      if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
        window.location.href = '${articleUrl}';
      }
    </script>
  </head>
  <body>
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="color: #333; margin-bottom: 10px;">${escapeHtml(post.title)}</h1>
      ${post.excerpt ? `<p style="color: #666; font-size: 18px; line-height: 1.6;">${escapeHtml(post.excerpt)}</p>` : ''}
      ${post.image ? `<img src="${ogImageUrl}" alt="${escapeHtml(post.title)}" style="max-width: 100%; margin: 20px 0; border-radius: 8px;" />` : ''}
      <p style="color: #999; margin-top: 20px;">
        <a href="${articleUrl}" style="color: #6366f1; text-decoration: none;">Leer artículo completo →</a>
      </p>
    </div>
  </body>
</html>
    `.trim()

    res.status(200)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.send(html)

  } catch (error: any) {
    console.error('❌ Error en share-preview:', error)
    res.status(500)
    res.setHeader('Content-Type', 'text/html')
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error - rium</title>
          <meta property="og:title" content="Error - rium" />
        </head>
        <body>
          <h1>Error del servidor</h1>
        </body>
      </html>
    `)
  }
}

// Función helper para escapar HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

