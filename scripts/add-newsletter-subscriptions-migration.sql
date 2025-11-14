-- Migración para crear tabla de suscripciones al newsletter
-- Almacena los emails de usuarios suscritos al newsletter

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  source TEXT, -- 'blog', 'news', 'home', etc.
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email 
ON newsletter_subscriptions(email);

-- Crear índice para filtrar suscripciones activas
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_active 
ON newsletter_subscriptions(active) 
WHERE active = TRUE;

-- Habilitar RLS (Row Level Security)
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede insertar suscripciones (público)
CREATE POLICY "Anyone can subscribe to newsletter"
ON newsletter_subscriptions
FOR INSERT
TO public
WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden ver suscripciones (admin)
CREATE POLICY "Authenticated users can view subscriptions"
ON newsletter_subscriptions
FOR SELECT
TO authenticated
USING (true);

-- Política: Solo usuarios autenticados pueden actualizar suscripciones (admin)
CREATE POLICY "Authenticated users can update subscriptions"
ON newsletter_subscriptions
FOR UPDATE
TO authenticated
USING (true);

-- Comentarios
COMMENT ON TABLE newsletter_subscriptions IS 'Almacena las suscripciones al newsletter';
COMMENT ON COLUMN newsletter_subscriptions.email IS 'Email del suscriptor (único)';
COMMENT ON COLUMN newsletter_subscriptions.active IS 'Indica si la suscripción está activa';
COMMENT ON COLUMN newsletter_subscriptions.source IS 'Origen de la suscripción (blog, news, home, etc.)';
COMMENT ON COLUMN newsletter_subscriptions.subscribed_at IS 'Fecha de suscripción';
COMMENT ON COLUMN newsletter_subscriptions.unsubscribed_at IS 'Fecha de cancelación de suscripción';

