import React from 'react';
import { motion } from 'framer-motion';

const clientLogos = [
  { name: 'BBVA', description: 'Placeholder for InnovateCore' },
  { name: 'Grupo Salinas', description: 'Placeholder for QuantumLeap' },
  { name: 'Televisa N+', description: 'Placeholder for AuraFlow' },
  { name: 'Expansive', description: 'Placeholder for NexusGen' },
  { name: 'SegurosGCP', description: 'Placeholder for SparkSolutions' },
  { name: 'LaPuerta De Quetzalcoatl', description: 'Placeholder for VortexLabs' },
  { name: 'Harinas Elizondo ', description: 'Placeholder for EchoBridge' },
  { name: 'Fundación Dondé', description: 'Placeholder for ZenithWorks' },
];

const marqueeLogos = [...clientLogos, ...clientLogos]; // Duplicate for seamless loop

const TrustedClients = () => {
  const marqueeVariants = {
    animate: {
      x: [0, -2016], // Adjust as needed based on actual width
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 30, // Adjusted for smoother loop with text
          ease: 'linear'
        }
      }
    }
  };

  return (
    <section className="py-20 bg-[#0C0D0D] border-t border-b border-[#1E1E2A] overflow-hidden">
      <div className="container mx-auto px-6 text-center">
        <p className="text-lg text-gray-400 mb-12 uppercase">Hemos trabajado con más de 13 empresas en todo latinoamerica</p>
        <div className="relative w-full">
          <motion.div className="flex" variants={marqueeVariants} animate="animate">
            {marqueeLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-48 mx-12 flex justify-center items-center">
                <span className="text-white text-2xl md:text-3xl font-semibold opacity-70">
                  {logo.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustedClients;