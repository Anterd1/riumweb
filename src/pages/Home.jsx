import React, { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import SectionAnimator from '@/components/SectionAnimator';
import DeferredSection from '@/components/DeferredSection';

const AgenticDigitalization = lazy(() => import('@/components/AgenticDigitalization'));
const SelectedWork = lazy(() => import('@/components/SelectedWork'));
const Stats = lazy(() => import('@/components/Stats'));
const TrustedClients = lazy(() => import('@/components/TrustedClients'));
const About = lazy(() => import('@/components/About'));
const SectionBlog = lazy(() => import('@/components/SectionBlog'));
const CTA = lazy(() => import('@/components/CTA'));

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
      <SectionAnimator><Services /></SectionAnimator>
      <DeferredSection minHeight={820} tone="dark">
        <AgenticDigitalization />
      </DeferredSection>
      <DeferredSection minHeight={820} tone="paper">
        <SelectedWork />
      </DeferredSection>
      <DeferredSection minHeight={620} tone="dark">
        <SectionAnimator><Stats /></SectionAnimator>
      </DeferredSection>
      <DeferredSection minHeight={680} tone="paper">
        <SectionAnimator><TrustedClients /></SectionAnimator>
      </DeferredSection>
      <DeferredSection minHeight={760} tone="dark">
        <SectionAnimator><About /></SectionAnimator>
      </DeferredSection>
      <DeferredSection minHeight={780} tone="paper">
        <SectionBlog />
      </DeferredSection>
      <DeferredSection minHeight={560} tone="acid">
        <SectionAnimator><CTA /></SectionAnimator>
      </DeferredSection>
    </>
  );
};

export default Home;