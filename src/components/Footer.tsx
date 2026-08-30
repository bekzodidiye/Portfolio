import React, { useRef } from 'react';
import { Terminal, Github, Linkedin, Send, ArrowUp } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { candidateProfile, setIsAdminOpen } = usePortfolioData();

  // Secret 5-Click on footer brand logo to trigger Admin Hub
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-100/80 backdrop-blur-md relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Identity (Hidden 5-click easter egg) */}
        <div
          onClick={handleBrandClick}
          className="flex flex-col items-center md:items-start text-center md:text-left cursor-pointer group"
          title="BEKZOD.DEV"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center group-hover:border-blue-400 transition-colors">
              <Terminal className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-mono text-base font-bold text-slate-900 tracking-wider group-hover:text-blue-600 transition-colors">
              BEKZOD<span className="text-blue-600">.DEV</span>
            </span>
          </div>
          <p className="text-xs font-mono text-slate-600">
            {t.footer.roleDesc}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {candidateProfile.location}
          </p>
        </div>

        {/* Quick Social Links */}
        <div className="flex items-center gap-3">
          <a
            href={candidateProfile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={candidateProfile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={candidateProfile.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </a>
          <button
            onClick={scrollToTop}
            aria-label="Scroll To Top"
            className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-all cursor-pointer ml-1 shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Copyright & Architecture notice */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
        <p>© {new Date().getFullYear()} {candidateProfile.name}. {t.footer.rightsReserved}</p>
        <p className="flex items-center gap-1">
          {t.footer.techStackNote}
        </p>
      </div>
    </footer>
  );
};
