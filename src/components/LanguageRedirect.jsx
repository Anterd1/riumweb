import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a /es o /en según preferencia guardada o idioma del navegador
    const savedLanguage = localStorage.getItem('i18nextLng');
    let lang = 'es'; // Por defecto español
    
    if (savedLanguage && savedLanguage.startsWith('en')) {
      lang = 'en';
    } else if (!savedLanguage) {
      // Si no hay preferencia guardada, detectar del navegador
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('en')) {
        lang = 'en';
      }
    }
    
    navigate(`/${lang}`, { replace: true });
  }, [navigate]);

  return null;
};

export default LanguageRedirect;

