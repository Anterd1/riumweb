# Configuración del CMS - Panel de Administración

## ✅ Estado Actual

El CMS está completamente configurado y listo para usar. El sistema incluye:

- ✅ Sistema de autenticación con Supabase Auth
- ✅ Página de login (`/admin/login`)
- ✅ Dashboard de administración (`/admin`)
- ✅ Editor de artículos (crear/editar)
- ✅ Rutas protegidas
- ✅ Políticas de seguridad (RLS) configuradas

## 🚀 Cómo Crear tu Primer Usuario Administrador

### Opción 1: Crear usuario desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard/project/olmlyfgzucemnxiddgda)
2. Navega a **Authentication** > **Users**
3. Click en **"Add user"** > **"Create new user"**
4. Completa:
   - **Email**: tu email
   - **Password**: una contraseña segura
   - **Auto Confirm User**: ✅ Activar (para no requerir confirmación por email)
5. Click en **"Create user"**

### Opción 2: Crear usuario desde la aplicación (Requiere registro)

Si prefieres crear usuarios desde la aplicación, primero necesitas:

1. Crear una página de registro (opcional)
2. O usar la API de Supabase directamente

### Opción 3: Crear usuario con SQL

Puedes crear un usuario directamente con SQL en el SQL Editor de Supabase:

```sql
-- Esto creará un usuario, pero necesitarás configurar el email y contraseña
-- desde el dashboard de Supabase o usando la API de autenticación
```

**Nota**: La creación de usuarios con SQL requiere configuración adicional. Es más fácil usar el Dashboard.

## 📝 Rutas del CMS

- **Login**: `/admin/login`
- **Dashboard**: `/admin` (requiere autenticación)
- **Nuevo Artículo**: `/admin/posts/new` (requiere autenticación)
- **Editar Artículo**: `/admin/posts/:id` (requiere autenticación)

## 🔐 Seguridad

### Políticas RLS Configuradas:

1. **Lectura pública** (SELECT):
   - Cualquiera puede leer artículos con `published = true`

2. **Escritura autenticada** (INSERT, UPDATE, DELETE):
   - Solo usuarios autenticados pueden crear, editar y eliminar artículos

### Funcionalidades de Seguridad:

- ✅ Rutas protegidas con React Router
- ✅ Verificación de sesión en cada carga
- ✅ Redirección automática a login si no estás autenticado
- ✅ Cierre de sesión seguro

## 🎨 Funcionalidades del CMS

### Dashboard (`/admin`)

- Ver todos los artículos (publicados y borradores)
- Estadísticas:
  - Total de artículos
  - Artículos publicados
  - Borradores
- Acciones rápidas:
  - Crear nuevo artículo
  - Editar artículo existente
  - Eliminar artículo
  - Cerrar sesión

### Editor de Artículos (`/admin/posts/new` o `/admin/posts/:id`)

**Campos disponibles:**
- Título (requerido)
- Resumen/Excerpt (requerido)
- Contenido completo
- Autor
- Categoría (selector con opciones predefinidas)
- URL de imagen
- Tags (separados por comas)
- Tiempo de lectura
- Checkbox para publicar/guardar como borrador
- Programar publicación futura (fecha y hora con recordatorio visual)

**Categorías disponibles:**
- Diseño UI/UX
- Auditorías UX
- Arquitectura de Información
- Pruebas de Usabilidad
- Diseño Responsivo
- User Personas
- Investigación de Mercado

## 📱 Uso del CMS

### Crear un Artículo:

1. Inicia sesión en `/admin/login`
2. En el Dashboard, click en **"Nuevo Artículo"**
3. Completa el formulario
4. Marca **"Publicar artículo"** si quieres que sea visible.
5. (Opcional) Activa **"Programar publicación"** y elige fecha/hora para que se publique automáticamente. El sistema evitará que aparezca en el sitio hasta llegar a esa fecha.
6. Click en **"Crear Artículo"**

### Editar un Artículo:

1. En el Dashboard, click en el ícono de editar (lápiz) del artículo
2. Modifica los campos necesarios
3. Click en **"Actualizar Artículo"**

### Eliminar un Artículo:

1. En el Dashboard, click en el ícono de eliminar (papelera)
2. Confirma la eliminación

## 🛠️ Troubleshooting

### No puedo iniciar sesión

- Verifica que el usuario existe en Supabase Dashboard
- Verifica que el email y contraseña son correctos
- Revisa la consola del navegador para errores

### No puedo crear/editar artículos

- Verifica que estás autenticado (deberías ver tu email en el dashboard)
- Revisa la consola del navegador para errores
- Verifica que las políticas RLS están configuradas correctamente

### Los cambios no se guardan

- Verifica tu conexión a internet
- Revisa la consola del navegador
- Verifica que las políticas RLS permiten escritura para usuarios autenticados
- Confirma que la columna `publish_at` existe en la tabla `blog_posts`. Si no, ejecuta `scripts/add-publish-at-column.sql` en Supabase.

## 📚 Próximos Pasos (Opcional)

- [ ] Agregar editor de texto enriquecido (Rich Text Editor)
- [ ] Agregar subida de imágenes a Supabase Storage
- [ ] Agregar vista previa del artículo antes de publicar
- [ ] Agregar funcionalidad de búsqueda en el dashboard
- [ ] Agregar paginación en el dashboard
- [ ] Agregar múltiples roles de usuario (admin, editor, etc.)
- [ ] Agregar analytics de artículos

## 🔗 Enlaces Útiles

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- Dashboard del proyecto: https://supabase.com/dashboard/project/olmlyfgzucemnxiddgda
