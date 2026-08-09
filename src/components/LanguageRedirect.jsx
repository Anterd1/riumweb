import { Navigate } from 'react-router-dom';

const LanguageRedirect = ({ targetPath = '' }) => {
  // Resolver el idioma durante el render evita un frame vacío antes de navegar.
  const savedLanguage = localStorage.getItem('i18nextLng');
  const browserLanguage = navigator.language || navigator.userLanguage || 'es';
  const lang = savedLanguage
    ? (savedLanguage.startsWith('en') ? 'en' : 'es')
    : (browserLanguage.startsWith('en') ? 'en' : 'es');

  return <Navigate to={`/${lang}${targetPath}`} replace />;
};

export default LanguageRedirect;

