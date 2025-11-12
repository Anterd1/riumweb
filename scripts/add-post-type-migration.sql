-- Migración: Agregar campo post_type a blog_posts
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna post_type si no existe
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'article' NOT NULL;

-- Crear índice para mejorar búsquedas por tipo
CREATE INDEX IF NOT EXISTS idx_blog_posts_post_type ON blog_posts(post_type);

-- Actualizar posts existentes para que sean 'article' por defecto
UPDATE blog_posts 
SET post_type = 'article' 
WHERE post_type IS NULL OR post_type = '';

-- Agregar constraint para validar valores permitidos
ALTER TABLE blog_posts 
ADD CONSTRAINT check_post_type 
CHECK (post_type IN ('article', 'news'));

-- Comentario en la columna
COMMENT ON COLUMN blog_posts.post_type IS 'Tipo de post: article (artículo del blog) o news (noticia tech)';

