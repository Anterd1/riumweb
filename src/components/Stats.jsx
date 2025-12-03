import React from 'react';
import { useInView } from 'framer-motion';
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
  const { t } = useTranslation();
  const isProjectPage = !!customStats;
  
  const defaultStats = useMemo(() => [
    {
      value: 20,
      suffix: '+',
      label: t('stats.stats.projects.label'),
      description: t('stats.stats.projects.description'),
    },
    {
      value: 100,
      suffix: '%',
      label: t('stats.stats.satisfaction.label'),
      description: t('stats.stats.satisfaction.description'),
    },
    {
      value: 300,
      suffix: '+',
      label: t('stats.stats.innovation.label'),
      description: t('stats.stats.innovation.description'),
    },
    {
      value: 10,
      suffix: '+',
      label: t('stats.stats.industries.label'),
      description: t('stats.stats.industries.description'),
    },
  ], [t]);
  
  const stats = customStats || defaultStats;

  return (
    <section id="stats-section" className="py-24 bg-white dark:bg-[#0C0D0D]">
      <div className="container mx-auto px-6">
        {!isProjectPage && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white uppercase">
                {t('stats.title')} <span className="text-accent-purple">{t('stats.titleHighlight')}</span>
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-lg text-gray-700 dark:text-gray-400 max-w-md">
                {t('stats.description')}
              </p>
            </div>
          </div>
        )}
        
        {isProjectPage && (
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white uppercase">
                    {t('stats.projectTitle')} <span className="text-accent-purple">{t('stats.projectTitleHighlight')}</span>
                </h2>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-50 dark:bg-[#1E1E2A] p-8 rounded-2xl h-full"
            >
              <div className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{stat.label}</h3>
                <p className="text-gray-700 dark:text-gray-400">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;