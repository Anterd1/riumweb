import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import SectionAnimator from '@/components/SectionAnimator';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Palette, Smartphone, Zap, Users, TrendingUp } from 'lucide-react';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const DisenoTuPaginaWeb = () => {
  const navigate = useNavigate();
  const getLocalizedLink = useLocalizedLink();
  const shouldReduceMotion = useReducedMotion();

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Experiencia de Usuario Excepcional',
      description: 'Diseñamos páginas web centradas en tus usuarios, garantizando una experiencia intuitiva y satisfactoria que aumenta la conversión.'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Diseño Responsivo',
      description: 'Tu página web se verá perfecta en todos los dispositivos: móviles, tablets y escritorio, maximizando tu alcance.'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Optimización de Rendimiento',
      description: 'Páginas web rápidas y eficientes que mejoran el SEO y reducen la tasa de rebote, aumentando tus conversiones.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Conversión Optimizada',
      description: 'Cada elemento está diseñado estratégicamente para guiar a tus visitantes hacia la acción que deseas: contacto, compra o registro.'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'Diseño Moderno y Profesional',
      description: 'Interfaces visualmente atractivas que reflejan la identidad de tu marca y generan confianza en tus visitantes.'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Análisis y Estrategia',
      description: 'Entendemos tu negocio, audiencia y objetivos para crear una estrategia de diseño personalizada.'
    },
    {
      step: '02',
      title: 'Diseño y Prototipado',
      description: 'Creamos wireframes y prototipos interactivos que validamos contigo antes del desarrollo.'
    },
    {
      step: '03',
      title: 'Desarrollo y Optimización',
      description: 'Desarrollamos tu página web con las mejores prácticas de UX/UI, SEO y rendimiento.'
    },
    {
      step: '04',
      title: 'Lanzamiento y Soporte',
      description: 'Lanzamos tu página web y te brindamos soporte continuo para asegurar su éxito.'
    }
  ];

  return (
    <>
      <SEO
        title="Diseño de Páginas Web Profesionales | rium"
        description="Diseñamos páginas web modernas, responsivas y optimizadas para conversión. Especialistas en diseño UI/UX que transforman visitantes en clientes. Servicios de diseño web en México y Latinoamérica."
        keywords="diseño de páginas web, diseño web profesional, diseño web México, agencia diseño web, diseño web responsivo, diseño web UX, diseño web UI, crear página web, diseño sitio web, agencia diseño web México, diseño web Latinoamérica"
        url="https://rium.com.mx/diseno-tu-pagina-web"
      />
      
      <div className="min-h-screen bg-[#0C0D0D] text-white">
        {/* Hero Section */}
        <SectionAnimator>
          <section className="px-4 pb-14 pt-24 sm:px-6 sm:pb-16 sm:pt-28 md:pb-20 md:pt-32">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
                className="mb-5 break-words text-[clamp(2.5rem,13vw,4rem)] font-bold uppercase leading-[.98] sm:mb-6 md:text-7xl lg:text-8xl"
              >
                Diseña tu <span className="text-accent-purple">Página Web</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.5 }}
                className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-gray-300 sm:mb-10 sm:text-xl md:mb-12 md:text-2xl"
              >
                Creamos páginas web profesionales que convierten visitantes en clientes. 
                Diseño moderno, responsivo y optimizado para resultados.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => navigate(getLocalizedLink('/contact'))}
                  size="lg"
                  className="group min-h-12 w-full rounded-full bg-accent-purple px-6 py-5 text-base font-bold text-white active:scale-[.98] motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-6 sm:text-lg md:hover:bg-accent-purple/90"
                >
                  Solicitar Cotización
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => navigate(getLocalizedLink('/#services'))}
                  size="lg"
                  variant="outline"
                  className="min-h-12 w-full rounded-full border-2 border-accent-purple/40 px-6 py-5 text-base text-white active:scale-[.98] motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-6 sm:text-lg md:hover:bg-accent-purple/10"
                >
                  Ver Servicios
                </Button>
              </motion.div>
            </div>
          </section>
        </SectionAnimator>

        {/* Benefits Section */}
        <SectionAnimator>
          <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-24">
            <div className="container mx-auto">
              <h2 className="mb-10 break-words text-center text-[clamp(2rem,10vw,3rem)] font-bold uppercase leading-[1.05] sm:mb-12 md:mb-16 md:text-5xl lg:text-6xl">
                ¿Por qué elegirnos para <span className="text-accent-purple">diseñar tu página web?</span>
              </h2>
              <div className="grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.1, duration: shouldReduceMotion ? 0 : 0.4 }}
                    className="rounded-2xl border border-white/10 bg-[#1E1E2A] p-5 transition-transform active:scale-[.99] motion-reduce:transition-none sm:p-6 md:p-8"
                  >
                    <div className="text-accent-purple mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimator>

        {/* Process Section */}
        <SectionAnimator>
          <section className="bg-[#1E1E2A]/50 px-4 py-16 sm:px-6 sm:py-20 md:py-24">
            <div className="container mx-auto max-w-5xl">
              <h2 className="mb-10 text-center text-[clamp(2rem,10vw,3rem)] font-bold uppercase sm:mb-12 md:mb-16 md:text-5xl lg:text-6xl">
                Nuestro <span className="text-accent-purple">Proceso</span>
              </h2>
              <div className="space-y-8">
                {process.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.2, duration: shouldReduceMotion ? 0 : 0.4 }}
                    className="flex items-start gap-4 sm:gap-6"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-purple/20 text-base font-bold text-accent-purple sm:h-16 sm:w-16 sm:text-xl">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-xl font-bold sm:text-2xl">{item.title}</h3>
                      <p className="text-base leading-relaxed text-gray-400 sm:text-lg">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimator>

        {/* Services Included */}
        <SectionAnimator>
          <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className="mb-10 text-center text-[clamp(2rem,10vw,3rem)] font-bold uppercase sm:mb-12 md:mb-16 md:text-5xl lg:text-6xl">
                Incluido en tu <span className="text-accent-purple">Diseño Web</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Diseño UI/UX profesional',
                  'Diseño responsivo (móvil, tablet, desktop)',
                  'Optimización SEO básica',
                  'Optimización de velocidad y rendimiento',
                  'Integración de formularios de contacto',
                  'Sistema de gestión de contenido (CMS)',
                  'Certificado SSL incluido',
                  'Hosting y dominio (opcional)',
                  'Capacitación para administrar tu sitio',
                  'Soporte técnico post-lanzamiento'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: shouldReduceMotion ? 0 : index * 0.1, duration: shouldReduceMotion ? 0 : 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-accent-purple flex-shrink-0" />
                    <span className="text-base leading-snug text-gray-300 sm:text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimator>

        {/* CTA Section */}
        <SectionAnimator>
          <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-24">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                className="rounded-3xl border border-accent-purple/30 bg-gradient-to-r from-accent-purple/20 to-accent-purple/10 p-5 sm:p-8 md:p-12"
              >
                <h2 className="mb-4 text-2xl font-bold sm:text-4xl md:mb-6 md:text-5xl">
                  ¿Listo para diseñar tu página web?
                </h2>
                <p className="mb-6 text-base leading-relaxed text-gray-300 sm:mb-8 sm:text-xl">
                  Contáctanos hoy y recibe una cotización personalizada para tu proyecto.
                </p>
                <Button
                  onClick={() => {
                    // Rastrear clic en CTA
                    if (window.gtag && typeof window.gtag === 'function') {
                      window.gtag('event', 'cta_click', {
                        event_category: 'Engagement',
                        event_label: 'Solicitar Cotización Gratuita - Bottom',
                        location: 'DisenoTuPaginaWeb'
                      });
                    }
                    navigate(getLocalizedLink('/contact'));
                  }}
                  size="lg"
                  className="group min-h-12 w-full whitespace-normal rounded-full bg-accent-purple px-5 py-5 text-base font-bold text-white active:scale-[.98] motion-reduce:transition-none sm:w-auto sm:px-8 sm:py-6 sm:text-lg md:hover:bg-accent-purple/90"
                >
                  Solicitar Cotización Gratuita
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </section>
        </SectionAnimator>
      </div>
    </>
  );
};

export default DisenoTuPaginaWeb;

