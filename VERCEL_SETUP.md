# Configuración en Vercel

## 🚀 Pasos para Configurar Variables de Entorno

### 1. Acceder a tu Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Selecciona tu proyecto `riumweb` (o el nombre que tenga)

### 2. Configurar Variables de Entorno

1. En el dashboard de tu proyecto, ve a **Settings**
2. En el menú lateral, selecciona **Environment Variables**
3. Agrega las siguientes variables:

#### Variable 1:
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://olmlyfgzucemnxiddgda.supabase.co`
- **Environment**: Selecciona todas (Production, Preview, Development) ✅

#### Variable 2:
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbWx5Zmd6dWNlbW54aWRkZ2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjQ1MDUsImV4cCI6MjA3Nzg0MDUwNX0.oU3JQNUdFu-Ztip8V1FoRiHirSQP4T1mniEkseXJmlc`
- **Environment**: Selecciona todas (Production, Preview, Development) ✅

#### Variable 3:
- **Name**: `VITE_SUPABASE_SERVICE_ROLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbWx5Zmd6dWNlbW54aWRkZ2RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI2NDUwNSwiZXhwIjoyMDc3ODQwNTA1fQ.Sn91w8Xqi3AUANOdak3hwm8FCaERdql7UYBf4ZYlWu0`
- **Environment**: Selecciona todas (Production, Preview, Development) ✅
- **Nota**: Esta clave es necesaria para gestionar usuarios desde el panel de administración

4. Click en **Save** para cada variable

### 3. Configurar Build Settings (si es necesario)

1. Ve a **Settings** > **General**
2. Verifica que:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (o déjalo en blanco, Vercel lo detecta automáticamente)
   - **Output Directory**: `dist` (o déjalo en blanco)
   - **Install Command**: `npm install` (o déjalo en blanco)

### 4. Re-deploy

Después de agregar las variables de entorno:

1. Opción A - Re-deploy automático:
   - Si tienes GitHub conectado, Vercel se re-deploya automáticamente cuando haces push
   - Acabas de hacer push, así que debería estar desplegando ahora

2. Opción B - Re-deploy manual:
   - Ve a la pestaña **Deployments**
   - Encuentra el último deployment
   - Click en los tres puntos (⋮) > **Redeploy**
   - Selecciona **Use existing Build Cache** (opcional)
   - Click en **Redeploy**

### 5. Verificar el Deployment

1. Espera a que el deployment termine (verás un ✅ verde)
2. Visita tu dominio: https://www.rium.com.mx
3. Abre la consola del navegador (F12) y verifica:
   - No deberían haber errores en rojo
   - Deberías ver la página cargando correctamente

## 🔍 Verificar que las Variables Están Configuradas

### Método 1: Desde Vercel Dashboard
1. Ve a **Settings** > **Environment Variables**
2. Deberías ver las tres variables listadas:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_SERVICE_ROLE_KEY`

### Método 2: Desde el Build Log
1. Ve a **Deployments**
2. Click en el último deployment
3. Ve a la pestaña **Build Logs**
4. Busca las variables en el log (pueden estar encriptadas por seguridad)

### Método 3: Desde la Consola del Navegador
1. Visita tu sitio en producción
2. Abre la consola del navegador (F12)
3. Ejecuta:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
   ```
   - Si está configurado: verás la URL
   - Si NO está configurado: verás `undefined`

## ⚠️ Problemas Comunes

### Problema: "Las variables no se están aplicando"

**Solución:**
- Asegúrate de haber seleccionado **todas las environments** (Production, Preview, Development)
- Haz un **nuevo deployment** después de agregar las variables
- Las variables solo se aplican a nuevos deployments, no a los existentes

### Problema: "Build falla"

**Solución:**
- Verifica que el **Build Command** sea `npm run build`
- Verifica que el **Output Directory** sea `dist`
- Revisa los **Build Logs** para ver el error específico

### Problema: "La página sigue en blanco"

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Si ves errores de Supabase, las variables no están configuradas correctamente
4. Verifica que el deployment haya terminado correctamente (✅ verde)

## 📝 Notas Importantes

- ✅ Las variables de entorno son **seguras** en Vercel (se encriptan)
- ✅ Solo se aplican a **nuevos deployments** (no a los existentes)
- ✅ Puedes tener diferentes valores para Production, Preview y Development
- ✅ El `VITE_` prefix es necesario para que Vite exponga las variables al cliente
- ⚠️ El `VITE_SUPABASE_ANON_KEY` es seguro de exponer (es la clave pública/anónima)
- ⚠️ **IMPORTANTE**: El `VITE_SUPABASE_SERVICE_ROLE_KEY` es una clave de administrador. Aunque se expone al cliente con el prefijo `VITE_`, solo debe usarse en el panel de administración protegido. Nunca uses esta clave en código público o no protegido.

## 🔗 Enlaces Útiles

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Documentación de Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Documentación de Vite - Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## ✨ Después de Configurar

Una vez configuradas las variables y hecho el re-deploy:

1. ✅ La página debería cargar correctamente
2. ✅ El blog debería funcionar (con artículos de Supabase)
3. ✅ El CMS debería funcionar (con login)
4. ✅ El panel de gestión de usuarios debería funcionar correctamente
5. ✅ No deberías ver pantalla negra ni mensajes de error sobre variables no configuradas

Si aún tienes problemas, revisa la consola del navegador para ver errores específicos.

