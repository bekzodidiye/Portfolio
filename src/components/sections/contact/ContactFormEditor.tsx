import React, { useState } from 'react';
import { Send, Code2, Terminal, Loader2, AlertCircle, ExternalLink, Clock } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useContactForm } from '../../../hooks/useContactForm';
import { MagneticButton } from '../../ui/MagneticButton';
import { ContactEnvViewer } from './ContactEnvViewer';
import { ContactSuccessView } from './ContactSuccessView';
import { ContactFormFields } from './ContactFormFields';

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
            <ContactSuccessView
              title={t.contact.successTitle}
              message={t.contact.successMsg}
              sendAnotherText={t.contact.sendAnother}
              onReset={resetForm}
            />
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

              <ContactFormFields
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                message={message}
                setMessage={setMessage}
                labels={{
                  clientNameLabel: t.contact.clientNameLabel,
                  clientNamePlaceholder: t.contact.clientNamePlaceholder,
                  emailInputLabel: t.contact.emailInputLabel,
                  emailInputPlaceholder: t.contact.emailInputPlaceholder,
                  messageLabel: t.contact.messageLabel,
                  messagePlaceholder: t.contact.messagePlaceholder,
                }}
              />

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
          <ContactEnvViewer />
        )}
      </div>
    </div>
  );
};
