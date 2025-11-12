# Gestión de Usuarios desde el Dashboard

## ✅ Configuración Inicial

Para poder gestionar usuarios desde el panel de administración, necesitas configurar el `SERVICE_ROLE_KEY` de Supabase.

### Paso 1: Obtener el SERVICE_ROLE_KEY

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard/project/olmlyfgzucemnxiddgda
2. Navega a **Settings** > **API**
3. Busca la sección **Project API keys**
4. Copia el **`service_role` key** (secret) ⚠️ **NUNCA lo compartas ni lo publiques**

### Paso 2: Agregar al archivo .env

Agrega la siguiente línea a tu archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

**⚠️ IMPORTANTE:**
- El `service_role` key tiene permisos de administrador completos
- **NUNCA** lo subas a Git (ya está en `.gitignore`)
- Solo úsalo en desarrollo o en un backend seguro
- En producción, deberías usar Edge Functions de Supabase para esta funcionalidad

### Paso 3: Reiniciar el servidor

Después de agregar la variable, reinicia el servidor de desarrollo:

```bash
npm run dev
```

## 🚀 Uso del Panel de Usuarios

Una vez configurado, puedes:

1. **Acceder al panel de usuarios:**
   - Ve a `/admin/users` en tu aplicación
   - O haz clic en "Usuarios" en el sidebar del admin

2. **Crear un nuevo usuario:**
   - Haz clic en "Nuevo Usuario"
   - Completa el formulario:
     - **Email**: Email del usuario
     - **Contraseña**: Mínimo 6 caracteres
     - **Nombre**: Opcional
   - Haz clic en "Crear Usuario"

3. **Ver usuarios existentes:**
   - La lista muestra todos los usuarios registrados
   - Puedes ver su email, nombre, rol y fecha de creación

4. **Eliminar usuarios:**
   - Haz clic en el icono de eliminar junto al usuario
   - Confirma la eliminación

## 📋 Permisos de Usuarios

Los usuarios creados desde el panel tienen:
- ✅ Acceso al panel de administración (`/admin`)
- ✅ Pueden crear y editar artículos del blog
- ✅ Pueden crear y editar noticias tech
- ✅ Pueden ver y gestionar solicitudes de contacto
- ✅ Pueden publicar contenido (marcando "Publicar artículo/noticia")

## 🔒 Seguridad

- Los usuarios se crean con `email_confirm: true` (no requieren confirmación por email)
- Cada usuario puede cambiar su contraseña después del primer inicio de sesión
- Solo usuarios autenticados pueden acceder al panel de administración

## 🛠️ Alternativa: Crear usuarios desde Supabase Dashboard

Si prefieres crear usuarios manualmente:

1. Ve a Supabase Dashboard > **Authentication** > **Users**
2. Click en **"Add user"** > **"Create new user"**
3. Completa el formulario y activa **"Auto Confirm User"**
4. El usuario podrá iniciar sesión inmediatamente

## 📝 Notas

- El `SERVICE_ROLE_KEY` solo debe usarse en desarrollo o desde un backend seguro
- En producción, considera usar Supabase Edge Functions para gestionar usuarios
- Los usuarios pueden iniciar sesión en `/admin/login` con sus credenciales



