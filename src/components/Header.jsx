import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Services', href: '/#services', id: 'services' },
    { name: 'Portfolio', href: '/#portfolio', id: 'portfolio' },
    { name: 'About', href: '/#about', id: 'about' },
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
            <Button
              onClick={() => navigate('/contact')}
              size="sm"
              className="bg-accent-purple hover:bg-accent-purple/90 text-white rounded-full px-6"
            >
              Contact
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
              <div className="py-4 space-y-4">
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
                <Button
                  onClick={() => {
                    navigate('/contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white rounded-full"
                >
                  Contact
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
