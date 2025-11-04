import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const SEO = ({
  title,
  description,
  keywords,
  image = '/images/HERO.png',
  type = 'website',
  url,
  siteName = 'rium - Agencia Creativa',
}) => {
  const location = useLocation();
  const currentUrl = url || `https://rium.com${location.pathname}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://rium.com${image}`;

  // Structured Data (JSON-LD) - Organization
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: 'https://rium.com',
    logo: 'https://rium.com/images/HERO.png',
    description: 'Agencia de diseño UI/UX en Latinoamérica especializada en diseño de interfaces, auditorías UX, investigación de mercado, arquitectura de información, wireframes, pruebas de usabilidad, user personas, journey mapping, card sorting, pruebas A/B, focus groups, análisis de competidores y más servicios de experiencia de usuario.',
    sameAs: [
      'https://github.com',
      'https://twitter.com',
      'https://linkedin.com',
      'https://instagram.com',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      email: 'hello@agency.com',
    },
  };

  // Structured Data for WebPage
  const webpageData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: currentUrl,
    inLanguage: 'es-ES',
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: 'https://rium.com',
    },
  };

  // Structured Data for Services (if on homepage)
  const servicesData = location.pathname === '/' ? {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Diseño UI/UX y Experiencia de Usuario',
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: 'https://rium.com',
    },
    areaServed: 'Latinoamérica',
    description: 'Servicios de diseño UI/UX, auditorías UX, investigación de mercado, arquitectura de información, wireframes, pruebas de usabilidad, user personas, journey mapping y más.',
    offers: {
      '@type': 'Offer',
      itemOffered: [
        'Diseño UI/UX',
        'Auditorías UX',
        'Investigación de mercado',
        'Arquitectura de información',
        'Wireframes',
        'Pruebas de usabilidad',
        'User Personas',
        'Journey Mapping',
        'Card Sorting',
        'Pruebas A/B',
        'Focus Groups',
        'Análisis de competidores',
        'Diseño responsivo',
        'Aplicaciones móviles',
        'Accesibilidad web',
        'Sistemas de diseño',
        'UX Writing',
        'Evaluación heurística',
      ],
    },
  } : null;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="es" />
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={siteName} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#0C0D0D" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(webpageData)}
      </script>
      {servicesData && (
        <script type="application/ld+json">
          {JSON.stringify(servicesData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

