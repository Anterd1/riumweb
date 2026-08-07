import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const CTA = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const getLocalizedLink = useLocalizedLink();
  const isSpanish = i18n.language?.startsWith('es');

  return (
    <section className="relative overflow-hidden bg-[#DFFF4F] py-24 text-[#101114] md:py-36">
      <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full border-[70px] border-[#5B72FF]" aria-hidden="true" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-6xl">
          <p className="rium-kicker mb-8"><span className="h-2 w-2 rounded-full bg-[#101114]" />{isSpanish ? 'El siguiente paso' : 'The next step'}</p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl text-6xl font-semibold leading-[.9] tracking-[-.06em] md:text-8xl lg:text-9xl"
          >
            {isSpanish ? 'Cuéntanos dónde se atora.' : 'Tell us where it gets stuck.'}<br />
            <span className="text-[#5B72FF]">{isSpanish ? 'Diseñemos cómo hacerlo avanzar.' : 'Let’s design how to move it forward.'}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10 mt-8 max-w-2xl text-lg leading-relaxed text-black/60 md:text-xl"
          >
            {isSpanish ? 'La primera conversación es para entender, no para venderte una solución prefabricada.' : 'The first conversation is for understanding, not selling you a ready-made solution.'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
              className="group rounded-full bg-[#101114] px-8 py-7 text-lg font-bold text-white hover:bg-[#5B72FF]"
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
