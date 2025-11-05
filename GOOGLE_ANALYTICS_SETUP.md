# Configuración de Google Analytics

Esta guía explica cómo configurar Google Analytics (GA4) en tu sitio web.

## 📋 Pasos para Configurar

### 1. Crear una Propiedad en Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva propiedad (si no tienes una)
4. Selecciona **"Web"** como plataforma
5. Completa la información de tu sitio:
   - **Nombre de la propiedad**: rium.com.mx
   - **URL del sitio**: https://rium.com.mx
   - **Zona horaria**: (selecciona la apropiada)
6. Haz clic en **"Crear"**

### 2. Obtener el Measurement ID

1. Después de crear la propiedad, Google Analytics te mostrará un **Measurement ID**
2. El formato será: `G-XXXXXXXXXX` (por ejemplo: `G-ABC123XYZ`)
3. **Copia este ID**, lo necesitarás en el siguiente paso

### 3. Configurar en el Proyecto Local

1. Crea o edita el archivo `.env` en la raíz del proyecto
2. Agrega la siguiente variable:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Reemplaza `G-XXXXXXXXXX` con tu Measurement ID real.

### 4. Configurar en Producción (Vercel)

1. Ve a tu proyecto en [Vercel](https://vercel.com)
2. Navega a **Settings** > **Environment Variables**
3. Agrega una nueva variable:
   - **Name**: `VITE_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (tu Measurement ID)
   - **Environment**: Selecciona todas (Production, Preview, Development)
4. Haz clic en **Save**
5. **Re-deploy** tu aplicación para que los cambios surtan efecto

### 5. Verificar que Funciona

1. Visita tu sitio web
2. Navega por diferentes páginas
3. Ve a Google Analytics > **Reports** > **Realtime**
4. Deberías ver tus visitas en tiempo real

## 🔍 Características Implementadas

- ✅ **Rastreo automático de páginas**: Se rastrea cada cambio de ruta en tu SPA
- ✅ **Rastreo de eventos**: Listo para agregar eventos personalizados
- ✅ **Compatible con React Router**: Rastrea correctamente las navegaciones en tu aplicación

## 📊 Eventos Personalizados (Opcional)

Si quieres rastrear eventos personalizados, puedes usar la función `gtag` directamente:

```javascript
// Ejemplo: Rastrear un clic en un botón
const handleButtonClick = () => {
  if (window.gtag) {
    window.gtag('event', 'button_click', {
      'button_name': 'Contacto',
      'page_location': window.location.href
    });
  }
};
```

## 🛠️ Estructura del Código

- **Componente**: `src/components/GoogleAnalytics.jsx`
- **Integración**: Se importa en `src/App.jsx`
- **Variable de entorno**: `VITE_GA_MEASUREMENT_ID`

## ⚠️ Notas Importantes

- El componente solo se inicializa si el `VITE_GA_MEASUREMENT_ID` está configurado
- Si no está configurado, verás un warning en la consola (solo en desarrollo)
- No afecta el funcionamiento de tu sitio si no está configurado
- Los datos pueden tardar 24-48 horas en aparecer en los reportes estándar
- Los reportes en tiempo real funcionan inmediatamente

## 📝 Archivo .env.example

Para referencia, agrega esta línea a tu `.env.example`:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

