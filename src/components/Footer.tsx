import React from 'react';
import { Terminal, Github, Linkedin, Send, ArrowUp } from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-100/80 backdrop-blur-md relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Identity */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-mono text-base font-bold text-slate-900 tracking-wider">
              BEKZOD<span className="text-blue-600">.DEV</span>
            </span>
          </div>
          <p className="text-xs font-mono text-slate-600">
            {t.footer.roleDesc}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {t.footer.location}
          </p>
        </div>

        {/* Quick Social Links */}
        <div className="flex items-center gap-3">
          <a
            href={CANDIDATE_PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={CANDIDATE_PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-all cursor-pointer"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={CANDIDATE_PROFILE.telegram}
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
            className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 transition-all cursor-pointer ml-2 shadow-sm"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Copyright & Architecture notice */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
        <p>© {new Date().getFullYear()} Bekzod Idiyev. {t.footer.rightsReserved}</p>
        <p className="flex items-center gap-1">
          {t.footer.techStackNote}
        </p>
      </div>
    </footer>
  );
};
