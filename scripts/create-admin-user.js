/**
 * Script para crear un usuario administrador
 * Ejecuta: node scripts/create-admin-user.js
 * 
 * Nota: Este script requiere el SERVICE_ROLE_KEY de Supabase
 * Para obtenerlo: Dashboard > Settings > API > service_role key (secret)
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

// Datos del usuario a crear
const userEmail = 'admin@rium.com'
const userPassword = 'AdminRium2024!'
const userData = {
  email: userEmail,
  password: userPassword,
  email_confirm: true, // Auto-confirmar email
  user_metadata: {
    role: 'admin',
    name: 'Administrador'
  }
}

async function createAdminUser() {
  try {
    console.log('🚀 Creando usuario administrador...\n')
    
    // Crear usuario
    const { data, error } = await supabase.auth.admin.createUser(userData)
    
    if (error) {
      // Si el usuario ya existe, intentar actualizar la contraseña
      if (error.message.includes('already registered')) {
        console.log('⚠️  El usuario ya existe. Actualizando contraseña...\n')
        
        // Obtener el usuario existente
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users.users.find(u => u.email === userEmail)
        
        if (existingUser) {
          // Actualizar contraseña
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: userPassword }
          )
          
          if (updateError) {
            throw updateError
          }
          
          console.log('✅ Contraseña actualizada correctamente\n')
        }
      } else {
        throw error
      }
    } else {
      console.log('✅ Usuario creado correctamente\n')
    }
    
    console.log('📋 Credenciales de acceso:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${userEmail}`)
    console.log(`   Password: ${userPassword}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🔗 URL de login: http://localhost:3000/admin/login\n')
    console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro')
    console.log('   Cambia la contraseña después del primer inicio de sesión\n')
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message)
    process.exit(1)
  }
}

createAdminUser()

