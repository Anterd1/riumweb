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
      if (navRef.current && !navRef.current.contains(event.target)) {
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
      
      if (path === `/${currentLang}` || path === '/' || path === '') {
        if (location.pathname !== homePath && !location.pathname.startsWith(`/${currentLang}/`)) {
          navigate(homePath);
          setTimeout(() => {
            scrollToElement(id);
            setCurrentHash(`#${id}`);
          }, 100);
        } else {
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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isScrolled ? 0 : 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`z-[101] flex items-center h-full ${isScrolled ? 'pointer-events-none' : 'pointer-events-auto'}`}
          >
            <Link 
              to={getLocalizedLink('/')} 
              className={`text-2xl font-bold tracking-wider transition-colors ${
                isDarkHeader 
                  ? isDarkTheme ? 'text-white' : 'text-gray-900'
                  : 'text-white'
              }`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              rium
            </Link>
          </motion.div>

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
            <motion.nav
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={`
                pointer-events-auto mx-4 mb-6 px-3 py-2.5 rounded-3xl backdrop-blur-xl border shadow-lg
                ${isDarkHeader 
                  ? isDarkTheme
                    ? 'bg-[#1E1E2A]/98 border-white/15'
                    : 'bg-white/95 border-gray-200/60'
                  : 'bg-black/40 border-white/20'
                }
                transition-colors duration-300
              `}
            >
              <div className="flex items-center justify-around gap-0.5">
                {[
                  { name: t('footer.links.home'), href: getLocalizedLink('/'), id: 'home' },
                  { name: t('header.menu.services'), href: `/${currentLang}#services`, id: 'services' },
                  { name: 'Blog', href: getLocalizedLink('/blog'), id: 'blog' },
                  { name: t('header.items.news'), href: getLocalizedLink('/noticias'), id: 'noticias' },
                  { name: t('header.items.contact'), href: getLocalizedLink('/contact'), id: 'contact' },
                ].map((item) => {
                  const isActive = 
                    (item.id === 'home' && (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`) && !currentHash) ||
                    (item.id === 'services' && (location.pathname === `/${currentLang}` || location.pathname === `/${currentLang}/`) && currentHash === '#services') ||
                    (item.id === 'blog' && location.pathname.startsWith(`/${currentLang}/blog`) && !location.pathname.match(/\/blog\/.+/)) ||
                    (item.id === 'noticias' && location.pathname.startsWith(`/${currentLang}/noticias`) && !location.pathname.match(/\/noticias\/.+/)) ||
                    (item.id === 'contact' && location.pathname === `/${currentLang}/contact`);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="relative px-3 py-1.5 rounded-full text-[11px] font-medium transition-all min-w-[60px]"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-active-pill"
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
                          ${isActive
                            ? isDarkHeader
                              ? isDarkTheme ? 'text-gray-900 font-semibold' : 'text-white font-semibold'
                              : 'text-black font-semibold'
                            : isDarkHeader
                              ? isDarkTheme ? 'text-gray-400' : 'text-gray-600'
                              : 'text-white/70'
                          }
                        `}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}
                {/* Language Selector - Mobile */}
                <div className="flex items-center gap-1.5 px-2">
                  <button
                    onClick={() => changeLanguage('es')}
                    className={`
                      w-8 h-8 rounded-full text-sm transition-all flex items-center justify-center
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
                      w-8 h-8 rounded-full text-sm transition-all flex items-center justify-center
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
              </div>
            </motion.nav>
          </div>
        </nav>
      </header>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
