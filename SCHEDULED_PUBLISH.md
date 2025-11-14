# Funcionalidad de Agendar Publicaciones

Esta funcionalidad permite programar artículos y noticias para que se publiquen automáticamente en una fecha y hora específica.

## Migración de Base de Datos

Antes de usar esta funcionalidad, necesitas aplicar la migración SQL en Supabase:

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Ejecuta el contenido del archivo `scripts/add-scheduled-publish-migration.sql`

O ejecuta directamente:

```sql
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled_at 
ON blog_posts(scheduled_at) 
WHERE scheduled_at IS NOT NULL;
```

## Cómo Usar

### Programar una Publicación

1. Al crear o editar un artículo/noticia, marca el checkbox "Programar publicación"
2. Selecciona la fecha y hora deseada (debe ser una fecha futura)
3. Guarda el artículo
4. El artículo aparecerá con estado "Programado" en el dashboard

### Publicación Automática

- El sistema verifica cada minuto si hay artículos programados que deben publicarse
- Cuando llega la fecha/hora programada, el artículo se publica automáticamente
- El campo `scheduled_at` se limpia automáticamente después de la publicación

### Estados de Publicación

- **Publicado**: Artículo visible públicamente
- **Programado**: Artículo programado para publicarse en el futuro
- **Borrador**: Artículo no publicado

## Notas Técnicas

- Los artículos programados NO aparecen en las páginas públicas hasta que se publiquen
- La verificación de artículos programados se ejecuta cada minuto cuando el dashboard está abierto
- Para producción, se recomienda configurar un cron job o función serverless que ejecute esta verificación periódicamente

## Limitaciones

- La verificación automática solo funciona cuando el dashboard está abierto en el navegador
- Para publicación automática en producción sin depender del navegador, se recomienda usar:
  - Supabase Edge Functions con cron triggers
  - Un servicio externo que ejecute la verificación periódicamente
  - Un webhook que se active periódicamente

