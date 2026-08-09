import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductMockup = ({ variant }) => {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  if (variant === 'media') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#DFFF4F] p-4 sm:p-6 md:p-10" aria-hidden="true">
        <motion.div
          className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[28px] border-[#101114] sm:-right-16 sm:-top-16 sm:h-56 sm:w-56 sm:border-[42px]"
          animate={reduceMotion ? undefined : { rotate: 360 }}
          transition={{ duration: isMobile ? 26 : 18, ease: 'linear', repeat: Infinity }}
        />
        <motion.div
          className="relative mx-auto mt-7 max-w-md rounded-[1.25rem] border-[5px] border-[#101114] bg-[#F2F0E9] p-3 shadow-[10px_10px_0_#5B72FF] sm:mt-10 sm:rounded-[2rem] sm:border-[8px] sm:p-4 sm:shadow-[18px_18px_0_#5B72FF]"
          animate={reduceMotion ? { rotate: isMobile ? -1 : -3, y: 0 } : { rotate: [isMobile ? -1 : -3, isMobile ? 0 : -1, isMobile ? -1 : -3], y: [0, isMobile ? -4 : -9, 0] }}
          transition={{ duration: isMobile ? 7.5 : 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="aspect-video overflow-hidden rounded-xl bg-[#101114]">
            <div className="grid h-full place-items-center">
              <motion.span
                className="grid h-12 w-12 place-items-center rounded-full bg-[#DFFF4F] text-[#101114] sm:h-16 sm:w-16"
                animate={reduceMotion ? undefined : { scale: [1, isMobile ? 1.04 : 1.08, 1] }}
                transition={{ duration: isMobile ? 3.6 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Play className="ml-1 fill-current" />
              </motion.span>
            </div>
          </div>
          <motion.div initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: isMobile ? .9 : .7, delay: reduceMotion ? 0 : .2 }} className="mt-3 h-2.5 w-3/4 origin-left rounded-full bg-[#101114] sm:mt-4 sm:h-3" />
          <motion.div initial={reduceMotion ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: isMobile ? .9 : .7, delay: reduceMotion ? 0 : .35 }} className="mt-2 h-2 w-1/2 origin-left rounded-full bg-[#101114]/20" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#5B72FF] p-4 sm:p-6 md:p-10" aria-hidden="true">
      <div className="absolute inset-0 rium-grid opacity-40" />
      <div className="relative mx-auto flex h-full max-w-md items-center justify-center">
        <motion.div
          className="w-full rounded-[1.25rem] bg-[#F2F0E9] p-3 text-[#101114] shadow-[10px_10px_0_#101114] sm:rounded-[1.75rem] sm:p-5 sm:shadow-[18px_18px_0_#101114]"
          animate={reduceMotion ? { rotate: isMobile ? 1 : 2, y: 0 } : { rotate: [isMobile ? 1 : 2, 0, isMobile ? 1 : 2], y: [0, isMobile ? -4 : -8, 0] }}
          transition={{ duration: isMobile ? 7 : 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest">Overview</span>
            <motion.span animate={reduceMotion ? undefined : { scale: [1, isMobile ? 1.08 : 1.18, 1] }} transition={{ duration: isMobile ? 3.4 : 2.2, repeat: Infinity }} className="h-7 w-7 rounded-full bg-[#DFFF4F] sm:h-8 sm:w-8" />
          </div>
          <div className="grid grid-cols-2 gap-3 py-4">
            <div className="rounded-xl bg-[#101114] p-3 text-white sm:p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/50">Balance</p>
              <p className="mt-4 text-xl font-semibold sm:mt-6 sm:text-2xl">$24.8k</p>
            </div>
            <div className="rounded-xl bg-[#DFFF4F] p-3 sm:p-4">
              <p className="text-[10px] uppercase tracking-widest opacity-50">Growth</p>
              <p className="mt-4 text-xl font-semibold sm:mt-6 sm:text-2xl">+18%</p>
            </div>
          </div>
          <div className="flex h-16 items-end gap-2 rounded-xl border border-black/10 p-3 sm:h-24 sm:p-4">
            {[35, 60, 48, 72, 58, 92, 76].map((height, index) => (
              <motion.span
                key={index}
                className="w-full origin-bottom rounded-t bg-[#5B72FF]"
                initial={reduceMotion ? false : { height: 0 }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true, amount: .6 }}
                transition={{ duration: isMobile ? .85 : .65, delay: reduceMotion ? 0 : .08 * index, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const WorkCard = ({ card, index }) => {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 16 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .2 }}
      transition={{ duration: isMobile ? .9 : .7, delay: reduceMotion ? 0 : index * .12, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, isMobile ? (index === 0 ? -2 : -3) : (index === 0 ? -5 : -7), 0] }}
        transition={{ duration: isMobile ? (index === 0 ? 9 : 9.8) : (index === 0 ? 6.5 : 7.2), repeat: Infinity, ease: 'easeInOut', delay: index * .6 }}
        className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] shadow-xl shadow-black/10 sm:rounded-[2rem]"
      >
        <ProductMockup variant={card.variant} />
        <motion.span
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#101114] text-white sm:right-5 sm:top-5 sm:h-12 sm:w-12"
          animate={reduceMotion ? undefined : { rotate: [0, isMobile ? 20 : 45, isMobile ? 20 : 45, 0], scale: [1, isMobile ? 1.04 : 1.08, isMobile ? 1.04 : 1.08, 1] }}
          transition={{ duration: isMobile ? 6.8 : 4.8, repeat: Infinity, times: [0, .2, .65, 1], ease: 'easeInOut', delay: index * .7 }}
        >
          <ArrowUpRight className="h-5 w-5" />
        </motion.span>
      </motion.div>
      <div className="grid gap-3 px-1 pt-5 sm:pt-6 md:grid-cols-[1fr_.55fr]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#5B72FF]">{card.label}</p>
          <h3 className="text-[1.4rem] font-semibold tracking-tight sm:text-2xl md:text-3xl">{card.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-black/55 md:text-right">{card.description}</p>
      </div>
    </motion.article>
  );
};

const SelectedWork = () => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language?.startsWith('es');
  const copy = isSpanish ? {
    kicker: 'Cuando la estrategia toma forma',
    title: 'La claridad se reconoce cuando la usas.',
    intro: 'No empezamos por la pantalla. Empezamos por aquello que una persona necesita entender, decidir o completar sin fricción.',
    cards: [
      { label: 'Fintech · Producto digital', title: 'Lo complejo se vuelve cotidiano', description: 'Estrategia, arquitectura y sistemas de interfaz para experiencias financieras.', variant: 'fintech' },
      { label: 'Media · Plataformas', title: 'Cada historia encuentra su lugar', description: 'Experiencias editoriales claras, rápidas y diseñadas para crecer.', variant: 'media' }
    ],
    note: 'Hemos llevado esta forma de trabajar a equipos de banca, medios, retail y tecnología en Latinoamérica.'
  } : {
    kicker: 'When strategy takes shape',
    title: 'You recognize clarity when you use it.',
    intro: 'We do not start with the screen. We start with what a person needs to understand, decide or complete without friction.',
    cards: [
      { label: 'Fintech · Digital product', title: 'Complex becomes everyday', description: 'Strategy, architecture and interface systems for financial experiences.', variant: 'fintech' },
      { label: 'Media · Platforms', title: 'Every story finds its place', description: 'Clear, fast editorial experiences designed to grow.', variant: 'media' }
    ],
    note: 'We have brought this way of working to banking, media, retail and technology teams across Latin America.'
  };

  return (
    <section id="portfolio" className="overflow-hidden bg-[#F2F0E9] py-16 text-[#101114] sm:py-20 md:py-32">
      <div className="container mx-auto px-5 sm:px-6">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div>
            <p className="rium-kicker mb-6 text-[#5B72FF]"><span className="h-2 w-2 rounded-full bg-[#5B72FF]" />{copy.kicker}</p>
            <h2 className="max-w-4xl text-[clamp(2.35rem,11vw,3.5rem)] font-semibold leading-[.96] tracking-[-.05em] md:text-7xl md:leading-[.94] lg:text-8xl">{copy.title}</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-black/60 sm:text-lg lg:justify-self-end">{copy.intro}</p>
        </div>

        <div className="mt-10 grid gap-10 sm:mt-16 sm:gap-12 lg:grid-cols-2 lg:gap-6">
          {copy.cards.map((card, index) => <WorkCard key={card.title} card={card} index={index} />)}
        </div>

        <div className="mt-10 border-t border-black/15 pt-5 text-sm font-medium leading-relaxed text-black/55 sm:mt-16 sm:pt-6">{copy.note}</div>
      </div>
    </section>
  );
};

export default SelectedWork;
