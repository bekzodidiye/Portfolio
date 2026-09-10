import React from 'react';
import { Bot, Minimize2, Trash2 } from 'lucide-react';

interface AiAssistantHeaderProps {
  candidateName: string;
  language: string;
  onClear: () => void;
  onClose: () => void;
}

export const AiAssistantHeader: React.FC<AiAssistantHeaderProps> = ({
  candidateName,
  language,
  onClear,
  onClose,
}) => {
  return (
    <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-300" />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-mono text-xs font-bold text-white tracking-wide">
              {candidateName} AI
            </h3>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
              24/7 Live
            </span>
          </div>
          <p className="text-[10px] text-slate-300">
            {language === 'uz'
              ? 'Shaxsiy muhandislik maslahatchisi'
              : language === 'ru'
              ? 'Персональный ИИ-ассистент'
              : 'Personal Engineering Rep'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onClear}
          title="Chatni tozalash"
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          title="Kichraytirish"
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
