import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { TerminalCliWindow } from './TerminalCliWindow';

export const TerminalAbout: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useGsapReveal<HTMLElement>({
    y: 35,
    duration: 0.85,
    stagger: 0.15,
    start: 'top 85%',
    selector: '.about-reveal',
  });

  return (
    <section ref={sectionRef} id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="about-reveal text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-3">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>{t.terminal.titleBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {t.terminal.heading}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
            {t.terminal.subheading}
          </p>
        </div>

        <div className="about-reveal">
          <TerminalCliWindow />
        </div>
      </div>
    </section>
  );
};
