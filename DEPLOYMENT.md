# Guía de Deployment

## ⚠️ Problemas Comunes en Producción

### 1. Variables de Entorno Faltantes

El problema más común es que las variables de entorno no están configuradas en producción.

**Solución:**

1. En tu hosting (Vercel, Netlify, etc.), ve a **Settings** > **Environment Variables**
2. Agrega las siguientes variables:
   ```
   VITE_SUPABASE_URL=https://olmlyfgzucemnxiddgda.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbWx5Zmd6dWNlbW54aWRkZ2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjQ1MDUsImV4cCI6MjA3Nzg0MDUwNX0.oU3JQNUdFu-Ztip8V1FoRiHirSQP4T1mniEkseXJmlc
   ```
3. **Re-deploy** la aplicación después de agregar las variables

### 2. Build de Producción

Asegúrate de que el build funcione correctamente:

```bash
npm run build
```

Si hay errores, corrígelos antes de hacer deploy.

### 3. Verificar el Build

Después de hacer build, prueba localmente:

```bash
npm run preview
```

Visita `http://localhost:3000` y verifica que todo funcione.

## 📋 Checklist de Deployment

- [ ] Variables de entorno configuradas en el hosting
- [ ] Build exitoso (`npm run build`)
- [ ] Preview funciona localmente (`npm run preview`)
- [ ] Rutas configuradas correctamente (SPA routing)
- [ ] Archivos estáticos accesibles
- [ ] Supabase configurado y funcionando

## 🔧 Configuración por Hosting

### Vercel

1. Conecta tu repositorio de GitHub
2. En **Settings** > **Environment Variables**, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. En **Settings** > **Build & Development Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### Netlify

1. Conecta tu repositorio
2. En **Site settings** > **Build & deploy** > **Environment variables**:
   - Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy

### Otros Hostings

Asegúrate de:
- Configurar las variables de entorno
- Configurar el build command: `npm run build`
- Configurar el output directory: `dist`
- Configurar SPA routing (redirigir todas las rutas a `index.html`)

## 🐛 Debugging en Producción

### Verificar Variables de Entorno

Abre la consola del navegador y ejecuta:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurado' : 'No configurado')
```

### Verificar Errores

1. Abre las **Developer Tools** del navegador (F12)
2. Ve a la pestaña **Console**
3. Busca errores en rojo
4. Ve a la pestaña **Network** para ver si hay peticiones fallando

### Error Boundary

Si la aplicación se rompe completamente, el Error Boundary mostrará un mensaje de error amigable en lugar de una pantalla negra.

## 📝 Notas Importantes

- El archivo `.env` NO se sube a Git (está en `.gitignore`)
- Las variables de entorno deben configurarse en el hosting
- Después de cambiar variables de entorno, es necesario re-deploy
- En producción, los errores de Supabase no romperán la app (mostrará mensajes de error)

