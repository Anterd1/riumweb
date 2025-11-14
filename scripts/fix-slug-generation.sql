-- Script para mejorar la generación de slugs
-- Corrige problemas con caracteres especiales y guiones finales

-- Reemplazar función de generación de slugs con mejor manejo de caracteres
CREATE OR REPLACE FUNCTION generate_unique_slug(title TEXT, post_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convertir título a slug con mejor manejo de caracteres especiales
  base_slug := lower(trim(title));
  
  -- Reemplazar caracteres acentuados manualmente (PostgreSQL puede no tener unaccent)
  base_slug := replace(base_slug, 'á', 'a');
  base_slug := replace(base_slug, 'é', 'e');
  base_slug := replace(base_slug, 'í', 'i');
  base_slug := replace(base_slug, 'ó', 'o');
  base_slug := replace(base_slug, 'ú', 'u');
  base_slug := replace(base_slug, 'ñ', 'n');
  base_slug := replace(base_slug, 'ü', 'u');
  
  -- Remover caracteres especiales (mantener solo letras, números, espacios y guiones)
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  
  -- Reemplazar espacios múltiples con un solo espacio
  base_slug := regexp_replace(base_slug, '\s+', ' ', 'g');
  
  -- Reemplazar espacios con guiones
  base_slug := replace(base_slug, ' ', '-');
  
  -- Reemplazar múltiples guiones con uno solo
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  
  -- Remover guiones al inicio y al final
  base_slug := trim(both '-' from base_slug);
  
  -- Limitar longitud
  base_slug := left(base_slug, 100);
  
  -- Remover guiones al final de nuevo por si el substring dejó uno
  base_slug := regexp_replace(base_slug, '-+$', '');
  
  final_slug := base_slug;
  
  -- Verificar si el slug ya existe (excluyendo el post actual si se está editando)
  WHILE EXISTS (
    SELECT 1 FROM blog_posts 
    WHERE slug = final_slug 
    AND (post_id IS NULL OR id != post_id)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Regenerar todos los slugs con la función mejorada
UPDATE blog_posts
SET slug = generate_unique_slug(title, id);

-- Verificar los slugs generados
SELECT 
  id,
  title,
  slug,
  post_type,
  published,
  LENGTH(slug) as slug_length
FROM blog_posts
ORDER BY created_at DESC
LIMIT 10;

