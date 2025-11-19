import React, { useState, useEffect, useRef, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, Users, Briefcase, Mail, Monitor, Smartphone, Search, FileText, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const menuStructure = [
    {
      title: 'Servicios',
      id: 'services',
      items: [
        { name: 'Diseño UI/UX', href: '/#services', icon: Monitor, description: 'Interfaces intuitivas' },
        { name: 'Desarrollo', href: '/#services', icon: Smartphone, description: 'Sitios escalables' },
        { name: 'Auditoría', href: '/#services', icon: Search, description: 'Optimización UX' },
      ]
    },
    {
      title: 'Explora',
      id: 'explore',
      items: [
        { name: 'Artículos', href: '/blog', icon: FileText, description: 'Pensamiento' },
        { name: 'Noticias', href: '/noticias', icon: Newspaper, description: 'Actualidad' },
      ]
    },
    {
      title: 'Agencia',
      id: 'agency',
      items: [
        { name: 'Nosotros', href: '/#about', icon: Users, description: 'Equipo y cultura' },
        { name: 'Portafolio', href: '/#portfolio', icon: Briefcase, description: 'Casos de éxito' },
        { name: 'Contacto', href: '/contact', icon: Mail, description: 'Inicia tu proyecto' },
      ]
    }
  ];

  const handleNavClick = (e, href) => {
    if (href.includes('#')) {
      e.preventDefault();
      const [path, id] = href.split('#');
      if (path === '/' || path === '') {
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => scrollToElement(id), 100);
        } else {
          scrollToElement(id);
        }
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
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

  const isDarkHeader = isScrolled || isMobileMenuOpen || isPostPage();

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300 py-4"
      >
        <nav className="container mx-auto px-6 h-20 flex items-center relative">
          <Link 
            to="/" 
            className={`text-2xl font-bold tracking-wider transition-colors relative z-[101] absolute left-6 ${
              isDarkHeader ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            rium
          </Link>

          {/* Desktop Navigation - Animated Capsule */}
          <div className="hidden md:flex justify-center absolute left-0 right-0 top-0 pointer-events-none h-screen">
             {/* Usamos top-0 y h-screen para dar espacio de sobra hacia abajo, pero centramos visualmente con margin-top */}
            <div className="pointer-events-auto mt-6"> 
              <LayoutGroup>
                <motion.div
                  ref={navRef}
                  layout
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  className={`
                    relative flex flex-col items-center overflow-hidden
                    ${isDarkHeader 
                      ? 'bg-white/90 dark:bg-[#1E1E2A]/95 border-gray-200/50 dark:border-white/10' 
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
                    {menuStructure.map((section) => (
                      <button
                        key={section.id}
                        onMouseEnter={() => setActiveDropdown(section.id)}
                        className={`
                          relative px-4 py-2 rounded-full text-sm font-medium transition-colors z-10
                          ${activeDropdown === section.id 
                            ? 'text-gray-900 dark:text-white' 
                            : isDarkHeader
                              ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                              : 'text-white/90 hover:text-white'
                          }
                        `}
                      >
                        {activeDropdown === section.id && (
                          <motion.div
                            layoutId="active-pill"
                            className={`absolute inset-0 rounded-full ${
                              isDarkHeader ? 'bg-gray-100 dark:bg-white/10' : 'bg-white/20'
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
                    ))}
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    {activeDropdown && (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="w-full"
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
                                        ? 'hover:bg-gray-100 dark:hover:bg-white/5' 
                                        : 'hover:bg-white/10'
                                      }
                                    `}
                                  >
                                    <div className={`
                                      p-2 rounded-lg transition-colors
                                      ${isDarkHeader 
                                        ? 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-accent-purple' 
                                        : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'
                                      }
                                    `}>
                                      <Icon size={18} />
                                    </div>
                                    <div>
                                      <div className={`
                                        text-sm font-medium
                                        ${isDarkHeader ? 'text-gray-900 dark:text-white' : 'text-white'}
                                      `}>
                                        {item.name}
                                      </div>
                                      <div className={`
                                        text-xs
                                        ${isDarkHeader ? 'text-gray-500 dark:text-gray-400' : 'text-white/60'}
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

          <Button
            onClick={() => navigate('/contact')}
            className={`hidden md:flex absolute right-6 rounded-full px-6 transition-all duration-300 ${
              isDarkHeader 
                ? 'bg-accent-purple text-white hover:bg-accent-purple/90 shadow-lg shadow-accent-purple/20'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Hablemos
          </Button>

          <button
            className={`md:hidden p-2 rounded-full transition-colors relative z-[101] ${
              isDarkHeader ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 top-0 bg-white dark:bg-[#0C0D0D] z-[100] pt-24 px-6 overflow-y-auto"
              >
                <div className="flex flex-col gap-8">
                  {menuStructure.map((section, idx) => (
                    <div key={section.id}>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                        {section.title}
                      </h3>
                      <div className="flex flex-col gap-4">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.name}
                              href={item.href}
                              onClick={(e) => handleNavClick(e, item.href)}
                              className="flex items-center gap-4 group"
                            >
                              <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg">
                                <Icon size={20} className="text-gray-500 dark:text-gray-400" />
                              </div>
                              <span className="text-xl font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                      {idx < menuStructure.length - 1 && (
                        <hr className="my-6 border-gray-100 dark:border-white/5" />
                      )}
                    </div>
                  ))}
                  
                  <Button
                    onClick={() => {
                      navigate('/contact');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-accent-purple text-white py-6 rounded-xl text-lg mt-4"
                  >
                    Iniciar Proyecto <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
