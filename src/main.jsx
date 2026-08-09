import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import './i18n/config' // Inicializar i18n
import '@fontsource-variable/manrope'
import '@fontsource-variable/space-grotesk'
import './index.css'

// El service worker solo debe controlar builds de producción.
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((registration) => {
          registration.update();
          console.log('Service Worker registrado:', registration.scope)
        })
        .catch((error) => {
          console.log('Error al registrar Service Worker:', error)
        })
    })
  } else {
    // Evita módulos obsoletos al desarrollar después de haber abierto un build productivo.
    Promise.all([
      navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister()))
      ),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith('rium-')).map((key) => caches.delete(key)))
      ),
    ]).then(() => {
      if (navigator.serviceWorker.controller) {
        window.location.reload()
      }
    })
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </HelmetProvider>,
)

