/**
 * Script para generar sitemap.xml estático
 * Ejecutar: node scripts/generate-sitemap.js
 * 
 * Este script genera un sitemap.xml que incluye:
 * - URLs estáticas de la página
 * - URLs dinámicas de artículos del blog desde Supabase
 * - Imágenes de los artículos (sitemap de imágenes)
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Intentar cargar variables de entorno de diferentes lugares
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Variables de entorno no configuradas.')
  console.warn('   Buscando: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  console.warn('   Generando sitemap solo con URLs estáticas.')
}

const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== ''
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const baseUrl = 'https://rium.com.mx'
const today = new Date().toISOString().split('T')[0]

// URLs estáticas (sin prefijo de idioma, se generarán para ambos idiomas)
const staticUrls = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/noticias', priority: '0.8', changefreq: 'weekly' },
  { path: '/diseno-tu-pagina-web', priority: '0.9', changefreq: 'monthly' },
  { path: '/project/social-media-app', priority: '0.7', changefreq: 'monthly' },
  { path: '/project/fintech-dashboard', priority: '0.7', changefreq: 'monthly' },
  { path: '/project/digital-marketing-agency-site', priority: '0.7', changefreq: 'monthly' },
]

// Función para calcular prioridad basada en fecha
function calculatePriority(postDate) {
  const daysSincePublication = (new Date() - new Date(postDate)) / (1000 * 60 * 60 * 24)
  
  // Artículos recientes (menos de 30 días) tienen mayor prioridad
  if (daysSincePublication < 30) return '0.8'
  // Artículos entre 30 y 90 días
  if (daysSincePublication < 90) return '0.7'
  // Artículos antiguos
  return '0.6'
}

// Función para formatear fecha
function formatDate(dateString) {
  if (!dateString) return today
  try {
    return new Date(dateString).toISOString().split('T')[0]
  } catch {
    return today
  }
}

// Función para escapar caracteres especiales en XML
function escapeXml(unsafe) {
  if (!unsafe) return ''
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Función para generar URL con hreflang
function generateUrlWithHreflang(path, lastmod, changefreq, priority, image = null) {
  const esUrl = `${baseUrl}/es${path}`
  const enUrl = `${baseUrl}/en${path}`
  
  let urlXml = `  <url>
    <loc>${escapeXml(esUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(esUrl)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(esUrl)}"/>`
  
  if (image) {
    const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`
    urlXml += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
    </image:image>`
  }
  
  urlXml += `
  </url>
  <url>
    <loc>${escapeXml(enUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(esUrl)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(esUrl)}"/>`
  
  if (image) {
    const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`
    urlXml += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
    </image:image>`
  }
  
  urlXml += `
  </url>
`
  return urlXml
}

async function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

  let totalUrls = 0

  // Agregar URLs estáticas para ambos idiomas
  console.log('📝 Agregando URLs estáticas (es/en)...')
  staticUrls.forEach((url) => {
    xml += generateUrlWithHreflang(
      url.path || '/',
      today,
      url.changefreq,
      url.priority
    )
    totalUrls += 2 // Contamos ambas versiones (es y en)
  })

  // Agregar URLs de artículos del blog y noticias si Supabase está configurado
  let blogPostsCount = 0
  let newsPostsCount = 0
  
  if (supabase) {
    try {
      console.log('📚 Obteniendo artículos del blog y noticias desde Supabase...')
      
      // Obtener artículos del blog
      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, slug, created_at, updated_at, image, title, post_type')
        .eq('published', true)
        .eq('post_type', 'article')
        .order('created_at', { ascending: false })

      // Obtener noticias
      const { data: newsPosts, error: newsError } = await supabase
        .from('blog_posts')
        .select('id, slug, created_at, updated_at, image, title, post_type')
        .eq('published', true)
        .eq('post_type', 'news')
        .order('created_at', { ascending: false })

      if (blogError) {
        console.error('❌ Error al obtener artículos del blog:', blogError.message)
      } else if (blogPosts && blogPosts.length > 0) {
        console.log(`✓ Encontrados ${blogPosts.length} artículo(s) publicados`)
        
        blogPosts.forEach((post) => {
          const lastmod = formatDate(post.updated_at || post.created_at)
          const priority = calculatePriority(post.created_at)
          const slug = post.slug || post.id // Fallback a ID si no hay slug
          const path = `/blog/${slug}`
          
          xml += generateUrlWithHreflang(
            path,
            lastmod,
            'weekly',
            priority,
            post.image
          )
          
          blogPostsCount++
          totalUrls += 2 // Contamos ambas versiones (es y en)
        })
        
        console.log(`✓ Agregados ${blogPostsCount} artículo(s) del blog al sitemap`)
      } else {
        console.log('ℹ️  No hay artículos publicados en el blog')
      }

      if (newsError) {
        console.error('❌ Error al obtener noticias:', newsError.message)
      } else if (newsPosts && newsPosts.length > 0) {
        console.log(`✓ Encontradas ${newsPosts.length} noticia(s) publicadas`)
        
        newsPosts.forEach((post) => {
          const lastmod = formatDate(post.updated_at || post.created_at)
          const priority = calculatePriority(post.created_at)
          const slug = post.slug || post.id // Fallback a ID si no hay slug
          const path = `/noticias/${slug}`
          
          xml += generateUrlWithHreflang(
            path,
            lastmod,
            'weekly',
            priority,
            post.image
          )
          
          newsPostsCount++
          totalUrls += 2 // Contamos ambas versiones (es y en)
        })
        
        console.log(`✓ Agregadas ${newsPostsCount} noticia(s) al sitemap`)
      } else {
        console.log('ℹ️  No hay noticias publicadas')
      }
    } catch (error) {
      console.error('❌ Error al generar sitemap con posts:', error.message)
      console.error('   Stack:', error.stack)
    }
  } else {
    console.log('⚠️  Supabase no configurado. Generando sitemap solo con URLs estáticas.')
    console.log('   Para incluir artículos del blog y noticias, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  }

  xml += `</urlset>`

  // Escribir archivo
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml')
  writeFileSync(outputPath, xml, 'utf8')
  
  console.log('\n✅ Sitemap generado exitosamente')
  console.log(`   📍 Ubicación: ${outputPath}`)
  console.log(`   📊 Total de URLs: ${totalUrls}`)
  console.log(`   📄 URLs estáticas: ${staticUrls.length * 2} (${staticUrls.length} páginas × 2 idiomas)`)
  if (supabase) {
    console.log(`   📚 URLs de blog: ${blogPostsCount * 2} (${blogPostsCount} artículos × 2 idiomas)`)
    console.log(`   📰 URLs de noticias: ${newsPostsCount * 2} (${newsPostsCount} noticias × 2 idiomas)`)
  }
}

generateSitemap().catch(console.error)

