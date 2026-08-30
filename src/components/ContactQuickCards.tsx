import React from 'react';
import { Phone, Mail, Send, Copy, Check, Clock, Bot, ArrowUpRight } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { SpotlightCard } from './SpotlightCard';

interface ContactQuickCardsProps {
  bukharaTime: string;
  copiedItem: string | null;
  onCopy: (text: string, label: string) => void;
  phoneLabel: string;
  emailLabel: string;
  telegramLabel: string;
  locationLabel: string;
}

export const ContactQuickCards: React.FC<ContactQuickCardsProps> = ({
  bukharaTime,
  copiedItem,
  onCopy,
  phoneLabel,
  emailLabel,
  telegramLabel,
  locationLabel,
}) => {
  const { candidateProfile } = usePortfolioData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10 perspective-3d">
      {/* 1. Phone */}
      <SpotlightCard className="contact-reveal p-3.5 sm:p-4 card-3d flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">{phoneLabel}</span>
            <p className="text-xs font-mono font-semibold text-slate-900 truncate whitespace-nowrap">
              {candidateProfile.phone}
            </p>
          </div>
        </div>
        <button
          onClick={() => onCopy(candidateProfile.phone, 'phone')}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 cursor-pointer ml-1"
          title="Copy Phone"
          aria-label="Copy Phone"
        >
          {copiedItem === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </SpotlightCard>

      {/* 2. Email */}
      <SpotlightCard className="contact-reveal p-3.5 sm:p-4 card-3d flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">{emailLabel}</span>
            <p className="text-xs font-mono font-semibold text-slate-900 truncate" title={candidateProfile.email}>
              {candidateProfile.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => onCopy(candidateProfile.email, 'email')}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 cursor-pointer ml-1"
          title="Copy Email"
          aria-label="Copy Email"
        >
          {copiedItem === 'email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </SpotlightCard>

      {/* 3. Telegram Direct */}
      <SpotlightCard className="contact-reveal p-3.5 sm:p-4 card-3d flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">{telegramLabel}</span>
            <p className="text-xs font-mono font-semibold text-slate-900 truncate">
              {candidateProfile.telegramHandle}
            </p>
          </div>
        </div>
        <a
          href={candidateProfile.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-blue-50/60 hover:bg-blue-600 text-blue-600 hover:text-white transition-all flex-shrink-0 cursor-pointer ml-1"
          title="Open Telegram Chat"
          aria-label="Open Telegram Chat"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </SpotlightCard>

      {/* 4. Telegram Interactive Bot */}
      <SpotlightCard className="contact-reveal p-3.5 sm:p-4 card-3d flex items-center justify-between min-w-0 border-emerald-300/80 bg-emerald-50/30 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="block text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-wider">AI BOT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs font-mono font-semibold text-slate-900 truncate" title="@my_portfolio_support_bot">
              {candidateProfile.botUsername || '@my_portfolio_support_bot'}
            </p>
          </div>
        </div>
        <a
          href={candidateProfile.botUrl || 'https://t.me/my_portfolio_support_bot'}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm flex-shrink-0 cursor-pointer ml-1"
          title="Start 24/7 AI Bot"
          aria-label="Start 24/7 AI Bot"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </SpotlightCard>

      {/* 5. Location & Clock */}
      <SpotlightCard className="contact-reveal p-3.5 sm:p-4 card-3d flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">{locationLabel}</span>
            <p className="text-xs font-mono font-bold text-amber-700 truncate">
              {bukharaTime || '05:14:00'}
            </p>
          </div>
        </div>
        <div className="p-1.5 flex items-center justify-center flex-shrink-0 ml-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </SpotlightCard>
    </div>
  );
};
