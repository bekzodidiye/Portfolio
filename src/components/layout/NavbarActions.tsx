import React from 'react';
import { Send, Menu, X, Code2, Bot } from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface NavbarActionsProps {
  onOpenResume?: () => void;
  onOpenVisitorModal?: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  candidateProfile: {
    telegram?: string;
    botUrl?: string;
  };
  t: {
    visitorModal: { badgeStatus: string };
    nav: { resumeSpec: string; telegramCta: string };
  };
}

export const NavbarActions: React.FC<NavbarActionsProps> = ({
  onOpenResume,
  onOpenVisitorModal,
  mobileMenuOpen,
  setMobileMenuOpen,
  candidateProfile,
  t,
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* 3-Language Switcher */}
      <LanguageSwitcher />

      {onOpenVisitorModal && (
        <button
          onClick={onOpenVisitorModal}
          id="nav-visitor-btn"
          title={t.visitorModal.badgeStatus}
          className="hidden lg:flex px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg text-slate-600 hover:text-blue-600 bg-slate-100/80 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all items-center gap-1.5 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.visitorModal.badgeStatus}</span>
        </button>
      )}

      {/* Telegram Bot Quick Launcher */}
      <a
        href={candidateProfile.botUrl || 'https://t.me/my_portfolio_support_bot'}
        target="_blank"
        rel="noopener noreferrer"
        id="nav-bot-btn"
        title="Interactive Telegram Assistant Bot"
        className="hidden sm:flex px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 transition-all items-center gap-1.5 cursor-pointer shadow-sm"
      >
        <Bot className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden xl:inline">AI Bot</span>
      </a>

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
        href={candidateProfile.telegram}
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
  );
};
