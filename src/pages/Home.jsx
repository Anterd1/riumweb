import React from 'react';
import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import TrustedClients from '@/components/TrustedClients';
import Services from '@/components/Services';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Stats from '@/components/Stats';
import CTA from '@/components/CTA';
import SectionAnimator from '@/components/SectionAnimator';

const Home = () => {
  return (
    <>
      <SEO
        title="Inicio"
        description="Agencia de diseño UI/UX en Latinoamérica especializada en marketing digital, estrategia de marca y soluciones creativas que generan resultados. Transforma tu marca con nosotros."
        keywords="diseño UI/UX, agencia creativa, marketing digital, diseño web, branding, desarrollo web, Latinoamérica, agencia de diseño"
        url="https://rium.com/"
      />
      <Hero />
      <SectionAnimator><TrustedClients /></SectionAnimator>
      <SectionAnimator><Services /></SectionAnimator>
      <About />
      <SectionAnimator><Portfolio /></SectionAnimator>
      <SectionAnimator><Testimonials /></SectionAnimator>
      <SectionAnimator><Stats /></SectionAnimator>
      <SectionAnimator><CTA /></SectionAnimator>
    </>
  );
};

export default Home;