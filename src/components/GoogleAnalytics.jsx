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

  // Inicializar dataLayer ANTES de cargar el script
  // Esto permite que el script procese los eventos cuando se carga
  window.dataLayer = window.dataLayer || [];
  
  // Función temporal gtag que solo hace push al dataLayer
  // El script real de GA reemplazará esta función cuando se cargue
  function gtag(...args) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  // Configurar GA antes de cargar el script
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true
  });

  // Cargar el script de Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  
  // Verificar que el script se cargó correctamente
  script.onload = () => {
    console.log('Google Analytics script cargado correctamente');
    // El script de GA ahora procesará automáticamente el dataLayer
  };
  
  script.onerror = () => {
    console.error('Error al cargar el script de Google Analytics');
  };
  
  document.head.appendChild(script);
};

// Función para rastrear cambios de página
const trackPageView = (path) => {
  if (!GA_MEASUREMENT_ID || !window.gtag || typeof window.gtag !== 'function') return;

  // Usar config para actualizar la página actual (método recomendado para GA4)
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title
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
    // Esperar un poco para asegurar que el script esté cargado
    const timer = setTimeout(() => {
      if (window.gtag && typeof window.gtag === 'function') {
        trackPageView(location.pathname + location.search);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  // No renderiza nada
  return null;
};

export default GoogleAnalytics;

