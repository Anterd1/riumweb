# Funcionalidad de Newsletter

Esta funcionalidad permite a los usuarios suscribirse al newsletter desde las páginas del blog y noticias.

## Migración de Base de Datos

Antes de usar esta funcionalidad, necesitas aplicar la migración SQL en Supabase:

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Ejecuta el contenido del archivo `scripts/add-newsletter-subscriptions-migration.sql`

O ejecuta directamente:

```sql
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  source TEXT,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email 
ON newsletter_subscriptions(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_active 
ON newsletter_subscriptions(active) 
WHERE active = TRUE;

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
ON newsletter_subscriptions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Authenticated users can view subscriptions"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update subscriptions"
ON newsletter_subscriptions
FOR UPDATE
TO authenticated
USING (true);
```

## Cómo Funciona

### Para Usuarios

1. Los usuarios pueden suscribirse desde:
   - Página del Blog (`/blog`)
   - Página de Noticias (`/noticias`)

2. Al suscribirse:
   - Se valida que el email sea válido
   - Se guarda en la base de datos
   - Se muestra un mensaje de confirmación
   - Si el email ya está suscrito, se reactiva automáticamente

### Para Administradores

1. Ve a `/admin/newsletter` para ver todas las suscripciones
2. Puedes:
   - Ver estadísticas (Total, Activas, Inactivas)
   - Filtrar por estado (Todos, Activas, Inactivas)
   - Activar/Desactivar suscripciones
   - Eliminar suscripciones

## Componente NewsletterSubscription

El componente `NewsletterSubscription` es reutilizable y acepta las siguientes props:

- `title`: Título del formulario (default: "¿Quieres Más Contenido?")
- `description`: Descripción del newsletter (default: mensaje genérico)
- `source`: Origen de la suscripción - 'blog', 'news', 'home' (default: "home")
- `className`: Clases CSS adicionales

## Próximos Pasos (Opcional)

Para enviar correos automáticamente a los suscriptores cuando publiques contenido:

1. Configurar servicio de correo (Hostinger SMTP, Resend, SendGrid, etc.)
2. Crear una Edge Function de Supabase que:
   - Se active cuando se publique un artículo/noticia
   - Obtenga todas las suscripciones activas
   - Envíe el correo a cada suscriptor

3. Integrar con el sistema de publicación para enviar notificaciones automáticas

