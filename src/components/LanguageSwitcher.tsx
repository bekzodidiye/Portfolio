import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types/language';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, options } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((o) => o.code === language) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Desktop Segmented Control & Dropdown Toggle */}
      <div className="hidden lg:flex items-center bg-slate-100/90 border border-slate-200/80 rounded-lg p-0.5 shadow-sm">
        {options.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLanguage(opt.code)}
            className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-all duration-200 flex items-center gap-1 cursor-pointer ${
              language === opt.code
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60 font-bold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <span>{opt.flag}</span>
            <span>{opt.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Compact Dropdown Button for Mobile/Tablet */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Change Language"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentOption.flag}</span>
          <span className="font-semibold">{currentOption.shortLabel}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 animate-fadeIn">
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`w-full px-3 py-2 text-xs font-mono text-left flex items-center justify-between transition-colors ${
                  language === opt.code
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{opt.flag}</span>
                  <span>{opt.label}</span>
                </div>
                {language === opt.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
