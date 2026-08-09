import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ScanSearch, Shapes, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const isSpanish = i18n.language?.startsWith('es');
  const copy = isSpanish ? {
    kicker: 'Cómo ayudamos',
    title: 'Investigar. Diseñar. Mejorar.',
    description: 'Tres momentos, un mismo equipo. Nos sumamos desde la primera pregunta y seguimos hasta que la solución demuestra que funciona.',
    services: [
      { number: '01', icon: ScanSearch, title: 'Estrategia e investigación', description: 'Antes de dibujar, entendemos el negocio, escuchamos a las personas y encontramos el problema correcto.', tags: ['Research', 'Auditorías UX', 'Estrategia', 'Customer journeys'] },
      { number: '02', icon: Shapes, title: 'Diseño de producto', description: 'Convertimos lo complejo en una experiencia clara, coherente y lista para construir.', tags: ['UI/UX', 'Prototipos', 'Design systems', 'Web & mobile'] },
      { number: '03', icon: TrendingUp, title: 'Optimización y crecimiento', description: 'Después de lanzar, medimos lo que ocurre y mejoramos con evidencia, no con opiniones.', tags: ['CRO', 'SEO/SEM', 'Experimentos', 'Optimización'] }
    ]
  } : {
    kicker: 'How we help',
    title: 'Research. Design. Improve.',
    description: 'Three moments, one team. We join from the first question and stay until the solution proves it works.',
    services: [
      { number: '01', icon: ScanSearch, title: 'Strategy and research', description: 'Before drawing, we understand the business, listen to people and find the right problem.', tags: ['Research', 'UX audits', 'Strategy', 'Customer journeys'] },
      { number: '02', icon: Shapes, title: 'Product design', description: 'We turn complexity into a clear, coherent experience ready to build.', tags: ['UI/UX', 'Prototypes', 'Design systems', 'Web & mobile'] },
      { number: '03', icon: TrendingUp, title: 'Optimization and growth', description: 'After launch, we measure what happens and improve with evidence, not opinions.', tags: ['CRO', 'SEO/SEM', 'Experiments', 'Optimization'] }
    ]
  };

  return (
    <section id="services" className="overflow-hidden bg-[#5B72FF] py-16 text-white sm:py-20 md:py-32" itemScope itemType="https://schema.org/Service">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_.65fr] lg:items-end">
          <div>
            <p className="rium-kicker mb-6 text-[#DFFF4F]"><span className="h-2 w-2 rounded-full bg-[#DFFF4F]" />{copy.kicker}</p>
            <h2 className="max-w-4xl text-[clamp(2.35rem,11vw,3.5rem)] font-semibold leading-[.96] tracking-[-.05em] md:text-7xl md:leading-[.94] md:tracking-[-.055em]">{copy.title}</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg lg:justify-self-end" itemProp="description">{copy.description}</p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] bg-white/20 sm:mt-16 sm:rounded-[2rem] lg:grid-cols-3">
          {copy.services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.number}
                initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 12 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: isMobile ? .8 : .6, delay: reduceMotion ? 0 : index * .1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative min-h-[360px] bg-[#101114] p-6 sm:min-h-[400px] sm:p-8 md:min-h-[460px] md:p-10"
                itemScope
                itemType="https://schema.org/Service"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm text-[#DFFF4F]">{service.number}</span>
                  <motion.div
                    animate={reduceMotion ? undefined : { rotate: [0, isMobile ? 5 : 10, 0], scale: [1, isMobile ? 1.05 : 1.1, 1], color: ['rgba(255,255,255,.35)', '#DFFF4F', 'rgba(255,255,255,.35)'] }}
                    transition={{ duration: isMobile ? 5.5 : 4, repeat: Infinity, ease: 'easeInOut', delay: index * .7 }}
                    className="text-white/35"
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>
                </div>
                <div className="mt-14 sm:mt-20 md:mt-24">
                  <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl" itemProp="name">{service.title}</h3>
                  <p className="mt-4 leading-relaxed text-white/55 md:min-h-[72px]" itemProp="description">{service.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                    {service.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={tag}
                        initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 4 : 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: isMobile ? .6 : .4, delay: reduceMotion ? 0 : index * .1 + tagIndex * .05 }}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/60"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <motion.div
                  animate={reduceMotion ? undefined : { x: [0, isMobile ? 2 : 4, 0], y: [0, isMobile ? -2 : -4, 0], color: ['rgba(255,255,255,.2)', '#DFFF4F', 'rgba(255,255,255,.2)'] }}
                  transition={{ duration: isMobile ? 5 : 3.5, repeat: Infinity, ease: 'easeInOut', delay: index * .55 }}
                  className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8"
                >
                  <ArrowUpRight className="h-6 w-6" />
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
