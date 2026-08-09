import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, MousePointer2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const Hero = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const getLocalizedLink = useLocalizedLink();
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const isSpanish = i18n.language?.startsWith('es');

  const copy = isSpanish ? {
    eyebrow: 'Estrategia de producto · UX/UI · Desarrollo web',
    titleA: 'Diseñamos',
    titleB: 'productos digitales',
    titleC: 'que funcionan.',
    description: 'Investigamos, diseñamos y optimizamos apps, sitios y plataformas para que sean fáciles de usar, convertir y escalar.',
    cta: 'Hablemos de tu producto',
    work: 'Conoce nuestro proceso',
    signal: 'Señal de producto',
    metric: 'Más claridad',
    status: 'Listo para probar'
  } : {
    eyebrow: 'Product strategy · UX/UI · Web development',
    titleA: 'We design',
    titleB: 'digital products',
    titleC: 'that work.',
    description: 'We research, design and optimize apps, websites and platforms so they are easier to use, convert and scale.',
    cta: 'Let’s talk about your product',
    work: 'Discover our process',
    signal: 'Product signal',
    metric: 'More clarity',
    status: 'Ready to test'
  };

  return (
    <section className="relative overflow-hidden bg-[#101114] pb-12 pt-28 text-white md:min-h-[760px] md:pb-16 md:pt-32">
      <div className="absolute inset-0 rium-grid opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 rium-noise opacity-[0.17] mix-blend-soft-light" aria-hidden="true" />
      <div className="absolute -right-28 top-24 h-72 w-72 rounded-full bg-[#5B72FF] opacity-25 blur-[100px] md:-right-36 md:top-20 md:h-[540px] md:w-[540px] md:opacity-30 md:blur-[140px]" aria-hidden="true" />
      <div className="absolute -left-28 bottom-0 h-56 w-56 rounded-full bg-[#DFFF4F] opacity-10 blur-[100px] md:-left-40 md:h-80 md:w-80 md:blur-[140px]" aria-hidden="true" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6">
        <div className="grid items-center gap-10 md:gap-14 lg:grid-cols-[1.2fr_.8fr]">
          <div className="lg:pt-0">
            <div className="rium-kicker mb-6 max-w-[18rem] text-[#DFFF4F] sm:mb-8 sm:max-w-none">
              <span className="h-2 w-2 rounded-full bg-[#DFFF4F]" />
              {copy.eyebrow}
            </div>

            <h1 className="max-w-5xl text-[clamp(2.15rem,10.8vw,3.8rem)] font-semibold leading-[.9] tracking-[-.055em] sm:leading-[.86] md:text-[clamp(3.8rem,8.3vw,8.6rem)] md:leading-[.84] md:tracking-[-.065em]">
              <span className="block">
                {copy.titleA}
              </span>
              <span className="block rium-outline-text">
                {copy.titleB}
              </span>
              <span className="block text-[#DFFF4F]">
                {copy.titleC}
              </span>
            </h1>

            <div className="mt-7 flex max-w-3xl flex-col gap-6 sm:mt-10 sm:gap-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-xl text-base leading-relaxed text-white/68 sm:text-lg md:text-xl">{copy.description}</p>
              <button
                onClick={() => navigate(getLocalizedLink('/contact'))}
                className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-full bg-[#DFFF4F] px-6 py-4 text-sm font-bold text-[#101114] transition-transform hover:-translate-y-1 sm:w-auto sm:px-7 sm:text-base"
              >
                {copy.cta}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: isMobile ? .97 : .94, rotate: isMobile ? 1 : 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: isMobile ? 1.05 : .9, delay: isMobile ? .15 : .35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[300px] sm:max-w-[360px] lg:mt-24 lg:max-w-[460px]"
            aria-hidden="true"
          >
            <motion.div
              animate={reduceMotion ? undefined : {
                x: [0, isMobile ? 5 : 16, 0],
                y: [0, isMobile ? -5 : -14, 0],
                rotate: [isMobile ? -2 : -8, isMobile ? -1 : -4, isMobile ? -2 : -8],
              }}
              transition={{ duration: isMobile ? 9 : 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[.07] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:rounded-[2.25rem] sm:p-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-white/60">
                  <Sparkles className="h-4 w-4 text-[#DFFF4F]" /> {copy.signal}
                </div>
                <span className="h-2 w-2 rounded-full bg-[#DFFF4F] shadow-[0_0_18px_#DFFF4F]" />
              </div>

              <div className="relative mt-4 h-[68%] overflow-hidden rounded-[1.25rem] bg-[#5B72FF] p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
                <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 400 400" fill="none">
                  <path className="rium-flow" d="M-20 330C80 330 40 150 160 180C250 202 220 55 430 85" stroke="#DFFF4F" strokeWidth="2" />
                  <path className="rium-flow" d="M-10 120C90 80 120 260 230 220C310 190 330 300 430 260" stroke="white" strokeOpacity=".7" strokeWidth="2" />
                </svg>
                <div className="relative flex h-full flex-col justify-between">
                  <div className="ml-auto w-3/4 rounded-2xl bg-[#101114] p-4 shadow-xl">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#FF7A59]" />
                      <span className="h-2 w-2 rounded-full bg-[#DFFF4F]" />
                    </div>
                    <div className="h-2 w-2/3 rounded-full bg-white/80" />
                    <div className="mt-2 h-2 w-5/6 rounded-full bg-white/20" />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-white/20" />
                  </div>

                  <div className="w-3/4 rounded-2xl bg-[#F2F0E9] p-4 text-[#101114] shadow-xl">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-55">{copy.metric}</p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">+42</p>
                      </div>
                      <div className="flex h-10 w-16 items-end gap-1">
                        {[45, 65, 52, 85, 100].map((height, index) => (
                          <span key={index} className="w-full rounded-t-sm bg-[#5B72FF]" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <MousePointer2 className="absolute bottom-14 right-6 h-7 w-7 fill-[#DFFF4F] text-[#101114] sm:bottom-20 sm:right-8 sm:h-8 sm:w-8" />
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-white/55">{copy.status}</span>
                <span className="rounded-full border border-[#DFFF4F]/40 px-3 py-1 text-xs text-[#DFFF4F]">v.01</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <button
          onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
          className="group mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[.12em] text-white/55 hover:text-white sm:mt-6 sm:text-sm sm:tracking-[.14em]"
        >
          {copy.work}
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 group-hover:bg-white group-hover:text-black">
            <ArrowDownRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </section>
  );
};

export default Hero;