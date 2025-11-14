# Configuración de Supabase para el Blog

Este documento explica cómo configurar Supabase para almacenar los artículos del blog.

## 1. Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Espera a que el proyecto se inicialice (puede tomar unos minutos)

## 2. Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## 3. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto (junto a `package.json`)
2. Agrega las siguientes variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

**Importante**: No subas el archivo `.env` a Git. Ya está en `.gitignore`.

## 4. Crear la tabla en Supabase

1. En tu proyecto de Supabase, ve a **Table Editor**
2. Click en **"New Table"**
3. Nombre de la tabla: `blog_posts`
4. Agrega las siguientes columnas:

| Column Name | Type | Default Value | Nullable | Primary Key |
|------------|------|---------------|----------|-------------|
| id | uuid | gen_random_uuid() | No | Yes |
| title | text | - | No | No |
| excerpt | text | - | No | No |
| content | text | - | Yes | No |
| author | text | - | Yes | No |
| category | text | - | No | No |
| image | text | - | Yes | No |
| tags | jsonb | - | Yes | No |
| read_time | text | - | Yes | No |
| publish_at | timestamptz | now() | Yes | No |
| published | boolean | false | No | No |
| user_id | uuid | - | Yes | No |
| created_at | timestamptz | now() | No | No |
| updated_at | timestamptz | now() | No | No |

### SQL para crear la tabla (alternativa):

Puedes ejecutar este SQL en el **SQL Editor** de Supabase:

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT,
  author TEXT,
  category TEXT NOT NULL,
  image TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
    read_time TEXT,
    publish_at TIMESTAMPTZ DEFAULT now(),
  published BOOLEAN DEFAULT false NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

  -- Crear índices para mejorar búsquedas
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
  CREATE INDEX idx_blog_posts_publish_at ON blog_posts(publish_at DESC);
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

  -- Crear trigger para actualizar updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

  ### ¿Ya tienes la tabla creada?

  Si tu tabla `blog_posts` ya existía antes de agregar la funcionalidad de programación, ejecuta el script `scripts/add-publish-at-column.sql` en el SQL Editor de Supabase para crear la columna `publish_at`, poblarla con datos reales y generar el índice correspondiente.

## 5. Configurar políticas de seguridad (RLS)

**IMPORTANTE**: Ejecuta el script completo `scripts/setup-rls-policies.sql` en el SQL Editor de Supabase para configurar todas las políticas correctamente.

### Opción 1: Ejecutar script completo (Recomendado)

1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido de `scripts/setup-rls-policies.sql`
3. Ejecuta el script

### Opción 2: Configurar manualmente

1. Ve a **Authentication** > **Policies** en Supabase
2. Selecciona la tabla `blog_posts`
3. Habilita **Row Level Security (RLS)**
4. Crea las siguientes políticas:

```sql
-- Política para lectura pública (artículos publicados)
CREATE POLICY "Public articles are viewable by everyone"
ON blog_posts FOR SELECT
USING (published = true);

-- Política para lectura de todos los artículos por usuarios autenticados (para el dashboard)
CREATE POLICY "Authenticated users can view all posts"
ON blog_posts FOR SELECT
TO authenticated
USING (true);

-- Política para INSERT: usuarios autenticados pueden crear artículos
CREATE POLICY "Users can insert their own posts"
ON blog_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: usuarios pueden actualizar sus propios artículos
CREATE POLICY "Users can update their own posts"
ON blog_posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: usuarios pueden eliminar sus propios artículos
CREATE POLICY "Users can delete their own posts"
ON blog_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## 6. Insertar datos de ejemplo (opcional)

Puedes insertar algunos artículos de ejemplo usando el SQL Editor:

```sql
INSERT INTO blog_posts (title, excerpt, content, author, category, image, tags, read_time, published, created_at) VALUES
(
  '10 Principios de Diseño UI/UX que Toda Aplicación Debe Seguir',
  'Descubre los principios fundamentales del diseño de interfaces que pueden transformar la experiencia de usuario en tu aplicación.',
  'El diseño UI/UX es fundamental para el éxito de cualquier aplicación digital...',
  'Equipo rium',
  'Diseño UI/UX',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["UI/UX", "Diseño", "Mejores Prácticas"]'::jsonb,
  '5 min',
  true,
  now()
),
(
  'Cómo Realizar una Auditoría UX Efectiva: Guía Completa',
  'Aprende paso a paso cómo realizar una auditoría de experiencia de usuario que identifique problemas reales y oportunidades de mejora.',
  'Las auditorías UX son una herramienta poderosa para identificar problemas en la experiencia de usuario...',
  'Equipo rium',
  'Auditorías UX',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  '["Auditoría", "UX", "Evaluación"]'::jsonb,
  '8 min',
  true,
  now()
);
```

## 7. Verificar la configuración

1. Reinicia el servidor de desarrollo (`npm run dev`)
2. Visita `/blog` en tu aplicación
3. Deberías ver los artículos cargándose desde Supabase

## Notas importantes

- Los artículos solo se mostrarán si `published = true`
- El campo `tags` debe ser un array JSON válido
- Las imágenes pueden ser URLs externas o referencias a archivos en Supabase Storage
- Para producción, considera configurar políticas RLS más restrictivas según tus necesidades

## Próximos pasos

- Crear un panel de administración para gestionar artículos
- Implementar almacenamiento de imágenes en Supabase Storage
- Agregar funcionalidad de búsqueda
- Implementar paginación para grandes volúmenes de artículos

