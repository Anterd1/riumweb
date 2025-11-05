import React from 'react';
import { motion } from 'framer-motion';
const About = () => {
  return <section id="about" className="py-24 bg-[#0C0D0D] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          amount: 0.3
        }} transition={{
          duration: 0.8,
          ease: 'easeOut'
        }}>
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img className="w-full h-full object-cover" alt="Modern office with creative team working on computers" src="https://horizons-cdn.hostinger.com/8c7cb7a4-8366-40b2-93de-512196b005b6/charlesdeluvio-lks7vei-eag-unsplash-7Or6F.jpg" loading="lazy" decoding="async" style={{ aspectRatio: '4/3' }} />
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          amount: 0.3
        }} transition={{
          duration: 0.8,
          ease: 'easeOut'
        }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white uppercase">
              Beneficios de invertir en <span className="text-accent-purple">diseño UI/UX</span>
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Mayor conversión y ROI</h3>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Reducción de costos de desarrollo</h3>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Mayor satisfacción y retención de usuarios</h3>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Ventaja competitiva sostenible</h3>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Mejora la imagen de marca</h3>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mt-24">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          amount: 0.3
        }} transition={{
          duration: 0.8,
          ease: 'easeOut'
        }} className="lg:order-last">
            <div className="rounded-2xl overflow-hidden aspect-[4/3]">
              <img className="w-full h-full object-cover" alt="Diverse team collaborating around a table with laptops and notes" src="https://horizons-cdn.hostinger.com/8c7cb7a4-8366-40b2-93de-512196b005b6/michael-t-rxri-ho62y4-unsplash-2-tvxRc.jpg" loading="lazy" decoding="async" style={{ aspectRatio: '4/3' }} />
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          amount: 0.3
        }} transition={{
          duration: 0.8,
          ease: 'easeOut'
        }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white uppercase">
              Your vision, our <span className="text-accent-purple">expertise</span>
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Strategy & Discovery</h3>
                <p className="text-lg text-gray-400">We start by deeply understanding your brand, audience, and goals to build a comprehensive roadmap for success.</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Creative Execution</h3>
                <p className="text-lg text-gray-400">Our team brings ideas to life with precision and creativity, refining every detail through a collaborative feedback loop.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default About;