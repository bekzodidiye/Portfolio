import React from 'react';
import { Send, Sparkles, ArrowUpRight } from 'lucide-react';
import { Language } from '../../types/language';

interface AiAssistantInputProps {
  candidateTelegram: string;
  language: Language;
  inputVal: string;
  setInputVal: (val: string) => void;
  isTyping: boolean;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const AiAssistantInput: React.FC<AiAssistantInputProps> = ({
  candidateTelegram,
  language,
  inputVal,
  setInputVal,
  isTyping,
  onSubmit,
  inputRef,
}) => {
  return (
    <>
      {/* Quick Lead Note */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
          <Sparkles className="w-3 h-3 text-amber-600" />
          {language === 'uz' ? 'Loyihangiz bormi?' : language === 'ru' ? 'Есть проект?' : 'Got a project?'}
        </span>
        <a
          href={candidateTelegram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-semibold font-mono flex items-center gap-1"
        >
          <span>Telegramda yozish</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            language === 'uz'
              ? 'Savolingizni yozing...'
              : language === 'ru'
              ? 'Напишите ваш вопрос...'
              : 'Type your question...'
          }
          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-500/30 cursor-pointer active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </>
  );
};
