import React from 'react';
import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import TrustedClients from '@/components/TrustedClients';
import Services from '@/components/Services';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import Stats from '@/components/Stats';
import SectionBlog from '@/components/SectionBlog';
import CTA from '@/components/CTA';
import SectionAnimator from '@/components/SectionAnimator';

const Home = () => {
  return (
    <>
      <SEO
        title="Diseño UI/UX México | Agencia UX Latinoamérica"
        description="Una de las mejores agencias de diseño UI/UX en México y Latinoamérica. Especializada en diseño de interfaces, auditorías UX, investigación de mercado, arquitectura de información, wireframes, pruebas de usabilidad, user personas, journey mapping, card sorting, pruebas A/B y más servicios de experiencia de usuario."
        keywords="agencias de diseño UI UX, agencias de diseño ui ux, agencia de diseño UI UX, mejores agencias diseño UI UX México, agencias UX Latinoamérica, agencias diseño UI UX México, top agencias UX, agencia de diseño UI/UX, diseño UI/UX, agencia creativa, marketing digital, diseño web, branding, desarrollo web, Latinoamérica, agencia de diseño, consultoría UX, consultoría experiencia de usuario, auditoría UX, auditoría experiencia de usuario, evaluaciones heurísticas, evaluación heurística UX, investigación de mercado, arquitectura de información, wireframes, diseño de interfaces, pruebas de usabilidad, user personas, journey mapping, card sorting, pruebas A/B, focus groups, análisis de competidores, benchmark, diseño responsivo, aplicaciones móviles, accesibilidad web, sistemas de diseño, UX writing, pruebas remotas moderadas, pruebas remotas no moderadas, auditorías de accesibilidad, análisis técnico UX, análisis de rendimiento, análisis de embudo de ventas, entrevistas de usuarios, encuestas usuarios, cuestionarios, análisis de tendencias"
        url="https://rium.com.mx/"
      />
      <Hero />
      <SectionAnimator><TrustedClients /></SectionAnimator>
      <SectionAnimator><Services /></SectionAnimator>
      <About />
      {/* <SectionAnimator><Portfolio /></SectionAnimator> */}
      <SectionAnimator><Testimonials /></SectionAnimator>
      <SectionAnimator><Stats /></SectionAnimator>
      <SectionBlog />
      <SectionAnimator><CTA /></SectionAnimator>
    </>
  );
};

export default Home;