import React, { memo, Suspense, useEffect } from 'react';
import { Outlet, useLocation, useParams, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ThemeProvider from '@/components/ThemeProvider';
import { useLanguageFromUrl } from '@/hooks/useLanguageFromUrl';

const Layout = memo(() => {
  const location = useLocation();
  const params = useParams();
  const { lang } = params || {};
  
  useLanguageFromUrl(); // Hook para sincronizar idioma con URL

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location?.pathname]);
  
  // Guard: Si location o params no están disponibles (StrictMode double render), retornar null temporalmente
  if (!location || !params) {
    return null;
  }
  
  // Si no hay prefijo de idioma, redirigir a /es
  if (!lang || (lang !== 'es' && lang !== 'en')) {
    const pathWithoutLang = location.pathname || '';
    return <Navigate to={`/es${pathWithoutLang}`} replace />;
  }
  return (
    <ThemeProvider>
      <GoogleAnalytics />
      
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
        <main className="flex-grow pb-20 md:pb-0">
          <Suspense
            fallback={
              <div
                className="min-h-[45svh] animate-pulse bg-[#F2F0E9] px-4 pb-16 pt-28 sm:px-6"
                role="status"
                aria-label="Cargando página"
              >
                <div className="container mx-auto">
                  <div className="h-4 w-28 rounded-full bg-black/10" />
                  <div className="mt-6 h-12 max-w-2xl rounded-2xl bg-black/10 sm:h-16" />
                  <div className="mt-4 h-5 max-w-lg rounded-full bg-black/10" />
                </div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
});

Layout.displayName = 'Layout';

export default Layout;