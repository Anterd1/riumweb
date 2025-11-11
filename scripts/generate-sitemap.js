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

// URLs estáticas
const staticUrls = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/diseno-tu-pagina-web', priority: '0.9', changefreq: 'monthly' },
  { loc: '/project/social-media-app', priority: '0.7', changefreq: 'monthly' },
  { loc: '/project/fintech-dashboard', priority: '0.7', changefreq: 'monthly' },
  { loc: '/project/digital-marketing-agency-site', priority: '0.7', changefreq: 'monthly' },
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

async function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

  let totalUrls = 0

  // Agregar URLs estáticas
  console.log('📝 Agregando URLs estáticas...')
  staticUrls.forEach((url) => {
    xml += `  <url>
    <loc>${escapeXml(baseUrl + url.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`
    totalUrls++
  })

  // Agregar URLs de artículos del blog si Supabase está configurado
  let blogPostsCount = 0
  if (supabase) {
    try {
      console.log('📚 Obteniendo artículos del blog desde Supabase...')
      const { data: blogPosts, error } = await supabase
        .from('blog_posts')
        .select('id, created_at, updated_at, image, title')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error al obtener artículos del blog:', error.message)
        console.error('   Código:', error.code)
      } else if (blogPosts && blogPosts.length > 0) {
        console.log(`✓ Encontrados ${blogPosts.length} artículo(s) publicados`)
        
        blogPosts.forEach((post) => {
          const lastmod = formatDate(post.updated_at || post.created_at)
          const priority = calculatePriority(post.created_at)
          
          xml += `  <url>
    <loc>${escapeXml(`${baseUrl}/blog/${post.id}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>`
          
          // Agregar imagen si existe
          if (post.image) {
            const imageUrl = post.image.startsWith('http') 
              ? post.image 
              : `${baseUrl}${post.image}`
            
            xml += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      ${post.title ? `<image:title><![CDATA[${post.title}]]></image:title>` : ''}
    </image:image>`
          }
          
          xml += `
  </url>
`
          blogPostsCount++
          totalUrls++
        })
        
        console.log(`✓ Agregados ${blogPostsCount} artículo(s) del blog al sitemap`)
      } else {
        console.log('ℹ️  No hay artículos publicados en el blog')
      }
    } catch (error) {
      console.error('❌ Error al generar sitemap con artículos:', error.message)
      console.error('   Stack:', error.stack)
    }
  } else {
    console.log('⚠️  Supabase no configurado. Generando sitemap solo con URLs estáticas.')
    console.log('   Para incluir artículos del blog, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  }

  xml += `</urlset>`

  // Escribir archivo
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml')
  writeFileSync(outputPath, xml, 'utf8')
  
  console.log('\n✅ Sitemap generado exitosamente')
  console.log(`   📍 Ubicación: ${outputPath}`)
  console.log(`   📊 Total de URLs: ${totalUrls}`)
  console.log(`   📄 URLs estáticas: ${staticUrls.length}`)
  if (supabase) {
    console.log(`   📚 URLs de blog: ${blogPostsCount}`)
  }
}

generateSitemap().catch(console.error)

