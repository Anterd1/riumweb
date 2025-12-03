import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const clientLogos = [
  { 
    name: 'BBVA', 
    logo: '/images/logos/BBVA.png',
    alt: 'BBVA'
  },
  { 
    name: 'Grupo Salinas', 
    logo: '/images/logos/grupo-salinas.png',
    alt: 'Grupo Salinas'
  },
  { 
    name: 'Televisa N+', 
    logo: '/images/logos/televisa-n+.png',
    alt: 'Televisa N+'
  },
  // TODO: Agregar logo cuando esté disponible
  // { 
  //   name: 'Expansive', 
  //   logo: '/images/logos/expansive.png',
  //   alt: 'Expansive'
  // },
  // TODO: Agregar logo cuando esté disponible
  // { 
  //   name: 'SegurosGCP', 
  //   logo: '/images/logos/seguros-gcp.png',
  //   alt: 'SegurosGCP'
  // },
  { 
    name: 'LaPuerta De Quetzalcoatl', 
    logo: '/images/logos/la-puerta-quetzalcoatl.png',
    alt: 'LaPuerta De Quetzalcoatl'
  },
  { 
    name: 'Harinas Elizondo', 
    logo: '/images/logos/harinas-elizondo.png',
    alt: 'Harinas Elizondo'
  },
  { 
    name: 'Fundación Dondé', 
    logo: '/images/logos/fundacion-donde.png',
    alt: 'Fundación Dondé'
  },
];

const marqueeLogos = [...clientLogos, ...clientLogos]; // Duplicate for seamless loop

const TrustedClients = () => {
  const { t } = useTranslation();
  
  const marqueeVariants = {
    animate: {
      x: [0, -2016], // Adjust as needed based on actual width
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 30,
          ease: 'linear'
        }
      }
    }
  };

  const LogoItem = ({ logo, index }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div 
        className="flex-shrink-0 w-48 mx-12 flex justify-center items-center h-20 relative"
      >
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute w-32 h-12 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            )}
            <img
              src={logo.logo}
              alt={logo.alt}
              className={`max-h-16 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              loading="lazy"
            />
          </>
        ) : (
          <span className="text-gray-800 dark:text-white text-xl md:text-2xl font-semibold opacity-70 dark:opacity-70">
            {logo.name}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white dark:bg-[#0C0D0D] border-t border-b border-gray-200 dark:border-[#1E1E2A] overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-400 mb-12 uppercase">{t('trustedClients.title')}</p>
        <div className="relative w-full">
          <motion.div className="flex" variants={marqueeVariants} animate="animate">
            {marqueeLogos.map((logo, index) => (
              <LogoItem key={index} logo={logo} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustedClients;