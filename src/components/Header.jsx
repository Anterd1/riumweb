import React, { useState, useEffect, useRef, memo } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronDown, Users, Briefcase, Mail, Monitor, Smartphone, Search, FileText, Newspaper, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const Header = memo(() => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentHash, setCurrentHash] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const mobileNavRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const getLocalizedLink = useLocalizedLink();
  
  const currentLang = lang || (location.pathname.startsWith('/en') ? 'en' : 'es');
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Cambiar el idioma en la URL manteniendo la ruta actual
    const pathWithoutLang = location.pathname.replace(/^\/(es|en)/, '') || '/';
    navigate(`/${lng}${pathWithoutLang}${location.hash}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Detectar tema actual
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    };
    
    // Verificar tema inicial
    checkTheme();
    
    // Observar cambios en la clase dark del elemento raíz
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both desktop and mobile nav
      const isOutsideDesktopNav = navRef.current && !navRef.current.contains(event.target);
      const isOutsideMobileNav = mobileNavRef.current && !mobileNavRef.current.contains(event.target);
      
      if (isOutsideDesktopNav && isOutsideMobileNav) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setCurrentHash(window.location.hash);
  }, [location.pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const menuStructure = [
    {
      title: t('header.menu.services'),
      id: 'services',
      items: [
        { name: t('header.items.uiux'), href: `/${currentLang}#services`, icon: Monitor, description: t('header.descriptions.uiux') },
        { name: t('header.items.development'), href: `/${currentLang}#services`, icon: Smartphone, description: t('header.descriptions.development') },
        { name: t('header.items.audit'), href: `/${currentLang}#services`, icon: Search, description: t('header.descriptions.audit') },
      ]
    },
    {
      title: t('header.menu.explore'),
      id: 'explore',
      items: [
        { name: t('header.items.articles'), href: getLocalizedLink('/blog'), icon: FileText, description: t('header.descriptions.articles') },
        { name: t('header.items.news'), href: getLocalizedLink('/noticias'), icon: Newspaper, description: t('header.descriptions.news') },
      ]
    },
    {
      title: t('header.menu.agency'),
      id: 'agency',
      items: [
        { name: t('header.items.about'), href: `/${currentLang}#about`, icon: Users, description: t('header.descriptions.about') },
        { name: t('header.items.portfolio'), href: `/${currentLang}#portfolio`, icon: Briefcase, description: t('header.descriptions.portfolio') },
        { name: t('header.items.contact'), href: getLocalizedLink('/contact'), icon: Mail, description: t('header.descriptions.contact') },
      ]
    }
  ];

  const handleNavClick = (e, href) => {
    if (href.includes('#')) {
      e.preventDefault();
      const [path, id] = href.split('#');
      const homePath = `/${currentLang}`;
      const isOnHome = location.pathname === homePath || location.pathname === `${homePath}/`;
      
      if (path === `/${currentLang}` || path === '/' || path === '') {
        if (!isOnHome) {
          // Si no estamos en el home, navegar primero
          navigate(homePath);
          setTimeout(() => {
            scrollToElement(id);
            setCurrentHash(`#${id}`);
          }, 300);
        } else {
          // Si ya estamos en el home, solo hacer scroll
          scrollToElement(id);
          setCurrentHash(`#${id}`);
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
    setActiveDropdown(null);
  };

  const scrollToElement = (id) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Intentar encontrar el elemento, con varios intentos si es necesario
    const findAndScroll = (attempts = 0) => {
      const element = document.getElementById(id);
      if (element) {
        // Ajustar el scroll para tener en cuenta el header fijo
        const headerHeight = headerRef.current?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else if (attempts < 10) {
        // Si no se encuentra, intentar de nuevo después de un breve delay
        setTimeout(() => findAndScroll(attempts + 1), 50);
      }
    };
    
    findAndScroll();
  };

  const isPostPage = () => {
    const path = location.pathname;
    return (path.startsWith('/blog/') && path !== '/blog') || 
           (path.startsWith('/noticias/') && path !== '/noticias');
  };

  const isDarkHeader = isScrolled || isPostPage();

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 py-4"
      >
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between relative">
          <div className="z-[101] flex items-center h-full">
            <Link 
              to={getLocalizedLink('/')} 
              className={`text-2xl font-bold tracking-wider transition-colors duration-300 ${
                isDarkHeader 
                  ? isDarkTheme ? 'text-white' : 'text-gray-900'
                  : 'text-white'
              }`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              rium
            </Link>
          </div>

          {/* Language Selector - Mobile (Top Right) */}
          <div className="md:hidden flex items-center gap-1.5 z-[101]">
            <button
              onClick={() => changeLanguage('es')}
              className={`
                w-9 h-9 rounded-full text-base transition-all flex items-center justify-center
                ${i18n.language === 'es'
                  ? isDarkHeader
                    ? isDarkTheme ? 'bg-white/20 ring-2 ring-white/50' : 'bg-gray-900/20 ring-2 ring-gray-900/50'
                    : 'bg-white/20 ring-2 ring-white/50'
                  : isDarkHeader
                    ? isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20'
                    : 'bg-white/10 hover:bg-white/20'
                }
              `}
              title="Español"
            >
              🇲🇽
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`
                w-9 h-9 rounded-full text-base transition-all flex items-center justify-center
                ${i18n.language === 'en'
                  ? isDarkHeader
                    ? isDarkTheme ? 'bg-white/20 ring-2 ring-white/50' : 'bg-gray-900/20 ring-2 ring-gray-900/50'
                    : 'bg-white/20 ring-2 ring-white/50'
                  : isDarkHeader
                    ? isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20'
                    : 'bg-white/10 hover:bg-white/20'
                }
              `}
              title="English"
            >
              🇺🇸
            </button>
          </div>

          {/* Desktop Navigation - Animated Capsule */}
          <div className="hidden md:flex justify-center absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none h-full">
            <div className="pointer-events-auto flex items-start pt-5"> 
              <LayoutGroup>
                  <motion.div
                  ref={navRef}
                  layout
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  className={`
                    relative flex flex-col items-center overflow-visible
                    ${isDarkHeader 
                      ? isDarkTheme
                        ? 'bg-[#1E1E2A]/95 border-white/10'
                        : 'bg-white/90 border-gray-200/50'
                      : 'bg-black/30 border-white/10'
                    }
                    backdrop-blur-xl border transition-colors duration-300
                  `}
                  style={{ 
                    borderRadius: 24,
                    transformOrigin: 'top center'
                  }}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.div layout className="flex items-center gap-1 p-1.5 px-2 z-20">
                    {menuStructure.map((section) => {
                      // Obtener el primer item del dropdown para navegación
                      const firstItem = section.items[0];
                      const handleMenuClick = (e) => {
                        // Si estamos en otra página, navegar al home con el hash correspondiente
                        const homePath = `/${currentLang}`;
                        if (location.pathname !== homePath && !location.pathname.startsWith(`/${currentLang}/`)) {
                          e.preventDefault();
                          const targetHref = firstItem?.href || homePath;
                          if (targetHref.includes('#')) {
                            const [path, id] = targetHref.split('#');
                            navigate(homePath);
                            setTimeout(() => {
                              scrollToElement(id);
                              setCurrentHash(`#${id}`);
                            }, 100);
                          } else {
                            navigate(targetHref);
                          }
                          setActiveDropdown(null);
                        } else {
                          // Si estamos en home, hacer scroll a la sección
                          if (firstItem?.href.includes('#')) {
                            e.preventDefault();
                            const [, id] = firstItem.href.split('#');
                            scrollToElement(id);
                            setCurrentHash(`#${id}`);
                            setActiveDropdown(null);
                          }
                        }
                      };
                      
                      return (
                      <button
                        key={section.id}
                        onMouseEnter={() => setActiveDropdown(section.id)}
                        onClick={handleMenuClick}
                        className={`
                          relative px-4 py-2 rounded-full text-sm font-medium transition-colors z-10
                          ${activeDropdown === section.id 
                            ? isDarkTheme ? 'text-white' : 'text-gray-900'
                            : isDarkHeader
                              ? isDarkTheme 
                                ? 'text-gray-300 hover:text-white'
                                : 'text-gray-600 hover:text-gray-900'
                              : 'text-white/90 hover:text-white'
                          }
                        `}
                      >
                        {activeDropdown === section.id && (
                          <motion.div
                            layoutId="active-pill"
                            className={`absolute inset-0 rounded-full ${
                              isDarkHeader 
                                ? isDarkTheme ? 'bg-white/10' : 'bg-gray-100'
                                : 'bg-white/20'
                            }`}
                            transition={{ type: "spring", duration: 0.6 }}
                          />
                        )}
                        <span className="relative flex items-center gap-1">
                          {section.title}
                          <ChevronDown 
                            size={14} 
                            className={`transition-transform duration-300 ${activeDropdown === section.id ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </button>
                      );
                    })}
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    {activeDropdown && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="w-full mt-1"
                        style={{ transformOrigin: 'top center' }}
                      >
                        <div className="px-4 pb-4 pt-2 w-[340px]">
                          <div className="flex flex-col gap-2">
                            {menuStructure.find(s => s.id === activeDropdown)?.items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <motion.div
                                  key={item.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <a
                                    href={item.href}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                    className={`
                                      group flex items-center gap-3 p-2.5 rounded-xl transition-colors
                                      ${isDarkHeader 
                                        ? isDarkTheme 
                                          ? 'hover:bg-white/5' 
                                          : 'hover:bg-gray-100'
                                        : 'hover:bg-white/10'
                                      }
                                    `}
                                  >
                                    <div className={`
                                      p-2 rounded-lg transition-colors
                                      ${isDarkHeader 
                                        ? isDarkTheme
                                          ? 'bg-white/5 text-gray-400 group-hover:text-accent-purple' 
                                          : 'bg-gray-100 text-gray-500 group-hover:text-accent-purple'
                                        : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'
                                      }
                                    `}>
                                      <Icon size={18} />
                                    </div>
                                    <div>
                                      <div className={`
                                        text-sm font-medium
                                        ${isDarkHeader 
                                          ? isDarkTheme ? 'text-white' : 'text-gray-900'
                                          : 'text-white'
                                        }
                                      `}>
                                        {item.name}
                                      </div>
                                      <div className={`
                                        text-xs
                                        ${isDarkHeader 
                                          ? isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                                          : 'text-white/60'
                                        }
                                      `}>
                                        {item.description}
                                      </div>
                                    </div>
                                  </a>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </LayoutGroup>
            </div>
          </div>

          {/* Right Side - Language Selector + CTA Button */}
          <div className="hidden md:flex items-center gap-4 z-50 relative h-full">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => changeLanguage('es')}
                className={`
                  w-9 h-9 rounded-full text-base transition-all flex items-center justify-center
                  ${i18n.language === 'es'
                    ? isDarkHeader
                      ? isDarkTheme ? 'bg-white/20 ring-2 ring-white/50' : 'bg-gray-900/20 ring-2 ring-gray-900/50'
                      : 'bg-white/20 ring-2 ring-white/50'
                    : isDarkHeader
                      ? isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20'
                      : 'bg-white/10 hover:bg-white/20'
                  }
                `}
                title="Español"
              >
                🇲🇽
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`
                  w-9 h-9 rounded-full text-base transition-all flex items-center justify-center
                  ${i18n.language === 'en'
                    ? isDarkHeader
                      ? isDarkTheme ? 'bg-white/20 ring-2 ring-white/50' : 'bg-gray-900/20 ring-2 ring-gray-900/50'
                      : 'bg-white/20 ring-2 ring-white/50'
                    : isDarkHeader
                      ? isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-900/10 hover:bg-gray-900/20'
                      : 'bg-white/10 hover:bg-white/20'
                  }
                `}
                title="English"
              >
                🇺🇸
              </button>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => navigate(getLocalizedLink('/contact'))}
              className={`rounded-full px-6 h-9 transition-all duration-300 z-50 relative flex items-center ${
                isDarkHeader 
                  ? 'bg-accent-purple text-white hover:bg-accent-purple/90 shadow-lg shadow-accent-purple/20'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {t('hero.cta')}
            </Button>
          </div>

          {/* Mobile Bottom Navigation - Humaan Style */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
            <LayoutGroup>
              <motion.nav
                ref={mobileNavRef}
                layout
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`
                  pointer-events-auto mx-4 mb-6 rounded-3xl backdrop-blur-xl border shadow-lg overflow-hidden
                  ${isDarkHeader 
                    ? isDarkTheme
                      ? 'bg-[#1E1E2A]/98 border-white/15'
                      : 'bg-white/95 border-gray-200/60'
                    : 'bg-black/40 border-white/20'
                  }
                  transition-colors duration-300
                `}
              >
              {/* Dropdown Content Area */}
              <AnimatePresence initial={false}>
                {activeDropdown && (() => {
                  const activeSection = menuStructure.find(s => s.id === activeDropdown);
                  if (!activeSection) return null;
                  
                  return (
                    <motion.div
                      key={activeDropdown}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          mass: 0.8,
                          bounce: 0
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: {
                          duration: 0.25,
                          ease: [0.22, 1, 0.36, 1]
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pt-4 pb-2">
                        <div className="grid grid-cols-1 gap-2">
                          {activeSection.items.map((item, idx) => {
                            const Icon = item.icon;
                            const isItemActive = 
                              (activeDropdown === 'services' && (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`) && currentHash === '#services') ||
                              (item.href.includes('/blog') && location.pathname.startsWith(`/${currentLang}/blog`) && !location.pathname.match(/\/blog\/.+/)) ||
                              (item.href.includes('/noticias') && location.pathname.startsWith(`/${currentLang}/noticias`) && !location.pathname.match(/\/noticias\/.+/));
                            
                            return (
                              <motion.button
                                key={item.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.04, duration: 0.2 }}
                                onClick={(e) => {
                                  handleNavClick(e, item.href);
                                  setActiveDropdown(null);
                                }}
                                className={`
                                  w-full px-4 py-3 rounded-xl text-left text-xs font-medium transition-all flex items-center gap-3
                                  ${isItemActive
                                    ? isDarkHeader
                                      ? isDarkTheme ? 'bg-white/20 text-white' : 'bg-gray-900/20 text-gray-900'
                                      : 'bg-white/20 text-white'
                                    : isDarkHeader
                                      ? isDarkTheme ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-gray-900/10 hover:text-gray-900'
                                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                                  }
                                `}
                              >
                                <Icon size={18} className="flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="font-semibold">{item.name}</div>
                                  <div className={`text-[10px] mt-0.5 ${
                                    isDarkHeader
                                      ? isDarkTheme ? 'text-gray-500' : 'text-gray-500'
                                      : 'text-white/50'
                                  }`}>
                                    {item.description}
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <motion.div layout="position" className="flex items-center justify-around gap-0.5 px-3 py-2.5">
                {/* Home */}
                {(() => {
                  const isHomeActive = (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`) && !currentHash;
                  return (
                    <motion.button
                      layout="position"
                      key="home"
                      onClick={(e) => handleNavClick(e, getLocalizedLink('/'))}
                      className="relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-all min-w-[60px]"
                    >
                      {isHomeActive && (
                        <motion.div
                          layoutId="mobile-active-pill-home"
                          className={`absolute inset-0 rounded-full ${
                            isDarkHeader 
                              ? isDarkTheme ? 'bg-white' : 'bg-gray-900'
                              : 'bg-white'
                          }`}
                          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                        />
                      )}
                      <span
                        className={`
                          relative z-10 whitespace-nowrap block text-center
                          ${isHomeActive
                            ? isDarkHeader
                              ? isDarkTheme ? 'text-gray-900 font-semibold' : 'text-white font-semibold'
                              : 'text-black font-semibold'
                            : isDarkHeader
                              ? isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                              : 'text-white/70'
                          }
                        `}
                      >
                        {t('footer.links.home')}
                      </span>
                    </motion.button>
                  );
                })()}

                {/* Services Button */}
                {(() => {
                  const servicesSection = menuStructure.find(s => s.id === 'services');
                  const isServicesActive = (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`) && currentHash === '#services';
                  const isServicesDropdownOpen = activeDropdown === 'services';
                  
                  return (
                    <motion.button
                      layout="position"
                      key="services"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'services' ? null : 'services');
                      }}
                      className="relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-all min-w-[60px]"
                    >
                      {(isServicesDropdownOpen || isServicesActive) && (
                        <motion.div
                          layoutId="mobile-active-pill-services"
                          className={`absolute inset-0 rounded-full ${
                            isDarkHeader 
                              ? isDarkTheme ? 'bg-white' : 'bg-gray-900'
                              : 'bg-white'
                          }`}
                          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                        />
                      )}
                      <span
                        className={`
                          relative z-10 whitespace-nowrap block text-center flex items-center gap-1 justify-center
                          ${(isServicesDropdownOpen || isServicesActive)
                            ? isDarkHeader
                              ? isDarkTheme ? 'text-gray-900 font-semibold' : 'text-white font-semibold'
                              : 'text-black font-semibold'
                            : isDarkHeader
                              ? isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                              : 'text-white/70'
                          }
                        `}
                      >
                        {servicesSection?.title}
                        <ChevronDown 
                          size={12} 
                          className={`transition-transform duration-300 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </motion.button>
                  );
                })()}

                {/* Explore Button */}
                {(() => {
                  const exploreSection = menuStructure.find(s => s.id === 'explore');
                  const isExploreActive = exploreSection?.items.some(subItem => {
                    const subIsActive = 
                      (subItem.href.includes('/blog') && location.pathname.startsWith(`/${currentLang}/blog`) && !location.pathname.match(/\/blog\/.+/)) ||
                      (subItem.href.includes('/noticias') && location.pathname.startsWith(`/${currentLang}/noticias`) && !location.pathname.match(/\/noticias\/.+/));
                    return subIsActive;
                  });
                  const isExploreDropdownOpen = activeDropdown === 'explore';
                  
                  return (
                    <motion.button
                      layout="position"
                      key="explore"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'explore' ? null : 'explore');
                      }}
                      className="relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-all min-w-[60px]"
                    >
                      {(isExploreDropdownOpen || isExploreActive) && (
                        <motion.div
                          layoutId="mobile-active-pill-explore"
                          className={`absolute inset-0 rounded-full ${
                            isDarkHeader 
                              ? isDarkTheme ? 'bg-white' : 'bg-gray-900'
                              : 'bg-white'
                          }`}
                          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                        />
                      )}
                      <span
                        className={`
                          relative z-10 whitespace-nowrap block text-center flex items-center gap-1 justify-center
                          ${(isExploreDropdownOpen || isExploreActive)
                            ? isDarkHeader
                              ? isDarkTheme ? 'text-gray-900 font-semibold' : 'text-white font-semibold'
                              : 'text-black font-semibold'
                            : isDarkHeader
                              ? isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                              : 'text-white/70'
                          }
                        `}
                      >
                        {exploreSection?.title}
                        <ChevronDown 
                          size={12} 
                          className={`transition-transform duration-300 ${isExploreDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </motion.button>
                  );
                })()}

                {/* Contact */}
                {(() => {
                  const isContactActive = location.pathname === `/${currentLang}/contact`;
                  return (
                    <motion.button
                      layout="position"
                      key="contact"
                      onClick={(e) => handleNavClick(e, getLocalizedLink('/contact'))}
                      className="relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-all min-w-[60px]"
                    >
                      {isContactActive && (
                        <motion.div
                          layoutId="mobile-active-pill-contact"
                          className={`absolute inset-0 rounded-full ${
                            isDarkHeader 
                              ? isDarkTheme ? 'bg-white' : 'bg-gray-900'
                              : 'bg-white'
                          }`}
                          transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                        />
                      )}
                      <span
                        className={`
                          relative z-10 whitespace-nowrap block text-center
                          ${isContactActive
                            ? isDarkHeader
                              ? isDarkTheme ? 'text-gray-900 font-semibold' : 'text-white font-semibold'
                              : 'text-black font-semibold'
                            : isDarkHeader
                              ? isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                              : 'text-white/70'
                          }
                        `}
                      >
                        {t('header.items.contact')}
                      </span>
                    </motion.button>
                  );
                })()}
              </motion.div>
            </motion.nav>
            </LayoutGroup>
          </div>
        </nav>
      </header>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
