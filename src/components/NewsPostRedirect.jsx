import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const NewsPostRedirect = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Detectar idioma preferido
    const savedLanguage = localStorage.getItem('i18nextLng');
    let lang = 'es'; // Por defecto español
    
    if (savedLanguage && savedLanguage.startsWith('en')) {
      lang = 'en';
    } else if (!savedLanguage) {
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('en')) {
        lang = 'en';
      }
    }
    
    // Redirigir a la ruta con prefijo de idioma
    navigate(`/${lang}/noticias/${slug}`, { replace: true });
  }, [slug, navigate]);

  return null;
};

export default NewsPostRedirect;

