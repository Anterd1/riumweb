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
        <footer className="bg-white dark:bg-[#0C0D0D] border-t border-gray-200 dark:border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider glow-effect">rium</p>
                        <p className="text-gray-700 dark:text-gray-400">{t('footer.tagline')}</p>
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
                            <p className="font-semibold text-gray-900 dark:text-white mb-6">{section.title}</p>
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
                                          className="text-gray-700 dark:text-gray-400 hover:text-accent-purple transition-colors duration-300">
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                     <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-6">{t('footer.connect')}</p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <button key={social.name} onClick={handleSocialClick} className="text-gray-700 dark:text-gray-400 hover:text-accent-purple transition-colors duration-300">
                                    {social.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 text-center text-gray-700 dark:text-gray-500">
                    <p>&copy; {new Date().getFullYear()} rium. {t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;