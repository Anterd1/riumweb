import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getLocalizedLink = useLocalizedLink();
  const shouldReduceMotion = useReducedMotion();

  // Redirecciones automáticas para URLs comunes
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    
    const redirects = {
      '/contacto': '/es/contact',
      '/en/contacto': '/en/contact',
      '/en/soluciones': '/en/#services',
      '/explora': '/es/blog',
      '/tradingar': '/es',
    };

    if (redirects[path]) {
      navigate(redirects[path], { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <SEO
        title="404 - Página no encontrada"
        description="La página que buscas no existe. Regresa al inicio o explora nuestros servicios de diseño UI/UX."
        url="https://rium.com.mx/404"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className="flex min-h-screen items-center justify-center bg-[#0C0D0D] px-4 py-24 text-white sm:px-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.4 }}
            className="mb-3 text-[clamp(5rem,28vw,8rem)] font-bold leading-none text-accent-purple sm:mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0 : 0.4 }}
            className="mb-4 text-[clamp(1.75rem,9vw,2.5rem)] font-bold leading-tight sm:mb-6 md:text-5xl"
          >
            Página no encontrada
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.4 }}
            className="mb-8 text-base leading-relaxed text-gray-400 sm:text-xl"
          >
            La página que buscas no existe o ha sido movida. 
            Puede que hayas seguido un enlace incorrecto o que la URL haya cambiado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate(getLocalizedLink('/'))}
              size="lg"
              className="min-h-12 w-full rounded-full bg-accent-purple px-6 py-5 text-base font-bold text-white active:scale-[.98] motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-6 sm:text-lg md:hover:bg-accent-purple/90"
            >
              <Home className="mr-2" />
              Ir al inicio
            </Button>
            <Button
              onClick={() => navigate(-1)}
              size="lg"
              variant="outline"
              className="min-h-12 w-full rounded-full border-2 border-accent-purple/40 px-6 py-5 text-base text-white active:scale-[.98] motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-6 sm:text-lg md:hover:bg-accent-purple/10"
            >
              <ArrowLeft className="mr-2" />
              Volver atrás
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.6, duration: shouldReduceMotion ? 0 : 0.4 }}
            className="mt-12"
          >
            <p className="text-gray-500 mb-4">O explora nuestras secciones:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate(getLocalizedLink('/#services'))}
                variant="ghost"
                className="min-h-11 text-gray-400 active:text-white md:hover:text-white"
              >
                Servicios
              </Button>
              <Button
                onClick={() => navigate(getLocalizedLink('/blog'))}
                variant="ghost"
                className="min-h-11 text-gray-400 active:text-white md:hover:text-white"
              >
                Blog
              </Button>
              <Button
                onClick={() => navigate(getLocalizedLink('/contact'))}
                variant="ghost"
                className="min-h-11 text-gray-400 active:text-white md:hover:text-white"
              >
                Contacto
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default NotFound;

