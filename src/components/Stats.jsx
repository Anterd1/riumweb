import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const AnimatedCounter = ({ to, suffix }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        
        // Handle decimal values for stats like ratings
        const isDecimal = to % 1 !== 0;
        const increment = isDecimal ? to / steps : Math.ceil(to / steps);

        let currentCount = 0;
        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= to) {
                setCount(to);
                clearInterval(timer);
            } else {
                setCount(isDecimal ? parseFloat(currentCount.toFixed(1)) : Math.ceil(currentCount));
            }
        }, interval);

        return () => clearInterval(timer);
    }, [isInView, to]);

    return <span ref={ref}>{count}{suffix}</span>;
}

const Stats = ({ customStats }) => {
  const { t, i18n } = useTranslation();
  const isProjectPage = !!customStats;
  const isSpanish = i18n.language?.startsWith('es');
  
  const defaultStats = useMemo(() => [
    {
      value: 20,
      suffix: '+',
      label: isSpanish ? 'Proyectos' : 'Projects',
      description: isSpanish ? 'Productos y experiencias entregadas.' : 'Products and experiences delivered.',
    },
    {
      value: 13,
      suffix: '+',
      label: isSpanish ? 'Equipos' : 'Teams',
      description: isSpanish ? 'Que nos han invitado a resolver juntos.' : 'Who invited us to solve together.',
    },
    {
      value: 10,
      suffix: '+',
      label: isSpanish ? 'Industrias' : 'Industries',
      description: isSpanish ? 'Contextos distintos, una obsesión por la claridad.' : 'Different contexts, one obsession with clarity.',
    },
    {
      value: 2,
      suffix: '',
      label: isSpanish ? 'Idiomas' : 'Languages',
      description: isSpanish ? 'ES / EN para colaborar sin fronteras.' : 'ES / EN to collaborate across borders.',
    },
  ], [isSpanish]);
  
  const stats = customStats || defaultStats;

  return (
    <section id="stats-section" className="bg-[#101114] py-24 text-white md:py-32">
      <div className="container mx-auto px-6">
        {!isProjectPage && (
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            <div>
              <p className="rium-kicker mb-6 text-[#DFFF4F]"><span className="h-2 w-2 rounded-full bg-[#DFFF4F]" />{isSpanish ? 'Rium en números' : 'Rium in numbers'}</p>
              <h2 className="max-w-xl text-5xl font-semibold leading-[.95] tracking-[-.05em] md:text-7xl">
                {isSpanish ? 'La confianza se construye proyecto a proyecto.' : 'Trust is built one project at a time.'}
              </h2>
            </div>
          </div>
        )}
        
        {isProjectPage && (
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold uppercase text-white md:text-5xl lg:text-6xl">
                    {t('stats.projectTitle')} <span className="text-[#DFFF4F]">{t('stats.projectTitleHighlight')}</span>
                </h2>
            </div>
        )}

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] bg-white/15 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: .35 }}
              transition={{ duration: .5, delay: index * .08 }}
              className="h-full bg-[#17181D] p-8 md:min-h-[300px]"
            >
              <div className="mb-14 text-6xl font-semibold tracking-[-.05em] text-[#DFFF4F] md:text-7xl">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-white">{stat.label}</h3>
                <p className="text-sm leading-relaxed text-white/45">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;