import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecciones automáticas para URLs comunes
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    
    const redirects = {
      '/contacto': '/contact',
      '/en/contacto': '/contact',
      '/en/soluciones': '/#services',
      '/explora': '/blog',
      '/tradingar': '/',
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
        className="min-h-screen bg-[#0C0D0D] text-white flex items-center justify-center px-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-9xl font-bold text-accent-purple mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Página no encontrada
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-8"
          >
            La página que buscas no existe o ha sido movida. 
            Puede que hayas seguido un enlace incorrecto o que la URL haya cambiado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="bg-accent-purple hover:bg-accent-purple/90 text-white font-bold px-8 py-6 text-lg rounded-full"
            >
              <Home className="mr-2" />
              Ir al inicio
            </Button>
            <Button
              onClick={() => navigate(-1)}
              size="lg"
              variant="outline"
              className="border-2 border-accent-purple/40 hover:bg-accent-purple/10 text-white px-8 py-6 text-lg rounded-full"
            >
              <ArrowLeft className="mr-2" />
              Volver atrás
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <p className="text-gray-500 mb-4">O explora nuestras secciones:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => navigate('/#services')}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Servicios
              </Button>
              <Button
                onClick={() => navigate('/blog')}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Blog
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                variant="ghost"
                className="text-gray-400 hover:text-white"
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

