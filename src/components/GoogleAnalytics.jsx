import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID (GA4)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics ID no configurado. Configura VITE_GA_MEASUREMENT_ID en tu .env');
      return;
    }

    // Inicializar dataLayer y gtag ANTES de cargar el script
    window.dataLayer = window.dataLayer || [];
    function gtag(...args) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    // Configurar GA
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true
    });

    // Cargar el script de Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    
    // Importante: agregar el script al head para que se ejecute
    document.head.appendChild(script);

    // Esperar a que el script se cargue y luego verificar
    script.onload = () => {
      // Dar tiempo para que el script procese el dataLayer
      setTimeout(() => {
        // Verificar si el script real procesó el dataLayer
        if (window.dataLayer && window.dataLayer.length > 0) {
          console.log('Google Analytics inicializado. DataLayer tiene', window.dataLayer.length, 'eventos');
        }
      }, 500);
    };
  }, []);

  useEffect(() => {
    // Rastrear cambios de página
    if (window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;

