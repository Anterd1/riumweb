import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedCtaBackground from '@/components/AnimatedCtaBackground';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const CTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const getLocalizedLink = useLocalizedLink();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <AnimatedCtaBackground />
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white uppercase"
          >
            {t('cta.title')} <span className="text-accent-purple">{t('cta.titleHighlight')}</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            {t('cta.description')}
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
              className="bg-accent-purple hover:bg-accent-purple/90 text-white font-bold px-8 py-6 text-lg rounded-full group"
            >
              {t('cta.button')}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
