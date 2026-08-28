import React, { useState } from 'react';
import { Send, Check, Code2, Terminal, Loader2, AlertCircle, ExternalLink, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContactForm } from '../hooks/useContactForm';
import { MagneticButton } from './MagneticButton';

export const ContactFormEditor: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'contact.py' | 'environment.env'>('contact.py');
  
  const {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    honeypot,
    setHoneypot,
    isSubmitting,
    isSubmitted,
    errorMessage,
    directFallbackUrl,
    cooldown,
    handleSubmit,
    resetForm,
  } = useContactForm();

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
      {/* Editor Header with Tabs */}
      <div className="bg-slate-100 px-3 sm:px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-full" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'contact.py'}
            aria-controls="contact-panel-py"
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
            role="tab"
            aria-selected={activeTab === 'environment.env'}
            aria-controls="contact-panel-env"
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
        <div className="text-[11px] font-mono text-slate-500 hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Telegram Bot Gateway v1.0</span>
        </div>
      </div>

      <div className="p-4 sm:p-8 bg-white">
        {activeTab === 'contact.py' ? (
          isSubmitted ? (
            <div id="contact-panel-py" role="tabpanel" className="p-6 sm:p-8 text-center rounded-xl bg-emerald-50 border border-emerald-200 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-900 mb-2">
                {t.contact.successTitle}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                {t.contact.successMsg}
              </p>
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white border border-slate-300 hover:border-blue-500 text-slate-800 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            <form id="contact-panel-py" role="tabpanel" onSubmit={handleSubmit} className="space-y-4">
              {/* Anti-Spam Honeypot Field (Invisible to human users, traps bot crawlers) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_hp">Leave this empty</label>
                <input
                  id="website_hp"
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Error Alert Box with Fallback Trigger */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono space-y-2 animate-fadeIn" role="alert">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                  {directFallbackUrl && (
                    <div className="pt-1 pl-6">
                      <a
                        href={directFallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-sm"
                      >
                        <span>Telegram (@toyneden) orqali yuborish</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name-input" className="block text-xs font-mono text-slate-700 mb-1.5 font-medium">
                    {t.contact.clientNameLabel}: <span className="text-blue-600 font-semibold">str</span>
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.clientNamePlaceholder}
                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-base sm:text-xs text-slate-900 placeholder:text-slate-400 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email-input" className="block text-xs font-mono text-slate-700 mb-1.5 font-medium">
                    {t.contact.emailInputLabel}: <span className="text-blue-600 font-semibold">str</span>
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.emailInputPlaceholder}
                    className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-base sm:text-xs text-slate-900 placeholder:text-slate-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message-input" className="block text-xs font-mono text-slate-700 mb-1.5 font-medium">
                  {t.contact.messageLabel}: <span className="text-blue-600 font-semibold">str</span>
                </label>
                <textarea
                  id="contact-message-input"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full px-3.5 sm:px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white focus:outline-none font-mono text-base sm:text-xs text-slate-900 placeholder:text-slate-400 transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-[11px] sm:text-xs font-mono text-slate-500 flex items-center gap-1">
                  {cooldown > 0 ? (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-amber-700 font-semibold">
                        {language === 'uz'
                          ? `Qayta yuborish: ${cooldown}s`
                          : language === 'ru'
                          ? `Повтор через: ${cooldown}с`
                          : `Cooldown: ${cooldown}s`}
                      </span>
                    </>
                  ) : (
                    <span>{t.contact.sendingNote}</span>
                  )}
                </span>

                <MagneticButton strength={0.3}>
                  <button
                    type="submit"
                    disabled={isSubmitting || cooldown > 0}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          {language === 'uz' ? 'Yuborilmoqda...' : language === 'ru' ? 'Отправка...' : 'Sending...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t.contact.sendBtn}</span>
                      </>
                    )}
                  </button>
                </MagneticButton>
              </div>
            </form>
          )
        ) : (
          <div id="contact-panel-env" role="tabpanel" className="font-mono text-xs text-slate-700 leading-relaxed space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
            <p className="text-slate-400"># Production Environment Configuration & Gateway</p>
            <p className="break-all sm:break-normal">DEV_NAME=<span className="text-emerald-600 font-semibold">"Bekzod Idiyev"</span></p>
            <p className="break-all sm:break-normal">PRIMARY_ROLE=<span className="text-blue-600 font-semibold">"Python Backend Developer"</span></p>
            <p className="break-all sm:break-normal">LOCATION=<span className="text-slate-900 font-semibold">"Bukhara, Uzbekistan"</span></p>
            <p className="break-all sm:break-normal">TELEGRAM_HANDLE=<span className="text-blue-600 font-semibold">"@toyneden"</span></p>
            <p className="break-all sm:break-normal">EMAIL=<span className="text-indigo-600 font-semibold">"Bekzodidiye@gmail.com"</span></p>
            <p className="break-all sm:break-normal">PHONE=<span className="text-amber-700 font-semibold">"+998 94 613 87 86"</span></p>
            <p className="break-all sm:break-normal">GATEWAY_ENDPOINT=<span className="text-emerald-600 font-semibold">"https://api.telegram.org/bot[TOKEN]/sendMessage"</span></p>
            <p className="break-all sm:break-normal">ACTIVE_STATUS=<span className="text-emerald-600 font-semibold">"AVAILABLE_FOR_CONTRACTS"</span></p>
          </div>
        )}
      </div>
    </div>
  );
};
