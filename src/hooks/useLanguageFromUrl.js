import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useLanguageFromUrl = () => {
  const { lang } = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Detectar idioma desde la URL
    const pathLang = location.pathname.split('/')[1];
    const detectedLang = pathLang === 'en' || pathLang === 'es' ? pathLang : null;
    
    // Si hay un idioma en la URL y es diferente al actual, cambiarlo
    if (detectedLang && i18n.language !== detectedLang) {
      i18n.changeLanguage(detectedLang);
      localStorage.setItem('i18nextLng', detectedLang);
    }
  }, [location.pathname, i18n]);

  // Retornar el idioma actual (desde URL o i18n)
  const currentLang = lang || (location.pathname.startsWith('/en') ? 'en' : 'es');
  
  return currentLang;
};

