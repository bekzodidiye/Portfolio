import React from 'react';
import { Phone, Mail, Send, Copy, Check, Clock } from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/portfolioData';
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 perspective-3d">
      <SpotlightCard className="contact-reveal p-4 card-3d flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{phoneLabel}</span>
            <p className="text-xs font-mono font-semibold text-slate-900">{CANDIDATE_PROFILE.phone}</p>
          </div>
        </div>
        <button
          onClick={() => onCopy(CANDIDATE_PROFILE.phone, 'phone')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          title="Copy Phone"
        >
          {copiedItem === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </SpotlightCard>

      <SpotlightCard className="contact-reveal p-4 card-3d flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Mail className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-mono text-slate-500 uppercase">{emailLabel}</span>
            <p className="text-xs font-mono font-semibold text-slate-900 truncate">{CANDIDATE_PROFILE.email}</p>
          </div>
        </div>
        <button
          onClick={() => onCopy(CANDIDATE_PROFILE.email, 'email')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
          title="Copy Email"
        >
          {copiedItem === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </SpotlightCard>

      <SpotlightCard className="contact-reveal p-4 card-3d flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{telegramLabel}</span>
            <p className="text-xs font-mono font-semibold text-slate-900">{CANDIDATE_PROFILE.telegramHandle}</p>
          </div>
        </div>
        <a
          href={CANDIDATE_PROFILE.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
          title="Open Telegram"
        >
          <Send className="w-3.5 h-3.5" />
        </a>
      </SpotlightCard>

      <SpotlightCard className="contact-reveal p-4 card-3d flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase">{locationLabel}</span>
            <p className="text-xs font-mono font-bold text-amber-700">{bukharaTime || '05:14:00'}</p>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </SpotlightCard>
    </div>
  );
};
