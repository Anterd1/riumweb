/**
 * Script para verificar artículos en la base de datos
 * Ejecutar: node scripts/check-blog-posts.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no configuradas.')
  console.error('   Buscando: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkPosts() {
  try {
    console.log('📚 Verificando artículos en la base de datos...\n')

    // Obtener todos los artículos
    const { data: allPosts, error: allError } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) {
      console.error('❌ Error al obtener artículos:', allError.message)
      return
    }

    console.log(`✅ Total de artículos encontrados: ${allPosts.length}\n`)

    if (allPosts.length === 0) {
      console.log('⚠️  No hay artículos en la base de datos.')
      return
    }

    // Mostrar todos los artículos
    allPosts.forEach((post, index) => {
      console.log(`\n📄 Artículo ${index + 1}:`)
      console.log(`   ID: ${post.id}`)
      console.log(`   Título: ${post.title || '(sin título)'}`)
      console.log(`   Autor: ${post.author || 'N/A'}`)
      console.log(`   Categoría: ${post.category || 'N/A'}`)
      console.log(`   Estado: ${post.published ? '✅ Publicado' : '📝 Borrador'}`)
      console.log(`   Creado: ${post.created_at ? new Date(post.created_at).toLocaleString('es-ES') : 'N/A'}`)
      console.log(`   Actualizado: ${post.updated_at ? new Date(post.updated_at).toLocaleString('es-ES') : 'N/A'}`)
      console.log(`   User ID: ${post.user_id || 'N/A'}`)
      if (post.excerpt) {
        console.log(`   Resumen: ${post.excerpt.substring(0, 100)}...`)
      }
    })

    // Estadísticas
    const published = allPosts.filter(p => p.published).length
    const drafts = allPosts.filter(p => !p.published).length

    console.log(`\n\n📊 Estadísticas:`)
    console.log(`   ✅ Publicados: ${published}`)
    console.log(`   📝 Borradores: ${drafts}`)

    // Verificar artículos recientes (últimas 24 horas)
    const oneDayAgo = new Date()
    oneDayAgo.setHours(oneDayAgo.getHours() - 24)
    const recentPosts = allPosts.filter(p => {
      if (!p.created_at) return false
      return new Date(p.created_at) > oneDayAgo
    })

    if (recentPosts.length > 0) {
      console.log(`\n🕐 Artículos creados en las últimas 24 horas: ${recentPosts.length}`)
      recentPosts.forEach(post => {
        console.log(`   - ${post.title} (${post.published ? 'Publicado' : 'Borrador'})`)
      })
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('   Stack:', error.stack)
  }
}

checkPosts().catch(console.error)

