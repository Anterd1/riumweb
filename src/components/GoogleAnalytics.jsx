import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID (GA4)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Función para inicializar Google Analytics
const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics ID no configurado. Configura VITE_GA_MEASUREMENT_ID en tu .env');
    return;
  }

  // Cargar el script de Google Analytics
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Configurar gtag
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  function gtag(...args) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // Deshabilitamos el page_view automático para manejarlo manualmente
  });
};

// Función para rastrear cambios de página
const trackPageView = (path) => {
  if (!GA_MEASUREMENT_ID || !window.gtag || typeof window.gtag !== 'function') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar GA solo una vez
    if (!window.gtag && GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  useEffect(() => {
    // Rastrear cambios de página cuando cambia la ruta
    if (window.gtag && typeof window.gtag === 'function') {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  // No renderiza nada
  return null;
};

export default GoogleAnalytics;

