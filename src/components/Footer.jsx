import React from 'react';
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';

const Footer = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { lang } = useParams();
    const location = useLocation();
    const getLocalizedLink = useLocalizedLink();
    
    const currentLang = lang || (location.pathname.startsWith('/en') ? 'en' : 'es');

    const handleSocialClick = () => {
        toast({
            title: "Feature Not Implemented 🚧",
            description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        });
    };

    const handleNavClick = (e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        const [path, id] = href.split('#');
        const homePath = `/${currentLang}`;

        if (path === `/${currentLang}` || path === '/' || path === '') { // Handles both '/#section' and '#section'
            navigate(homePath);
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
             handleSocialClick(); // For unimplemented links like 'Careers'
        }
    };
    

    const socialLinks = [
        { icon: <Github size={20} />, name: 'Github' },
        { icon: <Twitter size={20} />, name: 'Twitter' },
        { icon: <Linkedin size={20} />, name: 'Linkedin' },
        { icon: <Instagram size={20} />, name: 'Instagram' },
    ];

    return (
        <footer className="border-t border-white/10 bg-[#101114] pb-8 pt-16 text-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <p className="mb-3 text-4xl font-semibold tracking-[-.06em]">rium<span className="text-[#DFFF4F]">.</span></p>
                        <p className="max-w-xs text-white/45">{t('footer.tagline')}</p>
                    </div>

                    {[
                        {
                            title: t('footer.sections.quickLinks'),
                            links: [
                                { name: t('footer.links.home'), href: `/${currentLang}#` },
                                { name: t('footer.links.services'), href: `/${currentLang}#services` },
                                { name: t('footer.links.portfolio'), href: `/${currentLang}#portfolio` },
                                { name: t('footer.links.about'), href: `/${currentLang}#about` },
                            ],
                        },
                        {
                            title: t('footer.sections.company'),
                            links: [
                                { name: t('footer.links.contact'), href: getLocalizedLink('/contact') },
                                { name: t('footer.links.careers'), href: '#' },
                                { name: t('footer.links.privacy'), href: '#' },
                                { name: t('footer.links.terms'), href: '#' },
                            ],
                        },
                    ].map((section) => (
                        <div key={section.title}>
                            <p className="mb-6 text-xs font-bold uppercase tracking-[.16em] text-[#DFFF4F]">{section.title}</p>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a 
                                          href={link.href} 
                                          onClick={(e) => {
                                              if (link.href === getLocalizedLink('/contact') || link.href.includes('/contact')) {
                                                  e.preventDefault();
                                                  navigate(getLocalizedLink('/contact'));
                                              } else if (link.href.includes('#')) {
                                                  handleNavClick(e);
                                              } else {
                                                  e.preventDefault();
                                                  handleSocialClick();
                                              }
                                          }} 
                                          className="text-white/50 transition-colors duration-300 hover:text-white">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                     <div>
                        <p className="mb-6 text-xs font-bold uppercase tracking-[.16em] text-[#DFFF4F]">{t('footer.connect')}</p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <button key={social.name} onClick={handleSocialClick} className="text-white/45 transition-colors duration-300 hover:text-[#DFFF4F]" aria-label={social.name}>
                                    {social.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/35">
                    <p>&copy; {new Date().getFullYear()} rium. {t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;