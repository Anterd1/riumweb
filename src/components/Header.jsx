import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, BookOpen, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);
  const [isMobileBlogExpanded, setIsMobileBlogExpanded] = useState(false);
  const blogMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú de blog al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (blogMenuRef.current && !blogMenuRef.current.contains(event.target)) {
        setIsBlogMenuOpen(false);
      }
    };

    if (isBlogMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBlogMenuOpen]);

  const navLinks = [
    { name: 'Inicio', href: '/', id: 'home' },
    { name: 'Servicios', href: '/#services', id: 'services' },
    { name: 'Portafolio', href: '/#portfolio', id: 'portfolio' },
    { name: 'Acerca', href: '/#about', id: 'about' },
  ];

  const blogSubmenu = [
    { name: 'Artículos', href: '/blog', icon: BookOpen, description: 'Artículos sobre diseño UI/UX' },
    { name: 'Noticias', href: '/noticias', icon: Newspaper, description: 'Noticias tech y tendencias' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const [path, id] = href.split('#');
    
    if (path === '/' || path === '') {
      navigate('/');
      setTimeout(() => {
        if (id) {
          const targetElement = document.getElementById(id);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname === href;
  };

  const isBlogActive = () => {
    return location.pathname.startsWith('/blog') || location.pathname.startsWith('/noticias');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0C0D0D]/95 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-wider">
            rium
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium transition-colors uppercase tracking-wider ${
                  isActive(link.href)
                    ? 'text-accent-purple'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
            
            {/* Blog Menu with Dropdown */}
            <div 
              ref={blogMenuRef}
              className="relative"
              onMouseEnter={() => setIsBlogMenuOpen(true)}
              onMouseLeave={() => setIsBlogMenuOpen(false)}
            >
              <button
                className={`text-sm font-medium transition-colors uppercase tracking-wider flex items-center gap-1 ${
                  isBlogActive()
                    ? 'text-accent-purple'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Blog
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${
                    isBlogMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isBlogMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1E1E2A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-2">
                      {blogSubmenu.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = location.pathname === item.href || 
                          (item.href === '/blog' && location.pathname.startsWith('/blog') && !location.pathname.startsWith('/noticias')) ||
                          (item.href === '/noticias' && location.pathname.startsWith('/noticias'));
                        
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsBlogMenuOpen(false)}
                            className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                              isItemActive
                                ? 'bg-accent-purple/20 text-accent-purple'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <Icon 
                              size={20} 
                              className={`mt-0.5 flex-shrink-0 ${
                                isItemActive ? 'text-accent-purple' : 'text-gray-400 group-hover:text-white'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium text-sm ${
                                isItemActive ? 'text-accent-purple' : 'text-white group-hover:text-white'
                              }`}>
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={() => navigate('/contact')}
              size="sm"
              className="bg-accent-purple hover:bg-accent-purple/90 text-white rounded-full px-6"
            >
              Contacto
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block text-left w-full text-lg font-medium transition-colors uppercase ${
                      isActive(link.href)
                        ? 'text-accent-purple'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                
                {/* Blog with Submenu in Mobile */}
                <div className="space-y-2">
                  <button
                    onClick={() => setIsMobileBlogExpanded(!isMobileBlogExpanded)}
                    className={`flex items-center justify-between w-full text-left text-lg font-medium transition-colors uppercase ${
                      isBlogActive()
                        ? 'text-accent-purple'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Blog
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-200 ${
                        isMobileBlogExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {isMobileBlogExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4 space-y-2"
                      >
                        {blogSubmenu.map((item) => {
                          const Icon = item.icon;
                          const isItemActive = location.pathname === item.href || 
                            (item.href === '/blog' && location.pathname.startsWith('/blog') && !location.pathname.startsWith('/noticias')) ||
                            (item.href === '/noticias' && location.pathname.startsWith('/noticias'));
                          
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileBlogExpanded(false);
                              }}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                isItemActive
                                  ? 'bg-accent-purple/20 text-accent-purple'
                                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <Icon 
                                size={18} 
                                className={`flex-shrink-0 ${
                                  isItemActive ? 'text-accent-purple' : 'text-gray-400'
                                }`}
                              />
                              <div className="flex-1">
                                <div className={`font-medium text-sm ${
                                  isItemActive ? 'text-accent-purple' : 'text-white'
                                }`}>
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  onClick={() => {
                    navigate('/contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white rounded-full mt-4"
                >
                  Contacto
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
