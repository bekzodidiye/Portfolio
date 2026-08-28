import React, { useState } from 'react';
import { Send, Check, Code2, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import { MagneticButton } from './MagneticButton';

export const ContactFormEditor: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'contact.py' | 'environment.env'>('contact.py');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ['#2563EB', '#4F46E5', '#D97706'] });
    setIsSubmitted(true);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
      {/* Editor Header with Tabs */}
      <div className="bg-slate-100 px-3 sm:px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-full">
          <button
            onClick={() => setActiveTab('contact.py')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-t text-xs font-mono flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'contact.py'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">contact_handler.py</span>
            <span className="sm:hidden">contact.py</span>
          </button>
          <button
            onClick={() => setActiveTab('environment.env')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-t text-xs font-mono flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'environment.env'
                ? 'bg-white text-amber-700 border-t-2 border-amber-600 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">production.env</span>
            <span className="sm:hidden">.env</span>
          </button>
        </div>
        <div className="text-[11px] font-mono text-slate-400 hidden sm:block shrink-0">Async API Gateway</div>
      </div>

      <div className="p-4 sm:p-8 bg-white">
        {activeTab === 'contact.py' ? (
          isSubmitted ? (
            <div className="p-6 sm:p-8 text-center rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-900 mb-2">{t.contact.successTitle}</h3>
              <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-md mx-auto mb-6">{t.contact.successMsg}</p>
              <button
                onClick={() => { setIsSubmitted(false); setName(''); setEmail(''); setMessage(''); }}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
              >
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1.5">
                    {t.contact.clientNameLabel}: <span className="text-blue-600 font-semibold">str</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.clientNamePlaceholder}
                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-600 mb-1.5">
                    {t.contact.emailInputLabel}: <span className="text-blue-600 font-semibold">str</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.emailInputPlaceholder}
                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-600 mb-1.5">
                  {t.contact.messageLabel}: <span className="text-blue-600 font-semibold">str</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-colors resize-none"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-[11px] sm:text-xs font-mono text-slate-500">{t.contact.sendingNote}</span>
                <MagneticButton strength={0.3}>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.contact.sendBtn}</span>
                  </button>
                </MagneticButton>
              </div>
            </form>
          )
        ) : (
          <div className="font-mono text-xs text-slate-700 leading-relaxed space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            <p className="text-slate-400"># Production Environment Configuration</p>
            <p className="break-all sm:break-normal">DEV_NAME=<span className="text-emerald-600 font-semibold">"Bekzod Idiyev"</span></p>
            <p className="break-all sm:break-normal">PRIMARY_ROLE=<span className="text-blue-600 font-semibold">"Python Backend Developer"</span></p>
            <p className="break-all sm:break-normal">LOCATION=<span className="text-slate-900">"Bukhara, Uzbekistan"</span></p>
            <p className="break-all sm:break-normal">TELEGRAM_HANDLE=<span className="text-blue-600">"@toyneden"</span></p>
            <p className="break-all sm:break-normal">EMAIL=<span className="text-indigo-600">"Bekzodidiye@gmail.com"</span></p>
            <p className="break-all sm:break-normal">PHONE=<span className="text-amber-700">"+998 94 613 87 86"</span></p>
            <p className="break-all sm:break-normal">ACTIVE_STATUS=<span className="text-emerald-600 font-semibold">"AVAILABLE_FOR_CONTRACTS"</span></p>
          </div>
        )}
      </div>
    </div>
  );
};
