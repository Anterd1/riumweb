import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion, useReducedMotion } from 'framer-motion';
import Stats from '@/components/Stats';
import SectionAnimator from '@/components/SectionAnimator';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

// Mock data for projects
const projectData = {
  'social-media-app': {
    title: 'Next-Gen Banking UI',
    category: 'Web & App Design',
    description: 'A revolutionary banking interface designed for simplicity, security, and a seamless user experience. It empowers users with intuitive financial management tools, all within a stunning, modern design.',
    challenge: 'The primary challenge was to demystify complex banking operations. We needed to create a dashboard that was both powerful for seasoned users and approachable for beginners, all while ensuring bank-grade security and flawless performance across all devices.',
    solution: 'We developed a modular, widget-based dashboard allowing for deep personalization. By leveraging cutting-edge data visualization, we transformed complex transaction histories and investment data into beautiful, interactive charts. The implementation of biometric authentication and end-to-end encryption guarantees user data is always secure.',
    images: {
      hero: {
        alt: 'Main dashboard of a modern banking application',
        key: 'banking application dashboard view'
      },
      gallery: [{
        alt: 'Detailed view of a transaction history page',
        key: 'banking app transaction history detail'
      }, {
        alt: 'Analytics dashboard showing spending habits',
        key: 'banking app spending analytics'
      }, {
        alt: 'Close-up of banking app UI elements',
        key: 'banking app ui elements close up'
      }],
      gallery2: [{
        alt: 'User setting up a new payment on the banking app',
        key: 'user making payment on banking app'
      }, {
        alt: 'Security features page on the banking app',
        key: 'banking app security features'
      }]
    },
    stats: [{
      value: 50,
      suffix: '%',
      label: 'Faster Onboarding',
      description: 'Streamlined user registration process.'
    }, {
      value: 2,
      suffix: 'M+',
      label: 'Transactions Processed',
      description: 'Securely handled within the first year.'
    }, {
      value: 4.9,
      suffix: '/5',
      label: 'User Rating',
      description: 'Overwhelmingly positive feedback on app stores.'
    }, {
      value: 99.9,
      suffix: '%',
      label: 'Service Uptime',
      description: 'Uninterrupted access to banking services.'
    }]
  },
  'fintech-dashboard': {
    title: 'Fintech Dashboard',
    category: 'Web & App Design',
    description: 'A comprehensive fintech dashboard designed for clarity and efficiency. It provides users with a detailed overview of their finances, payment histories, and investment portfolios, all wrapped in a secure and user-friendly design.',
    challenge: 'The main goal was to simplify complex financial data into an easily digestible format without sacrificing functionality. Security was paramount, requiring multi-layered protection and compliance with financial regulations while maintaining a fast, responsive user interface.',
    solution: 'We designed a modular dashboard with customizable widgets, allowing users to prioritize the information that matters most to them. By integrating advanced data visualization libraries, we transformed dense datasets into interactive charts and graphs. End-to-end encryption and biometric authentication were implemented to ensure top-tier security.',
    images: {
      hero: {
        alt: 'Main dashboard of a fintech application',
        key: 'fintech application dashboard view'
      },
      gallery: [{
        alt: 'A user analyzing stock market data on the fintech platform',
        key: 'user analyzing stock data on fintech platform'
      }, {
        alt: 'Mobile version of the fintech app showing a transaction summary',
        key: 'fintech app mobile transaction summary'
      }, {
        alt: 'Close-up on a pie chart showing portfolio distribution',
        key: 'fintech app portfolio pie chart'
      }],
      gallery2: [{
        alt: 'Card management screen on the fintech app',
        key: 'fintech app card management screen'
      }, {
        alt: 'Security settings page on the fintech dashboard',
        key: 'fintech dashboard security settings page'
      }]
    },
    stats: [{
      value: 40,
      suffix: '%',
      label: 'Faster Transactions',
      description: 'Optimized payment processing flows.'
    }, {
      value: 99.9,
      suffix: '%',
      label: 'Uptime',
      description: 'Ensuring reliable access to financial data.'
    }, {
      value: 500,
      suffix: 'K+',
      label: 'Active Users',
      description: 'Growing user base relying on the platform daily.'
    }, {
      value: 90,
      suffix: '%',
      label: 'Positive Feedback',
      description: 'Users praising the intuitive and clean UI.'
    }]
  },
  'digital-marketing-agency-site': {
    title: 'Digital Marketing Agency Site',
    category: 'Web Development',
    description: 'A cutting-edge website for a digital marketing agency, designed to convert visitors into leads. The site showcases their services, portfolio, and expertise through a dynamic and engaging user experience.',
    challenge: 'The challenge was to stand out in a crowded market. The website needed to be visually stunning, incredibly fast, and optimized for search engines to rank high for competitive keywords, all while clearly communicating the agency\'s value proposition.',
    solution: 'We built a statically generated site for unparalleled performance and SEO. Interactive case studies and a dynamic service calculator were developed to engage users and provide immediate value. A/B testing on call-to-action buttons and headlines led to a significant increase in conversion rates.',
    images: {
      hero: {
        alt: 'Homepage of a digital marketing agency website',
        key: 'digital marketing agency website homepage'
      },
      gallery: [{
        alt: 'Portfolio section of the marketing agency site',
        key: 'marketing agency portfolio section'
      }, {
        alt: 'Contact form and map on the marketing agency site',
        key: 'marketing agency contact form'
      }, {
        alt: 'Team page of the marketing agency',
        key: 'marketing agency team page'
      }],
      gallery2: [{
        alt: 'Blog section of the marketing agency website',
        key: 'marketing agency blog section'
      }, {
        alt: 'Services page of the marketing agency',
        key: 'marketing agency services page'
      }]
    },
    stats: [{
      value: 60,
      suffix: '%',
      label: 'Lead Increase',
      description: 'Increase in qualified leads within the first three months.'
    }, {
      value: 1.2,
      suffix: 's',
      label: 'Load Time',
      description: 'Achieving an exceptional page load speed.'
    }, {
      value: 20,
      suffix: '%',
      label: 'Bounce Rate Drop',
      description: 'Reduced bounce rate through engaging content.'
    }, {
      value: 1,
      suffix: '#',
      label: 'SERP Ranking',
      description: 'Top ranking for primary target keywords.'
    }]
  }
};
const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.8
};
const Project = () => {
  const {
    projectId
  } = useParams();
  const project = projectData[projectId] || projectData['fintech-dashboard']; // Fallback
  const getLocalizedLink = useLocalizedLink();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  return <motion.div initial={shouldReduceMotion ? false : 'initial'} animate="in" exit="out" variants={pageVariants} transition={shouldReduceMotion ? { duration: 0 } : pageTransition} className="overflow-x-hidden bg-white text-gray-900 dark:bg-[#0C0D0D] dark:text-white">
      <SEO
        title={project.title}
        description={project.description}
        keywords={`${project.title}, diseño UI/UX, proyecto ${project.category.toLowerCase()}, portafolio agencia creativa`}
        url={`https://rium.com.mx/project/${projectId}`}
        type="article"
      />

      <main>
        {/* Top Section */}
        <SectionAnimator>
          <header className="pb-10 pt-28 sm:pb-12 sm:pt-36 md:pb-16 md:pt-48">
            <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6">
              <h1 className="mb-4 break-words text-[clamp(2rem,10vw,3rem)] font-bold uppercase leading-[1.05] md:text-6xl">{project.title}</h1>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400 sm:text-lg md:text-xl">{project.description}</p>
            </div>
          </header>
        </SectionAnimator>
        
        {/* Hero Image */}
        <SectionAnimator>
            <div className="container mx-auto mb-10 px-4 sm:mb-12 sm:px-6 md:mb-16">
                 <div className="aspect-video overflow-hidden rounded-xl shadow-2xl shadow-accent-purple/10 sm:rounded-2xl">
                    <OptimizedImage 
                      className="w-full h-full object-cover" 
                      alt={project.images.hero.alt} 
                      src="https://horizons-cdn.hostinger.com/8c7cb7a4-8366-40b2-93de-512196b005b6/gemini_generated_image_n6u5epn6u5epn6u5-5ABrF.png" 
                      width={1920}
                      height={1080}
                      priority
                    />
                 </div>
            </div>
        </SectionAnimator>

        {/* Gallery - now starts with two images */}
        <SectionAnimator>
            <div className="container mx-auto mb-10 px-4 sm:mb-12 sm:px-6 md:mb-16">
                <div className="grid grid-cols-1 gap-8">
                    {/* Two images */}
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
                        <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                           <OptimizedImage 
                             className="w-full h-full object-cover" 
                             alt={project.images.gallery[1].alt} 
                             src="https://horizons-cdn.hostinger.com/8c7cb7a4-8366-40b2-93de-512196b005b6/gemini_generated_image_mxgp1bmxgp1bmxgp-IDwMQ.png" 
                             width={1200}
                             height={1200}
                           />
                        </div>
                        <div className="aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                            <OptimizedImage 
                              className="w-full h-full object-cover" 
                              alt={project.images.gallery[2].alt} 
                              src="https://horizons-cdn.hostinger.com/8c7cb7a4-8366-40b2-93de-512196b005b6/gemini_generated_image_mxgp1bmxgp1bmxgp-1-RqwfI.png" 
                              width={1200}
                              height={1200}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </SectionAnimator>
        
        {/* Text Section */}
        <SectionAnimator>
            <section className="py-10 sm:py-12 md:py-16">
                <div className="container mx-auto grid items-start gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
                    <div>
                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl">El Desafío</h2>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400 sm:text-lg">{project.challenge}</p>
                    </div>
                     <div>
                        <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:mb-6 md:text-4xl">La Solución</h2>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400 sm:text-lg">{project.solution}</p>
                    </div>
                </div>
            </section>
        </SectionAnimator>
        
        {/* Second Gallery - changed to single image */}
        <SectionAnimator>
            <div className="container mx-auto mb-10 px-4 sm:mb-12 sm:px-6 md:mb-16">
                <div className="aspect-video overflow-hidden rounded-xl sm:rounded-2xl">
                    <OptimizedImage 
                      className="w-full h-full object-cover" 
                      alt={project.images.gallery2[0].alt} 
                      src="https://horizons-cdn.hostinger.com/8c7cb7a4-8366-40b2-93de-512196b005b6/professional-exchange-BmQpX.png" 
                      width={1920}
                      height={1080}
                    />
                </div>
            </div>
        </SectionAnimator>

        {/* Stats Section */}
        <Stats customStats={project.stats} />

        {/* Work Together CTA */}
        <SectionAnimator>
            <section className="py-16 text-center md:py-24">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para Trabajar Juntos?</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-400 mb-8">Hablemos sobre tu próxima gran idea y cómo podemos hacerla realidad.</p>
                     <Button asChild size="lg" className="group min-h-12 rounded-full bg-accent-purple px-7 py-6 text-base text-white active:scale-[.98] motion-reduce:transition-none sm:px-10 sm:py-7 sm:text-lg md:hover:bg-accent-purple/90">
                        <Link to={getLocalizedLink('/contact')}>
                            Hablemos <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </section>
        </SectionAnimator>

      </main>
    </motion.div>;
};
export default Project;