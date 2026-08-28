import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { ContactFormEditor } from './ContactFormEditor';
import { ContactQuickCards } from './ContactQuickCards';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useGsapReveal<HTMLElement>({
    y: 35,
    duration: 0.85,
    stagger: 0.12,
    start: 'top 85%',
    selector: '.contact-reveal',
  });

  const [bukharaTime, setBukharaTime] = useState<string>('');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Samarkand',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setBukharaTime(new Intl.DateTimeFormat('en-GB', options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedItem(label);
        setTimeout(() => setCopiedItem(null), 2000);
      }).catch(() => {
        setCopiedItem(null);
      });
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="contact-reveal text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.contact.titleBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {t.contact.heading}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
            {t.contact.subheading}
          </p>
        </div>

        {/* Direct Contacts Grid with Spotlight Cards */}
        <ContactQuickCards
          bukharaTime={bukharaTime}
          copiedItem={copiedItem}
          onCopy={handleCopy}
          phoneLabel={t.contact.phoneLabel}
          emailLabel={t.contact.emailLabel}
          telegramLabel={t.contact.telegramLabel}
          locationLabel={t.contact.locationLabel}
        />

        {/* Editor Window with 3D Entrance */}
        <div className="contact-reveal">
          <ContactFormEditor />
        </div>
      </div>
    </section>
  );
};

