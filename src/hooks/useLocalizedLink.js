import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

/**
 * Hook para generar URLs con prefijo de idioma
 * @returns {function} - Función que recibe un path y retorna la ruta con prefijo de idioma
 */
export const useLocalizedLink = () => {
  const { lang } = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();
  
  // Detectar idioma actual desde URL o i18n
  const currentLang = useMemo(() => {
    return lang || (location.pathname.startsWith('/en') ? 'en' : 'es');
  }, [lang, location.pathname]);
  
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

