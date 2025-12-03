import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.home.keywords')}
        url="https://rium.com.mx/"
      />
      <Hero />
      <SectionAnimator><TrustedClients /></SectionAnimator>
      <SectionAnimator><Services /></SectionAnimator>
      <About />
      {/* <SectionAnimator><Portfolio /></SectionAnimator> */}
      {/* <SectionAnimator><Testimonials /></SectionAnimator> */}
      <SectionAnimator><Stats /></SectionAnimator>
      <SectionBlog />
      <SectionAnimator><CTA /></SectionAnimator>
    </>
  );
};

export default Home;