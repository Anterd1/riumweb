import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight } from 'lucide-react';

const About = () => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language?.startsWith('es');
  const reduceMotion = useReducedMotion();
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
    <section id="about" className="overflow-hidden bg-[#101114] py-24 text-white md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="rium-kicker sticky top-32 text-[#DFFF4F]"><span className="h-2 w-2 rounded-full bg-[#DFFF4F]" />{copy.kicker}</p>
          </div>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl font-semibold leading-[.98] tracking-[-.05em] md:text-7xl"
            >
              {copy.title}<br /><span className="text-[#5B72FF]">{copy.highlight}</span>
            </motion.h2>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white/60">{copy.description}</p>

            <div className="mt-20 border-t border-white/15">
              {copy.principles.map(([number, title, description], index) => (
                <motion.div
                  key={number}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: .5 }}
                  transition={{ duration: .55, delay: index * .1, ease: [0.22, 1, 0.36, 1] }}
                  className="group grid gap-5 border-b border-white/15 py-8 md:grid-cols-[80px_1fr_1fr_40px] md:items-center"
                >
                  <span className="font-mono text-sm text-[#DFFF4F]">{number}</span>
                  <h3 className="text-2xl font-medium tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{description}</p>
                  <motion.div
                    animate={reduceMotion ? undefined : { rotate: [0, 45, 0], color: ['rgba(255,255,255,.25)', '#DFFF4F', 'rgba(255,255,255,.25)'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * .65 }}
                    className="hidden md:block"
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