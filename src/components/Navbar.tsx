import React, { useState, useEffect } from 'react';
import { Terminal, Send, Menu, X, Code2 } from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume }) => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

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
          {/* Brand Logo */}
          <a
            href="#"
            id="nav-brand-logo"
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

        {/* Action Controls & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 3-Language Switcher */}
          <LanguageSwitcher />

          {onOpenResume && (
            <button
              onClick={onOpenResume}
              id="nav-resume-btn"
              className="hidden sm:flex px-3 py-1.5 text-xs font-mono font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 transition-all items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.nav.resumeSpec}</span>
            </button>
          )}

          <a
            href={CANDIDATE_PROFILE.telegram}
            target="_blank"
            rel="noopener noreferrer"
            id="nav-telegram-cta"
            className="hidden sm:flex px-3.5 py-2 text-xs font-mono font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30 items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.nav.telegramCta}</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="nav-mobile-toggle"
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-menu"
          className="md:hidden border-b border-slate-200 px-6 py-5 flex flex-col gap-3 backdrop-blur-xl bg-white/95 shadow-lg"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 text-sm font-mono font-medium transition-colors ${
                activeSection === link.id ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              &gt; {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {onOpenResume && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="py-2.5 px-4 text-center font-mono text-xs font-semibold rounded-lg bg-slate-100 border border-slate-200 text-slate-800"
              >
                {t.nav.resumeSpec}
              </button>
            )}
            <a
              href={CANDIDATE_PROFILE.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 text-center font-mono text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/30"
            >
              Telegram: @toyneden
            </a>
          </div>
        </div>
      )}
      </header>
    </>
  );
};
