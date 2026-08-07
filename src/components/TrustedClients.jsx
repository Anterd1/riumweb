import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

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

const LogoItem = ({ logo }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative flex h-28 w-[220px] shrink-0 items-center justify-center rounded-[1.5rem] border border-black/10 bg-white/55 px-8 sm:w-[260px]">
      {!imageError ? (
        <>
          {!imageLoaded && <div className="absolute h-8 w-24 animate-pulse rounded bg-black/5" />}
          <img
            src={logo.logo}
            alt={logo.alt}
            className={`max-h-12 max-w-[150px] object-contain grayscale transition-opacity duration-500 ${
              imageLoaded ? 'opacity-65' : 'opacity-0'
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
        <span className="text-center text-lg font-semibold text-[#101114]/55">{logo.name}</span>
      )}
    </div>
  );
};

const TrustedClients = () => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language?.startsWith('es');
  const reduceMotion = useReducedMotion();
  const copy = isSpanish ? {
    kicker: 'Confianza en movimiento',
    title: 'Diseñamos con equipos que mueven industrias.',
    description: 'De banca a medios, retail y tecnología: colaboramos con personas que quieren hacer avanzar sus productos.',
    metric: 'equipos',
    region: 'México + LATAM'
  } : {
    kicker: 'Trust in motion',
    title: 'We design with teams that move industries.',
    description: 'From banking to media, retail and technology: we work with people who want to move their products forward.',
    metric: 'teams',
    region: 'Mexico + LATAM'
  };

  return (
    <section className="overflow-hidden border-b border-black/10 bg-[#F2F0E9] py-24 text-[#101114] md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="rium-kicker mb-6 text-[#5B72FF]">
              <span className="h-2 w-2 rounded-full bg-[#5B72FF]" />
              {copy.kicker}
            </p>
            <h2 className="max-w-4xl text-5xl font-semibold leading-[.95] tracking-[-.055em] md:text-7xl">
              {copy.title}
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-black/55">{copy.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: .92, rotate: 3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .7, delay: .15 }}
            className="relative overflow-hidden rounded-[2rem] bg-[#5B72FF] p-7 text-white"
          >
            <motion.div
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[28px] border-[#DFFF4F]"
              aria-hidden="true"
            />
            <div className="relative">
              <div className="text-7xl font-semibold tracking-[-.07em]">13+</div>
              <div className="mt-2 text-lg font-semibold">{copy.metric}</div>
              <div className="mt-10 flex items-center justify-between border-t border-white/20 pt-4 text-xs font-bold uppercase tracking-[.14em] text-white/65">
                {copy.region}
                <ArrowUpRight className="h-4 w-4 text-[#DFFF4F]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative mt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F2F0E9] to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F2F0E9] to-transparent md:w-32" />
        <motion.div
          className="flex w-max"
          animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="flex shrink-0 gap-4 pr-4" aria-hidden={groupIndex === 1}>
              {clientLogos.map((logo) => <LogoItem key={`${groupIndex}-${logo.name}`} logo={logo} />)}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedClients;