-- ============================================
-- Políticas RLS para blog_posts
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- 1. Asegurar que la columna user_id existe
-- Si no existe, agregarla:
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Crear índice para mejorar búsquedas por user_id
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON blog_posts(user_id);

-- 3. Eliminar políticas existentes (si las hay)
DROP POLICY IF EXISTS "Public articles are viewable by everyone" ON blog_posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON blog_posts;

-- 4. Política para lectura pública (artículos publicados)
CREATE POLICY "Public articles are viewable by everyone"
ON blog_posts FOR SELECT
USING (published = true);

-- 5. Política para lectura de todos los artículos por usuarios autenticados (para el dashboard)
CREATE POLICY "Authenticated users can view all posts"
ON blog_posts FOR SELECT
TO authenticated
USING (true);

-- 6. Política para INSERT: usuarios autenticados pueden crear artículos
CREATE POLICY "Users can insert their own posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 7. Política para UPDATE: usuarios pueden actualizar sus propios artículos
CREATE POLICY "Users can update their own posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. Política para DELETE: usuarios pueden eliminar sus propios artículos
CREATE POLICY "Users can delete their own posts"
ON blog_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Verificar que RLS está habilitado
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

