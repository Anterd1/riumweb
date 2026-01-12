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
    // LinkedIn usa varios User-Agents: LinkedInBot, LinkedInBot/1.0, LinkedInBot/2.0, etc.
    // También puede venir como linkedinbot (minúsculas) o con diferentes versiones
    const isBot = /(facebookexternalhit|LinkedInBot|linkedinbot|Twitterbot|Slackbot|WhatsApp|TelegramBot|SkypeUriPreview|Applebot|Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver|facebook|linkedin)/i.test(userAgent)
    
    // Logging para debug (solo en desarrollo o para debugging)
    console.log('🔍 share-preview called:', {
      slug,
      type,
      userAgent: userAgent.substring(0, 100),
      isBot,
      url: req.url,
    })
    
    // Si NO es un bot (no debería llegar aquí gracias a los rewrites condicionales),
    // pero por seguridad, redirigir a la URL original para que Vercel maneje el routing
    if (!isBot) {
      console.log('⚠️ Usuario normal llegó a función serverless (no debería pasar)')
      // Los rewrites condicionales deberían evitar que usuarios normales lleguen aquí
      // Pero por si acaso, hacer un redirect a la URL original
      res.writeHead(302, {
        'Location': req.url || '/',
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

    // Detectar si el slug es un UUID válido
    // Un UUID debe tener 36 caracteres y seguir el formato específico
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const isUUID = slugString.length === 36 && uuidRegex.test(slugString)

    let post: Post | null = null
    let fetchError: any = null

    if (isUUID) {
      // Buscar por ID solo si es un UUID válido
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', slugString)
        .eq('published', true)
        .single()
      post = result.data as Post | null
      fetchError = result.error
    } else {
      // Buscar por slug
      const cleanSlug = slugString.replace(/-+$/, '').trim()
      
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', cleanSlug)
        .eq('published', true)
        .single()
      post = result.data as Post | null
      fetchError = result.error

      // Si no se encuentra por slug, y el string TIENE formato de UUID (caso raro de fallback), intentar por ID
      // Pero si es un slug de texto normal, NO intentar buscar por ID para evitar errores de sintaxis en Postgres
      if (fetchError && fetchError.code === 'PGRST116' && isUUID) {
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
            <meta property="og:url" content="https://rium.com.mx/es/${type === 'news' ? 'noticias' : 'blog'}/${slugString}" />
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
    // Detectar idioma desde la URL original (default: español)
    const lang = req.url?.includes('/en/') ? 'en' : 'es'
    const articleUrl = `${baseUrl}/${lang}${path}/${post.slug || post.id}`
    
    // URL absoluta de la imagen
    const ogImageUrl = post.image 
      ? (post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`)
      : `${baseUrl}/images/HERO.png`

    // Formatear fechas a ISO 8601 según la especificación Open Graph
    const formatDate = (dateString: string | null): string => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        return date.toISOString()
      } catch {
        return dateString
      }
    }

    const publishedTime = formatDate(post.created_at)
    const modifiedTime = post.updated_at ? formatDate(post.updated_at) : null

    // Detectar tipo MIME de la imagen
    const getImageType = (imageUrl: string): string => {
      const ext = imageUrl.toLowerCase().split('.').pop() || ''
      if (ext === 'png') return 'image/png'
      if (ext === 'gif') return 'image/gif'
      if (ext === 'webp') return 'image/webp'
      return 'image/jpeg' // default
    }

    const imageType = getImageType(ogImageUrl)

    // Generar HTML con meta tags Open Graph según la especificación oficial
    // Referencia: https://ogp.me
    // Para artículos, también necesitamos el namespace de article
    const html = `
<!DOCTYPE html>
<html prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article#" lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Meta tags básicos -->
    <title>${escapeHtml(post.title)} | rium - ${post.post_type === 'news' ? 'Noticias Tech' : 'Blog'}</title>
    <meta name="description" content="${escapeHtml(post.excerpt || post.title)}" />
    <link rel="canonical" href="${articleUrl}" />
    
    <!-- Open Graph - Campos requeridos según https://ogp.me -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:title" content="${escapeHtml(post.title)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    
    <!-- Open Graph - Campos opcionales recomendados -->
    <meta property="og:description" content="${escapeHtml(post.excerpt || post.title)}" />
    <meta property="og:site_name" content="rium - Agencia de diseño UI/UX" />
    <meta property="og:locale" content="es_ES" />
    
    <!-- Open Graph - Propiedades estructuradas de imagen según https://ogp.me -->
    <meta property="og:image:secure_url" content="${ogImageUrl.replace('http://', 'https://')}" />
    <meta property="og:image:type" content="${imageType}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(post.title)}" />
    
    <!-- Open Graph Article - Propiedades específicas según https://ogp.me/ns/article# -->
    <meta property="article:published_time" content="${publishedTime}" />
    ${modifiedTime ? `<meta property="article:modified_time" content="${modifiedTime}" />` : ''}
    <meta property="article:author" content="${escapeHtml(post.author || 'Equipo rium')}" />
    <meta property="article:section" content="${escapeHtml(post.category)}" />
    ${postTags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${articleUrl}" />
    <meta name="twitter:title" content="${escapeHtml(post.title)}" />
    <meta name="twitter:description" content="${escapeHtml(post.excerpt || post.title)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    
    <!-- Estilos para el botón -->
    <style>
      .btn {
        display: inline-block;
        background-color: #6366f1;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        transition: background-color 0.2s;
      }
      .btn:hover {
        background-color: #4f46e5;
      }
    </style>
  </head>
  <body>
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="color: #111827; margin-bottom: 16px; font-size: 24px; line-height: 1.3;">${escapeHtml(post.title)}</h1>
      ${post.image ? `<div style="border-radius: 12px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"><img src="${ogImageUrl}" alt="${escapeHtml(post.title)}" style="width: 100%; height: auto; display: block;" /></div>` : ''}
      ${post.excerpt ? `<p style="color: #4b5563; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">${escapeHtml(post.excerpt)}</p>` : ''}
      <div style="text-align: center; margin-top: 32px;">
        <a href="${articleUrl}" class="btn">Leer artículo completo</a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 24px;">
        Estás viendo una vista previa. <a href="${articleUrl}" style="color: #6366f1;">Haz clic aquí si no eres redirigido.</a>
      </p>
    </div>
  </body>
</html>
    `.trim()

    res.status(200)
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    // LinkedIn puede cachear agresivamente, así que reducimos el tiempo de caché
    // y agregamos headers específicos para forzar re-fetch
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    res.setHeader('X-Robots-Tag', 'noindex') // Evitar indexación de esta página de preview
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

