import { Navigate, useParams } from 'react-router-dom';

const BlogPostRedirect = () => {
  const { slug } = useParams();
  const savedLanguage = localStorage.getItem('i18nextLng');
  const browserLanguage = navigator.language || navigator.userLanguage || 'es';
  const lang = savedLanguage
    ? (savedLanguage.startsWith('en') ? 'en' : 'es')
    : (browserLanguage.startsWith('en') ? 'en' : 'es');

  return <Navigate to={`/${lang}/blog${slug ? `/${slug}` : ''}`} replace />;
};

export default BlogPostRedirect;

