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
  description: 'Optimización estratégica y campañas de búsqueda pagada que generan tráfico calificado.'
}, {
  title: 'Creación de Contenido',
  description: 'Narrativa convincente a través de video, fotografía y contenido escrito.'
}, {
  title: 'Diseño Web',
  description: 'Sitios web hermosos y centrados en el usuario que convierten visitantes en clientes.'
}];

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleServiceClick = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filterTags = ['Design', 'Development', 'Digital Marketing', 'SEO'];

  return (
    <section id="services" className="py-24 bg-[#0C0D0D]">
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white uppercase">
            Nuestros <span className="text-accent-purple">Servicios</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mt-4">Explora el mundo a través de nuestras capacidades visuales y encuentra lo que amas.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            {filterTags.map(tag => (
              <button key={tag} className="px-5 py-2 border border-gray-600 rounded-full text-gray-400 cursor-default uppercase">
                {tag === 'Design' ? 'Diseño' : tag === 'Development' ? 'Desarrollo' : tag === 'Digital Marketing' ? 'Marketing Digital' : tag === 'SEO' ? 'SEO' : tag}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800">
          {services.map((service, index) => (
            <div key={service.title} className="border-b border-gray-800">
              <div className="flex justify-between items-center cursor-pointer py-8 group" onClick={() => handleServiceClick(index)}>
                <div className="flex items-center gap-4">
                  <h3 className={`text-3xl md:text-5xl font-bold transition-colors duration-300 ${activeIndex === index ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
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
                      <p className="text-lg text-gray-400 max-w-2xl mb-6">{service.description}</p>
                      {service.points && service.points.length > 0 && (
                        <ul className="space-y-4 mt-6">
                          {service.points.map((point, pointIndex) => {
                            const pointTitle = typeof point === 'string' ? point : point.title;
                            const pointDescription = typeof point === 'object' && point.description ? point.description : null;
                            
                            return (
                              <li key={pointIndex} className="flex items-start gap-3">
                                <div className="w-4 h-4 rounded-full bg-accent-purple mt-1 flex-shrink-0"></div>
                                <div className="flex-1">
                                  <span className="text-lg text-gray-300 font-medium">{pointTitle}</span>
                                  {pointDescription && (
                                    <p className="text-base text-gray-400 mt-1">{pointDescription}</p>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;