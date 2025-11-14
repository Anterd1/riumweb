-- Script para generar slugs para artículos existentes que no tienen slug
-- Ejecutar DESPUÉS de ejecutar add-slug-migration.sql

-- Generar slugs para todos los artículos que no tienen slug
UPDATE blog_posts
SET slug = generate_unique_slug(title, id)
WHERE slug IS NULL;

-- Verificar que todos los artículos tienen slug
SELECT 
  id,
  title,
  slug,
  post_type,
  published
FROM blog_posts
WHERE slug IS NULL;

-- Si hay artículos sin slug después de ejecutar el UPDATE,
-- ejecuta este comando para ver qué pasó:
-- SELECT id, title FROM blog_posts WHERE slug IS NULL;

