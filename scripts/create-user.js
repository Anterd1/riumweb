/**
 * Script para crear un nuevo usuario para publicar artículos y noticias
 * Ejecuta: node scripts/create-user.js
 * 
 * Nota: Este script requiere el SERVICE_ROLE_KEY de Supabase
 * Para obtenerlo: Dashboard > Settings > API > service_role key (secret)
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import readline from 'readline'

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Faltan las variables de entorno necesarias.')
  console.log('\n📝 Necesitas agregar a tu archivo .env:')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key')
  console.log('\n💡 Para obtener el SERVICE_ROLE_KEY:')
  console.log('   1. Ve a tu proyecto en Supabase Dashboard')
  console.log('   2. Settings > API')
  console.log('   3. Copia el "service_role" key (secret)')
  console.log('\n⚠️  IMPORTANTE: Nunca compartas ni publiques el service_role key')
  process.exit(1)
}

// Crear cliente con service_role (tiene permisos de admin)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Función para leer input del usuario
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => rl.question(query, answer => {
    rl.close()
    resolve(answer)
  }))
}

async function createUser() {
  try {
    console.log('\n🚀 Crear nuevo usuario para publicar artículos y noticias\n')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    // Solicitar datos del usuario
    const email = await askQuestion('📧 Email del usuario: ')
    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido')
      process.exit(1)
    }

    const password = await askQuestion('🔒 Contraseña (mínimo 6 caracteres): ')
    if (!password || password.length < 6) {
      console.error('❌ La contraseña debe tener al menos 6 caracteres')
      process.exit(1)
    }

    const name = await askQuestion('👤 Nombre del usuario (opcional): ') || 'Usuario'

    console.log('\n⏳ Creando usuario...\n')
    
    // Crear usuario
    const userData = {
      email: email.trim(),
      password: password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        role: 'editor',
        name: name.trim()
      }
    }

    const { data, error } = await supabase.auth.admin.createUser(userData)
    
    if (error) {
      // Si el usuario ya existe, informar
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log('⚠️  El usuario ya existe en el sistema.\n')
        console.log('💡 Opciones:')
        console.log('   1. Usa otro email')
        console.log('   2. Resetea la contraseña desde Supabase Dashboard')
        console.log('   3. El usuario puede iniciar sesión con las credenciales existentes\n')
        process.exit(1)
      } else {
        throw error
      }
    }
    
    console.log('✅ Usuario creado correctamente\n')
    console.log('📋 Credenciales de acceso:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   Nombre:   ${name}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🔗 URL de login: http://localhost:3000/admin/login\n')
    console.log('📝 El usuario puede:')
    console.log('   ✓ Crear y editar artículos del blog')
    console.log('   ✓ Crear y editar noticias tech')
    console.log('   ✓ Ver y gestionar solicitudes de contacto')
    console.log('   ✓ Publicar contenido (marcando "Publicar artículo/noticia")\n')
    console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro')
    console.log('   El usuario debe cambiar la contraseña después del primer inicio de sesión\n')
    
  } catch (error) {
    console.error('\n❌ Error al crear usuario:', error.message)
    console.error('\nDetalles:', error)
    process.exit(1)
  }
}

createUser()



