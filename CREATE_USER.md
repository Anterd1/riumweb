# Crear Usuario Administrador

## ✅ Credenciales del Usuario de Prueba

He preparado un usuario administrador para ti:

```
Email: admin@rium.com
Password: AdminRium2024!
```

## 🔧 Forma 1: Crear desde Supabase Dashboard (Más Fácil)

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/olmlyfgzucemnxiddgda
2. Navega a **Authentication** > **Users**
3. Click en **"Add user"** > **"Create new user"**
4. Completa:
   - **Email**: `admin@rium.com`
   - **Password**: `AdminRium2024!`
   - **Auto Confirm User**: ✅ Activar (muy importante)
5. Click en **"Create user"**

## 🔧 Forma 2: Crear usando SQL (Alternativa)

Si prefieres usar SQL, puedes ejecutar esto en el SQL Editor de Supabase:

```sql
-- Crear usuario administrador
-- Nota: Esto requiere permisos especiales y puede no funcionar directamente
-- Es mejor usar el Dashboard o el script

-- Alternativa: Usar la función de Supabase
SELECT * FROM auth.users WHERE email = 'admin@rium.com';
```

## 🔧 Forma 3: Usar el Script Automático

Si tienes el `SERVICE_ROLE_KEY` de Supabase:

1. Obtén el SERVICE_ROLE_KEY:
   - Ve a tu proyecto en Supabase Dashboard
   - Settings > API
   - Copia el "service_role" key (secret) ⚠️ NUNCA lo compartas

2. Agrega al archivo `.env`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
   ```

3. Ejecuta el script:
   ```bash
   node scripts/create-admin-user.js
   ```

## 🚀 Una vez creado el usuario

1. Inicia sesión en: http://localhost:3000/admin/login
2. Usa las credenciales:
   - Email: `admin@rium.com`
   - Password: `AdminRium2024!`

## ⚠️ IMPORTANTE

- Cambia la contraseña después del primer inicio de sesión
- Guarda estas credenciales en un lugar seguro
- El SERVICE_ROLE_KEY es muy sensible, nunca lo publiques

## 📝 Notas

- La tabla `auth.users` ya existe automáticamente en Supabase (no necesitas crearla)
- El usuario debe tener "Auto Confirm User" activado para no requerir confirmación por email
- Una vez creado, puedes gestionar el usuario desde el Dashboard de Supabase

