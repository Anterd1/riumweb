# Solución de Problemas - Blog

## Problema: Artículo no se guarda o no aparece

### Diagnóstico Rápido

1. **Ejecuta el script de verificación:**
   ```bash
   node scripts/check-blog-posts.js
   ```
   Esto mostrará todos los artículos en la base de datos.

### Soluciones Comunes

#### 1. Artículo guardado como borrador

**Síntoma:** El artículo se guardó pero no aparece en el blog público.

**Solución:**
- Ve al Dashboard (`/admin`)
- Busca tu artículo en la lista
- Si dice "Borrador", haz clic en "Editar"
- Marca el checkbox "Publicar artículo"
- Guarda los cambios

#### 2. Error de políticas RLS (Row Level Security)

**Síntoma:** Error al guardar: "No tienes permisos" o código 42501.

**Solución:**
1. Ve a Supabase Dashboard > SQL Editor
2. Ejecuta el script `scripts/setup-rls-policies.sql`
3. Esto configurará todas las políticas necesarias

#### 3. Falta la columna `user_id`

**Síntoma:** Error al guardar o artículos sin propietario.

**Solución:**
Ejecuta en Supabase SQL Editor:
```sql
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);
```

#### 4. Artículo no se muestra en el Dashboard

**Síntoma:** Guardaste el artículo pero no aparece en `/admin`.

**Verificaciones:**
- Desactiva el filtro "Solo mis artículos" en el Dashboard
- Verifica que estés autenticado con el mismo usuario que creó el artículo
- Revisa la consola del navegador (F12) para ver errores

#### 5. Error de autenticación

**Síntoma:** "Debes estar autenticado para crear artículos".

**Solución:**
- Cierra sesión y vuelve a iniciar sesión
- Verifica que tu usuario existe en Supabase > Authentication > Users
- Asegúrate de que el usuario tenga `Auto Confirm User` activado

### Verificación Paso a Paso

1. **Verifica que estás autenticado:**
   - Ve a `/admin`
   - Deberías ver tu email en la parte superior
   - Si no, inicia sesión en `/admin/login`

2. **Verifica las políticas RLS:**
   - Ve a Supabase Dashboard > Authentication > Policies
   - Selecciona la tabla `blog_posts`
   - Deberías ver 5 políticas:
     - Public articles are viewable by everyone
     - Authenticated users can view all posts
     - Users can insert their own posts
     - Users can update their own posts
     - Users can delete their own posts

3. **Verifica la estructura de la tabla:**
   - Ve a Supabase Dashboard > Table Editor > `blog_posts`
   - Verifica que existe la columna `user_id`
   - Verifica que RLS está habilitado

4. **Revisa los logs:**
   - Abre la consola del navegador (F12)
   - Intenta crear un artículo
   - Busca errores en la consola
   - Los errores ahora son más descriptivos

### Mejoras Implementadas

✅ **Manejo de errores mejorado:**
- Mensajes de error más descriptivos
- Validaciones antes de guardar
- Verificación de que el artículo se guardó correctamente
- Logs en consola para debugging

✅ **Feedback mejorado:**
- Mensajes de éxito más informativos
- Indica si el artículo está publicado o es borrador
- Muestra el título del artículo guardado

✅ **Scripts de utilidad:**
- `check-blog-posts.js` - Verifica artículos en la BD
- `setup-rls-policies.sql` - Configura políticas RLS

### Próximos Pasos

Si el problema persiste:

1. Ejecuta `node scripts/check-blog-posts.js` y comparte el resultado
2. Revisa la consola del navegador y comparte los errores
3. Verifica que ejecutaste `setup-rls-policies.sql` en Supabase
4. Asegúrate de que la columna `user_id` existe en la tabla

