# Configuración de URLs Amigables (Slugs)

## Descripción

Este documento explica cómo se implementaron las URLs amigables (slugs) para artículos y noticias, reemplazando los IDs UUID por URLs legibles basadas en el título.

## Ejemplos de URLs

**Antes:**
- `/blog/dd2cf6b9-2ab2-4aa9-a98b-3936d27cd49a`
- `/noticias/a1b2c3d4-e5f6-7890-abcd-ef1234567890`

**Después:**
- `/blog/mejores-practicas-diseno-ui-ux-2024`
- `/noticias/nuevas-tendencias-tecnologia-diseno`

## Migración de Base de Datos

### Paso 1: Ejecutar la migración SQL

1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el contenido del archivo `scripts/add-slug-migration.sql`
3. Esto agregará:
   - Columna `slug` a la tabla `blog_posts`
   - Índice único para slugs
   - Función `generate_unique_slug()` en PostgreSQL

### Paso 2: Generar slugs para artículos existentes

Después de ejecutar la migración, necesitas generar slugs para los artículos existentes:

```sql
-- Generar slugs para todos los artículos que no tienen slug
UPDATE blog_posts
SET slug = generate_unique_slug(title, id)
WHERE slug IS NULL;
```

## Funcionamiento

### Generación Automática de Slugs

Los slugs se generan automáticamente cuando:
- Se crea un nuevo artículo/noticia
- Se edita un artículo que no tiene slug

El slug se genera a partir del título:
1. Se convierte a minúsculas
2. Se remueven acentos y caracteres especiales
3. Se reemplazan espacios con guiones
4. Se verifica que sea único (si existe, se agrega un número)

### Rutas Actualizadas

- **Blog:** `/blog/:slug` (antes `/blog/:id`)
- **Noticias:** `/noticias/:slug` (antes `/noticias/:id`)

### Compatibilidad con URLs Antiguas

El código incluye fallback a IDs para mantener compatibilidad:
- Si un post no tiene slug, se usa el ID como respaldo
- Las URLs antiguas seguirán funcionando temporalmente

## Archivos Modificados

1. **`scripts/add-slug-migration.sql`** - Migración de base de datos
2. **`src/lib/slug.js`** - Funciones para generar slugs
3. **`src/App.jsx`** - Rutas actualizadas para usar slugs
4. **`src/pages/BlogPost.jsx`** - Búsqueda por slug
5. **`src/pages/NewsPost.jsx`** - Búsqueda por slug
6. **`src/pages/admin/PostEditor.jsx`** - Generación automática de slugs
7. **`src/pages/Blog.jsx`** - URLs actualizadas
8. **`src/pages/News.jsx`** - URLs actualizadas
9. **`src/components/SectionBlog.jsx`** - URLs actualizadas
10. **`src/pages/admin/Dashboard.jsx`** - URLs actualizadas
11. **`src/pages/admin/NewsDashboard.jsx`** - URLs actualizadas
12. **`src/pages/Sitemap.jsx`** - URLs actualizadas en sitemap

## Beneficios

1. **SEO Mejorado:** URLs más descriptivas ayudan con el posicionamiento
2. **Legibilidad:** URLs más fáciles de leer y compartir
3. **Profesionalismo:** URLs similares a portales de noticias profesionales
4. **Compartibilidad:** Más fácil compartir en redes sociales

## Notas Importantes

- Los slugs son únicos y no pueden duplicarse
- Si cambias el título de un artículo publicado, el slug NO cambia automáticamente (para mantener URLs estables)
- Si necesitas cambiar el slug manualmente, puedes hacerlo desde Supabase directamente
- Las URLs antiguas con IDs seguirán funcionando como respaldo

