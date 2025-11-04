/**
 * Script para generar sitemap.xml estático
 * Ejecutar: node scripts/generate-sitemap.js
 * 
 * Este script genera un sitemap.xml que incluye:
 * - URLs estáticas de la página
 * - URLs dinámicas de artículos del blog desde Supabase
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

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Variables de entorno no configuradas. Generando sitemap solo con URLs estáticas.')
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const baseUrl = 'https://rium.com.mx'
const today = new Date().toISOString().split('T')[0]

// URLs estáticas
const staticUrls = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/project/social-media-app', priority: '0.7', changefreq: 'monthly' },
  { loc: '/project/fintech-dashboard', priority: '0.7', changefreq: 'monthly' },
  { loc: '/project/digital-marketing-agency-site', priority: '0.7', changefreq: 'monthly' },
]

async function generateSitemap() {
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

  // Agregar URLs de artículos del blog si Supabase está configurado
  if (supabase) {
    try {
      const { data: blogPosts, error } = await supabase
        .from('blog_posts')
        .select('id, created_at, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al obtener artículos del blog:', error.message)
      } else if (blogPosts && blogPosts.length > 0) {
        console.log(`✓ Agregando ${blogPosts.length} artículo(s) del blog al sitemap`)
        
        blogPosts.forEach((post) => {
          const lastmod = post.updated_at 
            ? new Date(post.updated_at).toISOString().split('T')[0]
            : new Date(post.created_at).toISOString().split('T')[0]
          
          xml += `  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
        })
      }
    } catch (error) {
      console.error('Error al generar sitemap con artículos:', error.message)
    }
  } else {
    console.log('⚠️  Supabase no configurado. Generando sitemap solo con URLs estáticas.')
  }

  xml += `</urlset>`

  // Escribir archivo
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml')
  writeFileSync(outputPath, xml, 'utf8')
  
  console.log(`✓ Sitemap generado exitosamente en: ${outputPath}`)
  console.log(`✓ Total de URLs: ${staticUrls.length + (supabase ? ' (incluye artículos del blog)' : '')}`)
}

generateSitemap().catch(console.error)

