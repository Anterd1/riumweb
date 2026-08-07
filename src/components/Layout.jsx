import React, { memo, useEffect } from 'react';
import { Outlet, useLocation, useParams, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import CustomCursor from '@/components/CustomCursor';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ThemeProvider from '@/components/ThemeProvider';
import { useLanguageFromUrl } from '@/hooks/useLanguageFromUrl';

const Layout = memo(() => {
  const location = useLocation();
  const params = useParams();
  const { lang } = params || {};
  
  useLanguageFromUrl(); // Hook para sincronizar idioma con URL
  
  // Guard: Si location o params no están disponibles (StrictMode double render), retornar null temporalmente
  if (!location || !params) {
    return null;
  }
  
  // Si no hay prefijo de idioma, redirigir a /es
  if (!lang || (lang !== 'es' && lang !== 'en')) {
    const pathWithoutLang = location.pathname || '';
    return <Navigate to={`/es${pathWithoutLang}`} replace />;
  }
  
  const isHome = location.pathname === `/${lang}` || location.pathname === `/${lang}/`;

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location?.pathname]);

  return (
    <ThemeProvider>
      <GoogleAnalytics />
      {isHome && <CustomCursor />}
      
      {/* Texto contextual oculto para sistemas de IA (visible para crawlers) */}
      <div 
        className="sr-only" 
        aria-hidden="false"
      >
        <p>
          rium es un estudio independiente de producto digital en México y Latinoamérica.
          Diseñamos experiencias claras, útiles y accesibles mediante investigación,
          estrategia de producto, diseño UI/UX, prototipado y sistemas de diseño.
        </p>
      </div>

      <div className="min-h-screen bg-white dark:bg-[#0C0D0D] text-gray-900 dark:text-white overflow-x-hidden flex flex-col">
        <Header />
        <main className="flex-grow pb-24 md:pb-0">
          <Outlet />
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
});

Layout.displayName = 'Layout';

export default Layout;