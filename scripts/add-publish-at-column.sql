-- Agrega la columna publish_at para soportar publicaciones programadas
-- Ejecutar en el editor SQL de Supabase antes de desplegar los cambios de frontend

alter table public.blog_posts
add column if not exists publish_at timestamptz default now();

-- Asignar publish_at a los registros existentes (usa updated_at o created_at como fallback)
update public.blog_posts
set publish_at = coalesce(publish_at, updated_at, created_at, now())
where publish_at is null;

-- Índice para acelerar filtros por publish_at
create index if not exists blog_posts_publish_at_idx
on public.blog_posts (publish_at desc);

comment on column public.blog_posts.publish_at is 'Fecha/hora en la que el artículo debe ser visible públicamente. Permite programar publicaciones.';
