import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const CTA = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const getLocalizedLink = useLocalizedLink();
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const isSpanish = i18n.language?.startsWith('es');

  return (
    <section className="relative overflow-hidden bg-[#DFFF4F] py-16 text-[#101114] sm:py-20 md:py-36">
      <motion.div
        animate={reduceMotion ? undefined : { rotate: isMobile ? [0, 8, 0] : [0, 14, 0] }}
        transition={{ duration: isMobile ? 12 : 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[40px] border-[#5B72FF] md:-right-24 md:-top-28 md:h-96 md:w-96 md:border-[70px]"
        aria-hidden="true"
      />
      <div className="container relative z-10 mx-auto px-5 sm:px-6">
        <div className="max-w-6xl">
          <p className="rium-kicker mb-6 sm:mb-8"><span className="h-2 w-2 rounded-full bg-[#101114]" />{isSpanish ? 'El siguiente paso' : 'The next step'}</p>
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 14 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 1 : .8 }}
            className="max-w-5xl text-[clamp(2.35rem,11.5vw,3.75rem)] font-semibold leading-[.94] tracking-[-.05em] md:text-8xl md:leading-[.9] md:tracking-[-.06em] lg:text-9xl"
          >
            {isSpanish ? 'Cuéntanos dónde se atora.' : 'Tell us where it gets stuck.'}<br />
            <span className="text-[#5B72FF]">{isSpanish ? 'Diseñemos cómo hacerlo avanzar.' : 'Let’s design how to move it forward.'}</span>
          </motion.h2>
          
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 14 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 1 : .8, delay: reduceMotion ? 0 : .2 }}
            className="mb-8 mt-6 max-w-2xl text-base leading-relaxed text-black/60 sm:mb-10 sm:mt-8 sm:text-lg md:text-xl"
          >
            {isSpanish ? 'La primera conversación es para entender, no para venderte una solución prefabricada.' : 'The first conversation is for understanding, not selling you a ready-made solution.'}
          </motion.p>
          
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 14 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: isMobile ? 1 : .8, delay: reduceMotion ? 0 : .4 }}
          >
            <Button
              onClick={() => {
                // Rastrear clic en CTA
                if (window.gtag && typeof window.gtag === 'function') {
                  window.gtag('event', 'cta_click', {
                    event_category: 'Engagement',
                    event_label: 'CTA Section - Hablemos',
                    location: 'CTA Section'
                  });
                }
                navigate(getLocalizedLink('/contact'));
              }}
              size="lg"
              className="group w-full rounded-full bg-[#101114] px-6 py-6 text-base font-bold text-white hover:bg-[#5B72FF] sm:w-auto sm:px-8 sm:py-7 sm:text-lg"
            >
              {isSpanish ? 'Hablemos de tu producto' : 'Let’s talk about your product'}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
