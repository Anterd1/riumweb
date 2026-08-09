import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight } from 'lucide-react';

const About = () => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language?.startsWith('es');
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const copy = isSpanish ? {
    kicker: 'Cómo trabajamos contigo',
    title: 'No llegamos con todas las respuestas.',
    highlight: 'Llegamos con mejores preguntas.',
    description: 'Trabajamos como una extensión de tu equipo: compartimos el proceso, hacemos visibles las decisiones y dejamos capacidad instalada, no dependencia.',
    principles: [
      ['01', 'Escuchar el contexto', 'Entender el negocio, las restricciones y a las personas antes de proponer una dirección.'],
      ['02', 'Dar forma y probar', 'Hacer tangible la idea cuanto antes para aprender sin desperdiciar tiempo ni desarrollo.'],
      ['03', 'Dejar un sistema', 'Crear herramientas y criterios que permitan al producto seguir creciendo sin nosotros.']
    ]
  } : {
    kicker: 'How we work with you',
    title: 'We do not arrive with every answer.',
    highlight: 'We arrive with better questions.',
    description: 'We work as an extension of your team: sharing the process, making decisions visible and leaving capability behind, not dependency.',
    principles: [
      ['01', 'Listen to the context', 'Understand the business, constraints and people before proposing a direction.'],
      ['02', 'Shape and test', 'Make the idea tangible early to learn without wasting time or development effort.'],
      ['03', 'Leave a system', 'Create tools and criteria that let the product keep growing without us.']
    ]
  };

  return (
    <section id="about" className="overflow-hidden bg-[#101114] py-16 text-white sm:py-20 md:py-32">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="rium-kicker text-[#DFFF4F] lg:sticky lg:top-32"><span className="h-2 w-2 rounded-full bg-[#DFFF4F]" />{copy.kicker}</p>
          </div>
          <div>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 12 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: isMobile ? .8 : .5 }}
              className="text-[clamp(2.35rem,11vw,3.5rem)] font-semibold leading-[.98] tracking-[-.05em] md:text-7xl"
            >
              {copy.title}<br /><span className="text-[#5B72FF]">{copy.highlight}</span>
            </motion.h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:mt-10 sm:text-xl">{copy.description}</p>

            <div className="mt-12 border-t border-white/15 sm:mt-20">
              {copy.principles.map(([number, title, description], index) => (
                <motion.div
                  key={number}
                  initial={reduceMotion ? false : { opacity: 0, x: isMobile ? 12 : 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: .5 }}
                  transition={{ duration: isMobile ? .75 : .55, delay: reduceMotion ? 0 : index * .1, ease: [0.22, 1, 0.36, 1] }}
                  className="group grid grid-cols-[1fr_auto] gap-4 border-b border-white/15 py-6 sm:py-8 md:grid-cols-[80px_1fr_1fr_40px] md:items-center md:gap-5"
                >
                  <span className="font-mono text-sm text-[#DFFF4F]">{number}</span>
                  <h3 className="col-span-2 text-2xl font-medium tracking-tight md:col-span-1">{title}</h3>
                  <p className="col-span-2 text-sm leading-relaxed text-white/50 md:col-span-1">{description}</p>
                  <motion.div
                    animate={reduceMotion ? undefined : { rotate: [0, isMobile ? 18 : 45, 0], color: ['rgba(255,255,255,.25)', '#DFFF4F', 'rgba(255,255,255,.25)'] }}
                    transition={{ duration: isMobile ? 5.5 : 4, repeat: Infinity, ease: 'easeInOut', delay: index * .65 }}
                    className="col-start-2 row-start-1 md:col-start-4 md:row-auto"
                  >
                    <ArrowDownRight className="h-5 w-5" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;