import React, { useState, useEffect, useRef, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight, Sparkles, Briefcase, Users, Mail, Monitor, Smartphone, Search, FileText, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Estructura del Mega Menu
  const menuStructure = [
    {
      title: 'Servicios',
      id: 'services',
      items: [
        { name: 'Diseño UI/UX', href: '/#services', icon: Monitor, description: 'Interfaces intuitivas y atractivas' },
        { name: 'Desarrollo Web', href: '/#services', icon: Smartphone, description: 'Sitios rápidos y escalables' },
        { name: 'Auditoría UX', href: '/#services', icon: Search, description: 'Optimización de experiencia' },
      ]
    },
    {
      title: 'Explora',
      id: 'explore',
      items: [
        { name: 'Artículos', href: '/blog', icon: FileText, description: 'Pensamiento y estrategia' },
        { name: 'Noticias Tech', href: '/noticias', icon: Newspaper, description: 'Actualidad y tendencias' },
      ]
    },
    {
      title: 'Agencia',
      id: 'agency',
      items: [
        { name: 'Nosotros', href: '/#about', icon: Users, description: 'Nuestro equipo y cultura' },
        { name: 'Portafolio', href: '/#portfolio', icon: Briefcase, description: 'Casos de éxito' },
        { name: 'Contacto', href: '/contact', icon: Mail, description: 'Inicia tu proyecto' },
      ]
    }
  ];

  const handleNavClick = (e, href) => {
    // Si es un enlace interno con hash, manejar scroll
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
      // Navegación normal
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

  // Detectar si estamos en una página de artículo/noticia individual
  const isPostPage = () => {
    const path = location.pathname;
    return (path.startsWith('/blog/') && path !== '/blog') || 
           (path.startsWith('/noticias/') && path !== '/noticias');
  };

  const isDarkHeader = isScrolled || isMobileMenuOpen || isPostPage();

  return (
    <>
      {/* Mobile Overlay */}
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
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-2xl font-bold tracking-wider transition-colors relative z-[101] ${
              isDarkHeader ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            rium
          </Link>

          {/* Desktop Navigation - "Cápsula" Flotante */}
          <div className="hidden md:flex items-center gap-2">
            <div className={`
              flex items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-300 shadow-sm
              ${isDarkHeader 
                ? 'bg-white/80 dark:bg-[#1E1E2A]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/10' 
                : 'bg-white/10 backdrop-blur-md border border-white/10'
              }
            `}>
              {menuStructure.map((section) => (
                <div 
                  key={section.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(section.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className={`
                      px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5
                      ${activeDropdown === section.id 
                        ? 'bg-white dark:bg-[#1E1E2A] text-gray-900 dark:text-white shadow-md transform scale-105' 
                        : isDarkHeader
                          ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/10'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {section.title}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === section.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === section.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[320px] p-2 bg-white dark:bg-[#1E1E2A] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden"
                        style={{ transformOrigin: 'top center' }}
                      >
                        <div className="flex flex-col gap-1">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            return (
                              <a
                                key={item.name}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className="group flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                              >
                                <div className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg group-hover:bg-accent-purple/10 group-hover:text-accent-purple transition-colors">
                                  <Icon size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-accent-purple" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-accent-purple transition-colors">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {item.description}
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => navigate('/contact')}
              className={`ml-4 rounded-full px-6 transition-all duration-300 ${
                isDarkHeader 
                  ? 'bg-accent-purple text-white hover:bg-accent-purple/90 shadow-lg shadow-accent-purple/20'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Hablemos
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-full transition-colors relative z-[101] ${
              isDarkHeader ? 'text-gray-900 dark:text-white' : 'text-white'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Fullscreen Overlay */}
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
