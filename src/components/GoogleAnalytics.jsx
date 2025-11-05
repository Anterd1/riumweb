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

  // Configurar dataLayer primero
  window.dataLayer = window.dataLayer || [];
  function gtag(...args) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  // Cargar el script de Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  
  // Cuando el script cargue, inicializar GA y enviar el primer page_view
  script.onload = () => {
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    
    // Enviar el primer page_view explícitamente
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title
    });
  };
  
  document.head.appendChild(script);
};

// Función para rastrear cambios de página
const trackPageView = (path) => {
  if (!GA_MEASUREMENT_ID || !window.gtag || typeof window.gtag !== 'function') return;

  // Enviar un evento page_view explícito
  window.gtag('event', 'page_view', {
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

