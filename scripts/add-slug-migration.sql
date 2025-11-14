-- Migración para agregar campo slug a blog_posts
-- Permite URLs amigables basadas en el título del artículo/noticia

-- Agregar columna slug a blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Crear índice único para slugs
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_slug 
ON blog_posts(slug) 
WHERE slug IS NOT NULL;

-- Crear función para generar slugs únicos
CREATE OR REPLACE FUNCTION generate_unique_slug(title TEXT, post_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convertir título a slug: minúsculas, reemplazar espacios y caracteres especiales
  base_slug := lower(trim(title));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- Limitar longitud
  base_slug := left(base_slug, 100);
  
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

-- Comentarios
COMMENT ON COLUMN blog_posts.slug IS 'URL amigable generada a partir del título del artículo/noticia';
COMMENT ON FUNCTION generate_unique_slug IS 'Genera un slug único a partir de un título, evitando duplicados';

