import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnimatedHeroBackground from '@/components/AnimatedHeroBackground';
import MaskedText from '@/components/MaskedText';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleCTAClick = () => {
    navigate('/contact');
  };
  
  const handleViewWorkClick = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-black">
      {/* Background Video - Optimizado para móvil */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/video/videocover.mp4" type="video/mp4" />
      </video>
      {/* Overlay para mejor legibilidad del texto - Más oscuro para mejor contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90"></div>
      {/* Animated Background Elements */}
      <AnimatedHeroBackground />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-left md:text-center"> {/* Responsive alignment */}

          <div className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] text-white uppercase tracking-tight">
            <MaskedText delay={0.2}>
              {[
                "Somos la agencia líder",
                "de diseño UI/UX en",
                <span key="latam" className="text-accent-purple">Latinoamérica</span>
              ]}
            </MaskedText>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <p
              className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed" // Centered on desktop - Más claro para mejor legibilidad
            >
              Mejoramos productos digitales que no convierten.<br className="hidden md:block" />
              Diseñamos interfaces que aumentan ventas, reducen costos de desarrollo<br className="hidden md:block" />
              y mejoran la satisfacción de tus usuarios.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col sm:flex-row gap-4 justify-start md:justify-center" // Responsive justification
          >
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="bg-accent-purple hover:bg-accent-purple/90 text-white font-bold px-8 py-6 text-lg rounded-full group"
            >
              Hablemos
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={handleViewWorkClick}
              size="lg"
              variant="outline"
              className="border-2 border-accent-purple/40 hover:bg-accent-purple/10 text-white px-8 py-6 text-lg rounded-full hidden"
            >
              Ver Nuestro Trabajo
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block" // Hidden on mobile, shown on md and up
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-accent-purple/40 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent-purple rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;