import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  // Construir servicios desde traducciones
  const services = useMemo(() => [
    {
      title: t('services.uiux.title'),
      description: t('services.uiux.description'),
      points: [
        { title: t('services.uiux.points.infoArchitecture.title'), description: t('services.uiux.points.infoArchitecture.description') },
        { title: t('services.uiux.points.wireframes.title'), description: t('services.uiux.points.wireframes.description') },
        { title: t('services.uiux.points.ui.title'), description: t('services.uiux.points.ui.description') },
        { title: t('services.uiux.points.interactions.title'), description: t('services.uiux.points.interactions.description') },
        { title: t('services.uiux.points.responsive.title'), description: t('services.uiux.points.responsive.description') },
        { title: t('services.uiux.points.mobile.title'), description: t('services.uiux.points.mobile.description') },
        { title: t('services.uiux.points.web.title'), description: t('services.uiux.points.web.description') },
        { title: t('services.uiux.points.accessibility.title'), description: t('services.uiux.points.accessibility.description') },
        { title: t('services.uiux.points.designSystem.title'), description: t('services.uiux.points.designSystem.description') },
        { title: t('services.uiux.points.graphic.title'), description: t('services.uiux.points.graphic.description') },
        { title: t('services.uiux.points.uxWriting.title'), description: t('services.uiux.points.uxWriting.description') }
      ]
    },
    {
      title: t('services.audits.title'),
      description: t('services.audits.description'),
      points: [
        { title: t('services.audits.points.heuristic.title'), description: t('services.audits.points.heuristic.description') },
        { title: t('services.audits.points.usability.title'), description: t('services.audits.points.usability.description') },
        { title: t('services.audits.points.cardSorting.title'), description: t('services.audits.points.cardSorting.description') },
        { title: t('services.audits.points.remoteModerated.title'), description: t('services.audits.points.remoteModerated.description') },
        { title: t('services.audits.points.remoteUnmoderated.title'), description: t('services.audits.points.remoteUnmoderated.description') },
        { title: t('services.audits.points.abTesting.title'), description: t('services.audits.points.abTesting.description') },
        { title: t('services.audits.points.surveys.title'), description: t('services.audits.points.surveys.description') },
        { title: t('services.audits.points.accessibilityAudit.title'), description: t('services.audits.points.accessibilityAudit.description') },
        { title: t('services.audits.points.technical.title'), description: t('services.audits.points.technical.description') },
        { title: t('services.audits.points.performance.title'), description: t('services.audits.points.performance.description') },
        { title: t('services.audits.points.funnel.title'), description: t('services.audits.points.funnel.description') }
      ]
    },
    {
      title: t('services.research.title'),
      description: t('services.research.description'),
      points: [
        { title: t('services.research.points.interviews.title'), description: t('services.research.points.interviews.description') },
        { title: t('services.research.points.surveys.title'), description: t('services.research.points.surveys.description') },
        { title: t('services.research.points.benchmark.title'), description: t('services.research.points.benchmark.description') },
        { title: t('services.research.points.trends.title'), description: t('services.research.points.trends.description') },
        { title: t('services.research.points.focusGroups.title'), description: t('services.research.points.focusGroups.description') },
        { title: t('services.research.points.personas.title'), description: t('services.research.points.personas.description') },
        { title: t('services.research.points.journey.title'), description: t('services.research.points.journey.description') }
      ]
    },
    {
      title: t('services.seo.title'),
      description: t('services.seo.description'),
      points: [
        { title: t('services.seo.points.technicalAudit.title'), description: t('services.seo.points.technicalAudit.description') },
        { title: t('services.seo.points.keywords.title'), description: t('services.seo.points.keywords.description') },
        { title: t('services.seo.points.onPage.title'), description: t('services.seo.points.onPage.description') },
        { title: t('services.seo.points.offPage.title'), description: t('services.seo.points.offPage.description') },
        { title: t('services.seo.points.content.title'), description: t('services.seo.points.content.description') },
        { title: t('services.seo.points.local.title'), description: t('services.seo.points.local.description') },
        { title: t('services.seo.points.googleAds.title'), description: t('services.seo.points.googleAds.description') },
        { title: t('services.seo.points.display.title'), description: t('services.seo.points.display.description') },
        { title: t('services.seo.points.remarketing.title'), description: t('services.seo.points.remarketing.description') },
        { title: t('services.seo.points.reports.title'), description: t('services.seo.points.reports.description') },
        { title: t('services.seo.points.speed.title'), description: t('services.seo.points.speed.description') },
        { title: t('services.seo.points.ecommerce.title'), description: t('services.seo.points.ecommerce.description') }
      ]
    },
    {
      title: t('services.web.title'),
      description: t('services.web.description'),
      points: [
        { title: t('services.web.points.responsive.title'), description: t('services.web.points.responsive.description') },
        { title: t('services.web.points.landing.title'), description: t('services.web.points.landing.description') },
        { title: t('services.web.points.ecommerce.title'), description: t('services.web.points.ecommerce.description') },
        { title: t('services.web.points.corporate.title'), description: t('services.web.points.corporate.description') },
        { title: t('services.web.points.cro.title'), description: t('services.web.points.cro.description') },
        { title: t('services.web.points.integration.title'), description: t('services.web.points.integration.description') },
        { title: t('services.web.points.dashboards.title'), description: t('services.web.points.dashboards.description') },
        { title: t('services.web.points.migration.title'), description: t('services.web.points.migration.description') },
        { title: t('services.web.points.performance.title'), description: t('services.web.points.performance.description') },
        { title: t('services.web.points.accessible.title'), description: t('services.web.points.accessible.description') },
        { title: t('services.web.points.prototyping.title'), description: t('services.web.points.prototyping.description') },
        { title: t('services.web.points.maintenance.title'), description: t('services.web.points.maintenance.description') }
      ]
    },
    {
      title: t('services.retail.title'),
      description: t('services.retail.description'),
      points: [
        { title: t('services.retail.points.omnichannel.title'), description: t('services.retail.points.omnichannel.description') },
        { title: t('services.retail.points.pos.title'), description: t('services.retail.points.pos.description') },
        { title: t('services.retail.points.loyalty.title'), description: t('services.retail.points.loyalty.description') },
        { title: t('services.retail.points.email.title'), description: t('services.retail.points.email.description') },
        { title: t('services.retail.points.seasonal.title'), description: t('services.retail.points.seasonal.description') },
        { title: t('services.retail.points.catalogs.title'), description: t('services.retail.points.catalogs.description') },
        { title: t('services.retail.points.proximity.title'), description: t('services.retail.points.proximity.description') },
        { title: t('services.retail.points.behavior.title'), description: t('services.retail.points.behavior.description') },
        { title: t('services.retail.points.pricing.title'), description: t('services.retail.points.pricing.description') },
        { title: t('services.retail.points.influencers.title'), description: t('services.retail.points.influencers.description') },
        { title: t('services.retail.points.events.title'), description: t('services.retail.points.events.description') },
        { title: t('services.retail.points.content.title'), description: t('services.retail.points.content.description') }
      ]
    }
  ], [t]);

  const handleServiceClick = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Chips para todos los servicios usando traducciones
  const filterTags = useMemo(() => [
    t('services.filters.uiux'),
    t('services.filters.audits'),
    t('services.filters.research'),
    t('services.filters.seo'),
    t('services.filters.web'),
    t('services.filters.retail')
  ], [t]);

  // Mapeo de chips a servicios (índices) usando las traducciones
  const filterTagMap = useMemo(() => {
    const map = {};
    filterTags.forEach((tag, index) => {
      map[tag] = index;
    });
    return map;
  }, [filterTags]);

  const handleFilterClick = (tag) => {
    const serviceIndex = filterTagMap[tag];
    if (serviceIndex !== undefined) {
      const serviceElement = document.getElementById(`service-${serviceIndex}`);
      if (serviceElement) {
        serviceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          setActiveIndex(serviceIndex);
        }, 300);
      }
    }
  };

  return (
    <section id="services" className="py-24 bg-white dark:bg-[#0C0D0D]" itemScope itemType="https://schema.org/Service">
      <div className="container mx-auto px-6 relative z-10">
        <header className="mb-16">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-gray-900 dark:text-white uppercase">
            {t('services.title')} <span className="text-accent-purple">{t('services.titleHighlight')}</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mt-4" itemProp="description">
            {t('services.description')}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {filterTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => handleFilterClick(tag)}
                className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-accent-purple/50 hover:bg-accent-purple/10 transition-all cursor-pointer uppercase text-sm md:text-base"
              >
                {tag}
              </button>
            ))}
          </div>
        </header>

        <div className="border-t border-gray-200 dark:border-gray-800" itemScope itemType="https://schema.org/ItemList">
          {services.map((service, index) => (
            <article 
              key={service.title} 
              id={`service-${index}`}
              className="border-b border-gray-200 dark:border-gray-800 scroll-mt-24" 
              itemScope 
              itemType="https://schema.org/Service"
            >
              <div className="flex justify-between items-center cursor-pointer py-8 group" onClick={() => handleServiceClick(index)}>
                <div className="flex items-center gap-4">
                  <h3 className={`text-3xl md:text-5xl font-bold transition-colors duration-300 ${activeIndex === index ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-600 group-hover:text-gray-800 dark:group-hover:text-gray-400'}`} itemProp="name">
                    {service.title}
                  </h3>
                  {activeIndex === index && (
                    <motion.div
                      className="w-4 h-4 bg-accent-purple rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </div>
                
                <motion.div 
                  className="text-accent-purple" 
                  animate={{ rotate: activeIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Plus size={40} className={`${activeIndex === index ? 'text-accent-purple' : 'text-gray-700 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-400'} transition-colors`} />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pr-16">
                      <p className="text-lg text-gray-700 dark:text-gray-400 max-w-2xl mb-6" itemProp="description">{service.description}</p>
                      {service.points && service.points.length > 0 && (
                        <ul className="space-y-4 mt-6" itemScope itemType="https://schema.org/ItemList">
                          {service.points.map((point, pointIndex) => {
                            const pointTitle = typeof point === 'string' ? point : point.title;
                            const pointDescription = typeof point === 'object' && point.description ? point.description : null;
                            
                            return (
                              <li key={pointIndex} className="flex items-start gap-3" itemScope itemType="https://schema.org/Service">
                                <div className="w-4 h-4 rounded-full bg-accent-purple mt-1 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <span className="text-lg text-gray-800 dark:text-gray-300 font-medium" itemProp="name">{pointTitle}</span>
                                  {pointDescription && (
                                    <p className="text-base text-gray-700 dark:text-gray-400 mt-1" itemProp="description">{pointDescription}</p>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
