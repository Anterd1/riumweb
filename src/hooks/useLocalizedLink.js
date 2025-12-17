import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

/**
 * Hook para generar URLs con prefijo de idioma
 * @returns {function} - Función que recibe un path y retorna la ruta con prefijo de idioma
 */
export const useLocalizedLink = () => {
  const params = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();
  
  // Detectar idioma actual desde URL o i18n con fallbacks seguros
  const currentLang = useMemo(() => {
    // Prioridad 1: parámetro de ruta
    if (params?.lang && (params.lang === 'es' || params.lang === 'en')) {
      return params.lang;
    }
    
    // Prioridad 2: detectar desde pathname
    const pathname = location?.pathname || '';
    if (pathname.startsWith('/en')) return 'en';
    if (pathname.startsWith('/es')) return 'es';
    
    // Prioridad 3: usar idioma de i18n
    if (i18n?.language) {
      if (i18n.language.startsWith('en')) return 'en';
      if (i18n.language.startsWith('es')) return 'es';
    }
    
    // Fallback: español por defecto
    return 'es';
  }, [params?.lang, location?.pathname, i18n?.language]);
  
  // Retornar función que genera el link localizado
  return useMemo(() => {
    return (path = '') => {
      // Si el path ya incluye un prefijo de idioma, no duplicarlo
      if (path.startsWith('/es/') || path.startsWith('/en/')) {
        return path;
      }
      
      // Si el path es solo '/', retornar con idioma
      if (path === '/' || path === '') {
        return `/${currentLang}`;
      }
      
      // Asegurar que el path empiece con /
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      
      return `/${currentLang}${normalizedPath}`;
    };
  }, [currentLang]);
};

