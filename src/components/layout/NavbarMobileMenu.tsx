import React from 'react';

interface NavLinkItem {
  id: string;
  name: string;
  href: string;
}

interface NavbarMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
  activeSection: string;
  onOpenVisitorModal?: () => void;
  onOpenResume?: () => void;
  candidateProfile: {
    telegram?: string;
    telegramHandle?: string;
  };
  t: {
    visitorModal: { badgeStatus: string };
    nav: { resumeSpec: string };
  };
}

export const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
  activeSection,
  onOpenVisitorModal,
  onOpenResume,
  candidateProfile,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="nav-mobile-menu"
      className="md:hidden border-b border-slate-200 px-6 py-5 flex flex-col gap-3 backdrop-blur-xl bg-white/95 shadow-lg"
    >
      {navLinks.map((link) => (
        <a
          key={link.id}
          href={link.href}
          onClick={onClose}
          className={`py-2 text-sm font-mono font-medium transition-colors ${
            activeSection === link.id ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          &gt; {link.name}
        </a>
      ))}
      <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
        {onOpenVisitorModal && (
          <button
            onClick={() => {
              onClose();
              onOpenVisitorModal();
            }}
            className="py-2.5 px-4 text-center font-mono text-xs font-semibold rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.visitorModal.badgeStatus}</span>
          </button>
        )}

        {onOpenResume && (
          <button
            onClick={() => {
              onClose();
              onOpenResume();
            }}
            className="py-2.5 px-4 text-center font-mono text-xs font-semibold rounded-lg bg-slate-100 border border-slate-200 text-slate-800 cursor-pointer"
          >
            {t.nav.resumeSpec}
          </button>
        )}

        <a
          href={candidateProfile.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-4 text-center font-mono text-xs font-semibold rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/30"
        >
          Telegram: {candidateProfile.telegramHandle}
        </a>
      </div>
    </div>
  );
};
