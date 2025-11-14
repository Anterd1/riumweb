-- Migración para agregar campo scheduled_at a la tabla blog_posts
-- Permite programar publicaciones para fechas futuras

ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Crear índice para mejorar las consultas de artículos programados
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at 
ON blog_posts(scheduled_at) 
WHERE scheduled_at IS NOT NULL;

-- Comentario sobre el campo
COMMENT ON COLUMN blog_posts.scheduled_at IS 'Fecha y hora programada para publicar el artículo. Si es NULL, el artículo se publica inmediatamente cuando published=true';

