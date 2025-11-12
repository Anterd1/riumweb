import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedHeroBackground = () => {
  // Reducir animaciones en móvil para mejor rendimiento
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-700/20" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl hidden md:block"
        animate={prefersReducedMotion ? {} : {
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl hidden md:block"
        animate={prefersReducedMotion ? {} : {
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ willChange: 'transform' }}
      />
      {/* Solo en desktop para reducir carga en móvil */}
      <motion.div
        className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl hidden lg:block"
        animate={prefersReducedMotion ? {} : {
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default AnimatedHeroBackground;
