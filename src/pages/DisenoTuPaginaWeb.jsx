import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import SectionAnimator from '@/components/SectionAnimator';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Palette, Smartphone, Zap, Users, TrendingUp } from 'lucide-react';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const DisenoTuPaginaWeb = () => {
  const navigate = useNavigate();
  const getLocalizedLink = useLocalizedLink();

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
          <section className="pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight uppercase"
              >
                Diseña tu <span className="text-accent-purple">Página Web</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
              >
                Creamos páginas web profesionales que convierten visitantes en clientes. 
                Diseño moderno, responsivo y optimizado para resultados.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  onClick={() => navigate(getLocalizedLink('/contact'))}
                  size="lg"
                  className="bg-accent-purple hover:bg-accent-purple/90 text-white font-bold px-8 py-6 text-lg rounded-full group"
                >
                  Solicitar Cotización
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => navigate(getLocalizedLink('/#services'))}
                  size="lg"
                  variant="outline"
                  className="border-2 border-accent-purple/40 hover:bg-accent-purple/10 text-white px-8 py-6 text-lg rounded-full"
                >
                  Ver Servicios
                </Button>
              </motion.div>
            </div>
          </section>
        </SectionAnimator>

        {/* Benefits Section */}
        <SectionAnimator>
          <section className="py-24 px-6">
            <div className="container mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 uppercase">
                ¿Por qué elegirnos para <span className="text-accent-purple">diseñar tu página web?</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#1E1E2A] p-8 rounded-2xl border border-white/10"
                  >
                    <div className="text-accent-purple mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimator>

        {/* Process Section */}
        <SectionAnimator>
          <section className="py-24 px-6 bg-[#1E1E2A]/50">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 uppercase">
                Nuestro <span className="text-accent-purple">Proceso</span>
              </h2>
              <div className="space-y-8">
                {process.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-6 items-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple font-bold text-xl">
                        {item.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-lg">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimator>

        {/* Services Included */}
        <SectionAnimator>
          <section className="py-24 px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 uppercase">
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
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-accent-purple flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimator>

        {/* CTA Section */}
        <SectionAnimator>
          <section className="py-24 px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-accent-purple/20 to-accent-purple/10 rounded-3xl p-12 border border-accent-purple/30"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  ¿Listo para diseñar tu página web?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Contáctanos hoy y recibe una cotización personalizada para tu proyecto.
                </p>
                <Button
                  onClick={() => navigate(getLocalizedLink('/contact'))}
                  size="lg"
                  className="bg-accent-purple hover:bg-accent-purple/90 text-white font-bold px-8 py-6 text-lg rounded-full group"
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

