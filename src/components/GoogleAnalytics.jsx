import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID (GA4)
const GA_MEASUREMENT_ID = 'G-JNM19SJQR8';

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Rastrear cambios de página cuando cambia la ruta
    // Google Analytics ya está inicializado en index.html
    if (window.gtag && typeof window.gtag === 'function') {
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

