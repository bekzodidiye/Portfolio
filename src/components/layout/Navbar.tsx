import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useUIContext } from '../../context/UIContext';
import { NavbarMobileMenu } from './NavbarMobileMenu';
import { NavbarActions } from './NavbarActions';

export const Navbar: React.FC = () => {
  const { setIsResumeOpen, setIsVisitorModalOpen } = useUIContext();
  const { t } = useLanguage();
  const { candidateProfile, setIsAdminOpen } = usePortfolioData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  // Secret 5-Click Easter Egg on Logo to trigger Admin Hub
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleBrandClick = () => {
    clickCountRef.current += 1;
    if (clickCountRef.current >= 5) {
      setIsAdminOpen(true);
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      return;
    }
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);

          const sections = ['about', 'skills', 'projects', 'experience', 'contact'];
          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 200 && rect.bottom >= 200) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav.about, href: '#about', id: 'about' },
    { name: t.nav.skills, href: '#skills', id: 'skills' },
    { name: t.nav.projects, href: '#projects', id: 'projects' },
    { name: t.nav.experience, href: '#experience', id: 'experience' },
    { name: t.nav.contact, href: '#contact', id: 'contact' },
  ];

  return (
    <>
      {/* Accessible Skip to Content Link */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:font-mono focus:text-xs focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md bg-white/90 border-b border-slate-200/90 shadow-sm'
            : 'backdrop-blur-sm bg-white/60 border-b border-slate-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo with Hidden 5-Click Admin Trigger */}
          <a
            href="#"
            id="nav-brand-logo"
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center group-hover:border-blue-500 group-hover:shadow-md transition-all">
              <Terminal className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold tracking-wider text-slate-900 group-hover:text-blue-600 transition-colors">
                BEKZOD<span className="text-blue-600">.DEV</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 -mt-1 tracking-widest uppercase font-medium">
                Python Architect
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 border border-slate-200 rounded-full px-3 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                id={`nav-link-${link.id}`}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  activeSection === link.id
                    ? 'text-blue-600 bg-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Controls, Switcher & Toggles */}
          <NavbarActions
            onOpenResume={() => setIsResumeOpen(true)}
            onOpenVisitorModal={() => setIsVisitorModalOpen(true)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            candidateProfile={candidateProfile}
            t={t}
          />
        </div>

        {/* Mobile Dropdown Menu Component */}
        <NavbarMobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navLinks={navLinks}
          activeSection={activeSection}
          onOpenVisitorModal={() => setIsVisitorModalOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
          candidateProfile={candidateProfile}
          t={t}
        />
      </header>
    </>
  );
};
