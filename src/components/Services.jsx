import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react'; // Changed import from ArrowRight, ArrowDownRight to Plus

const services = [{
  title: 'Diseño UI/UX',
  description: 'Creamos experiencias de usuario excepcionales que combinan diseño intuitivo con funcionalidad estratégica, centrándonos en la usabilidad y la satisfacción del usuario.',
  points: [
    { title: 'Arquitectura de la información', description: 'Organizamos el contenido para una navegación intuitiva.' },
    { title: 'Diseño de Wireframes', description: 'Esquematizamos pantallas para definir estructura y funcionalidad.' },
    { title: 'Diseño de interfaz de usuario (UI)', description: 'Creamos elementos visuales atractivos y funcionales.' },
    { title: 'Diseño de interacciones', description: 'Definimos cómo los usuarios interactúan con la interfaz.' },
    { title: 'Diseño responsivo', description: 'Adaptamos el diseño a distintos dispositivos y resoluciones.' },
    { title: 'Diseño de aplicaciones móviles', description: 'Creamos experiencias optimizadas para móviles.' },
    { title: 'Diseño web', description: 'Diseñamos interfaces modernas y efectivas para sitios web.' },
    { title: 'Accesibilidad', description: 'Garantizamos que el producto sea usable por todas las personas.' },
    { title: 'Creación de sistemas de diseño', description: 'Unificamos estilos, componentes y reglas visuales en una guía.' },
    { title: 'Diseño gráfico', description: 'Trabajamos el aspecto visual para lograr impacto y coherencia.' },
    { title: 'UX Writing', description: 'Obtenemos información directa sobre necesidades y expectativas.' }
  ]
}, {
  title: 'Auditorías UX',
  description: 'Realizamos evaluaciones exhaustivas de experiencia de usuario para identificar oportunidades de mejora y optimizar la usabilidad de tus productos digitales.',
  points: [
    { title: 'Evaluación heurística', description: 'Analizamos la interfaz según principios de usabilidad.' },
    { title: 'Pruebas de usabilidad', description: 'Evaluamos qué tan fácil es usar tu producto.' },
    { title: 'Card Sorting', description: 'Organizamos contenido según la lógica de los usuarios.' },
    { title: 'Pruebas remotas moderadas', description: 'Guiamos sesiones remotas para observar tareas específicas.' },
    { title: 'Pruebas remotas no moderadas', description: 'Observamos cómo los usuarios interactúan sin guía.' },
    { title: 'Pruebas A/B', description: 'Comparamos variantes para elegir la más efectiva.' },
    { title: 'Encuestas a usuarios', description: 'Recogemos opiniones y percepciones directamente.' },
    { title: 'Auditorías de accesibilidad', description: 'Verificamos el cumplimiento con estándares de accesibilidad.' },
    { title: 'Análisis técnico (Evaluación de código)', description: 'Revisamos el código desde la perspectiva UX.' },
    { title: 'Análisis de rendimiento (performance)', description: 'Evaluamos velocidad y respuesta para mejorar la experiencia.' },
    { title: 'Análisis del embudo de ventas', description: 'Detectamos puntos críticos en la conversión de usuarios.' }
  ]
}, {
  title: 'Investigación de mercado',
  description: 'Realizamos estudios profundos para entender a tu audiencia, competencia y tendencias del mercado, proporcionando insights valiosos para la toma de decisiones estratégicas.',
  points: [
    { title: 'Entrevistas de usuarios', description: 'Obtenemos información directa sobre necesidades y expectativas.' },
    { title: 'Encuestas y cuestionarios', description: 'Recogemos datos cuantitativos y cualitativos a gran escala.' },
    { title: 'Benchmark y análisis de competidores', description: 'Comparamos tu producto con otros del mercado para detectar oportunidades.' },
    { title: 'Análisis de tendencias', description: 'Identificamos comportamientos emergentes en tu industria.' },
    { title: 'Focus Groups', description: 'Exploramos percepciones y opiniones en sesiones grupales.' },
    { title: 'Desarrollo de User Personas', description: 'Creamos perfiles que representan a tus usuarios clave.' },
    { title: 'Mapeo del User Journey Map', description: 'Visualizamos la experiencia completa del usuario con tu producto.' }
  ]
}, {
  title: 'SEO/SEM',
  description: 'Optimización estratégica y campañas de búsqueda pagada que generan tráfico calificado y mejoran tu visibilidad en los motores de búsqueda.',
  points: [
    { title: 'Auditoría SEO técnica', description: 'Analizamos la estructura técnica de tu sitio para identificar problemas que afectan el posicionamiento.' },
    { title: 'Investigación de palabras clave', description: 'Identificamos las palabras clave más relevantes para tu negocio y audiencia objetivo.' },
    { title: 'Optimización On-Page', description: 'Mejoramos títulos, meta descripciones, encabezados y contenido para maximizar el SEO.' },
    { title: 'Optimización Off-Page', description: 'Desarrollamos estrategias de link building y presencia en línea para mejorar la autoridad del dominio.' },
    { title: 'Optimización de contenido', description: 'Creamos y optimizamos contenido relevante y valioso que atrae tráfico orgánico.' },
    { title: 'SEO local', description: 'Mejoramos tu visibilidad en búsquedas locales para atraer clientes en tu área geográfica.' },
    { title: 'Campañas Google Ads', description: 'Gestionamos campañas de búsqueda pagada para obtener resultados inmediatos y medibles.' },
    { title: 'Campañas de Display', description: 'Creamos campañas visuales en la red de display de Google para aumentar el reconocimiento de marca.' },
    { title: 'Remarketing y Retargeting', description: 'Reconectamos con visitantes anteriores para aumentar las conversiones.' },
    { title: 'Análisis y reportes SEO', description: 'Monitoreamos métricas clave y generamos reportes detallados del rendimiento SEO.' },
    { title: 'Optimización de velocidad', description: 'Mejoramos la velocidad de carga del sitio, factor clave para el SEO y la experiencia del usuario.' },
    { title: 'SEO para e-commerce', description: 'Estrategias especializadas para tiendas en línea y optimización de páginas de producto.' }
  ]
}, {
  title: 'Diseño Web',
  description: 'Sitios web hermosos y centrados en el usuario que convierten visitantes en clientes, optimizados para rendimiento y conversión.',
  points: [
    { title: 'Diseño responsive', description: 'Sitios que se adaptan perfectamente a todos los dispositivos: móviles, tablets y desktop.' },
    { title: 'Diseño de landing pages', description: 'Páginas optimizadas para conversión que guían a los visitantes hacia acciones específicas.' },
    { title: 'Diseño de e-commerce', description: 'Tiendas en línea intuitivas y optimizadas para ventas con experiencia de compra fluida.' },
    { title: 'Diseño de portales corporativos', description: 'Sitios web profesionales que reflejan la identidad y valores de tu empresa.' },
    { title: 'Optimización de conversión (CRO)', description: 'Mejoramos elementos de diseño para aumentar las tasas de conversión y ROI.' },
    { title: 'Integración de sistemas', description: 'Conectamos tu sitio web con CRM, sistemas de pago, inventario y otras herramientas.' },
    { title: 'Diseño de dashboards', description: 'Interfaces administrativas intuitivas para gestionar contenido y datos de tu sitio.' },
    { title: 'Migración y rediseño', description: 'Modernizamos sitios existentes mejorando diseño, funcionalidad y rendimiento.' },
    { title: 'Optimización de rendimiento', description: 'Aceleramos la carga de páginas para mejorar la experiencia del usuario y SEO.' },
    { title: 'Diseño accesible', description: 'Garantizamos que tu sitio sea accesible para todos los usuarios, cumpliendo estándares WCAG.' },
    { title: 'Prototipado y wireframing', description: 'Creamos prototipos interactivos antes del desarrollo para validar conceptos.' },
    { title: 'Mantenimiento y soporte', description: 'Ofrecemos mantenimiento continuo, actualizaciones y soporte técnico para tu sitio web.' }
  ]
}, {
  title: 'Retail Marketing',
  description: 'Estrategias de marketing digital especializadas para el sector retail que impulsan ventas, fidelización de clientes y crecimiento de tu negocio físico y online.',
  points: [
    { title: 'Estrategia omnicanal', description: 'Integramos todos tus canales de venta (físico, online, móvil) para una experiencia unificada del cliente.' },
    { title: 'Marketing en punto de venta', description: 'Diseñamos estrategias y materiales para aumentar ventas y engagement en tiendas físicas.' },
    { title: 'Programas de fidelización', description: 'Creamos sistemas de recompensas y membresías que aumentan la retención y el valor del cliente.' },
    { title: 'Email marketing para retail', description: 'Campañas segmentadas para promociones, nuevos productos, carritos abandonados y reactivación.' },
    { title: 'Marketing de temporada', description: 'Estrategias especializadas para temporadas altas como Black Friday, Navidad, Día de las Madres, etc.' },
    { title: 'Gestión de catálogos digitales', description: 'Creamos y optimizamos catálogos digitales atractivos que facilitan la decisión de compra.' },
    { title: 'Marketing de proximidad', description: 'Estrategias de geolocalización y marketing basado en ubicación para atraer clientes cercanos.' },
    { title: 'Análisis de comportamiento del cliente', description: 'Estudiamos patrones de compra y comportamiento para personalizar experiencias y ofertas.' },
    { title: 'Estrategias de pricing dinámico', description: 'Optimizamos precios y promociones basados en datos de mercado y comportamiento del cliente.' },
    { title: 'Marketing de influencers para retail', description: 'Colaboraciones estratégicas con influencers para promocionar productos y aumentar visibilidad.' },
    { title: 'Eventos y activaciones en tienda', description: 'Diseñamos y ejecutamos eventos, lanzamientos y activaciones que generan tráfico y ventas.' },
    { title: 'Marketing de contenido para retail', description: 'Creamos contenido relevante (guías, tutoriales, lookbooks) que inspira y educa a tus clientes.' }
  ]
}];

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleServiceClick = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filterTags = ['Design', 'Development', 'Digital Marketing', 'SEO'];

  return (
    <section id="services" className="py-24 bg-[#0C0D0D]" itemScope itemType="https://schema.org/Service">
      <div className="container mx-auto px-6 relative z-10">
        <header className="mb-16">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white uppercase">
            Nuestros <span className="text-accent-purple">Servicios</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mt-4" itemProp="description">
            Especialistas en diseño UI/UX, auditorías de experiencia de usuario, investigación de mercado y consultoría UX. Ofrecemos servicios completos de diseño de interfaces, pruebas de usabilidad, arquitectura de información, wireframes, user personas, journey mapping y más para empresas en México y Latinoamérica.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {filterTags.map(tag => (
              <button key={tag} className="px-5 py-2 border border-gray-600 rounded-full text-gray-400 cursor-default uppercase">
                {tag === 'Design' ? 'Diseño' : tag === 'Development' ? 'Desarrollo' : tag === 'Digital Marketing' ? 'Marketing Digital' : tag === 'SEO' ? 'SEO' : tag}
              </button>
            ))}
          </div>
        </header>

        <div className="border-t border-gray-800" itemScope itemType="https://schema.org/ItemList">
          {services.map((service, index) => (
            <article key={service.title} className="border-b border-gray-800" itemScope itemType="https://schema.org/Service">
              <div className="flex justify-between items-center cursor-pointer py-8 group" onClick={() => handleServiceClick(index)}>
                <div className="flex items-center gap-4">
                  <h3 className={`text-3xl md:text-5xl font-bold transition-colors duration-300 ${activeIndex === index ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`} itemProp="name">
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
                  animate={{ rotate: activeIndex === index ? 45 : 0 }} // Rotate Plus for open state
                  transition={{ duration: 0.3 }}
                >
                  <Plus size={40} className={`${activeIndex === index ? 'text-accent-purple' : 'text-gray-600 group-hover:text-gray-400'} transition-colors`} />
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
                      <p className="text-lg text-gray-400 max-w-2xl mb-6" itemProp="description">{service.description}</p>
                      {service.points && service.points.length > 0 && (
                        <ul className="space-y-4 mt-6" itemScope itemType="https://schema.org/ItemList">
                          {service.points.map((point, pointIndex) => {
                            const pointTitle = typeof point === 'string' ? point : point.title;
                            const pointDescription = typeof point === 'object' && point.description ? point.description : null;
                            
                            return (
                              <li key={pointIndex} className="flex items-start gap-3" itemScope itemType="https://schema.org/Service">
                                <div className="w-4 h-4 rounded-full bg-accent-purple mt-1 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <span className="text-lg text-gray-300 font-medium" itemProp="name">{pointTitle}</span>
                                  {pointDescription && (
                                    <p className="text-base text-gray-400 mt-1" itemProp="description">{pointDescription}</p>
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