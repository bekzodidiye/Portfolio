import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Rocket,
  Code2,
  Smile,
  X,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { collectVisitorTelemetry } from '../services/visitorTelemetry';
import { sendVisitorNotification } from '../services/telegramService';

const VISITOR_NAME_KEY = 'portfolio_visitor_name';
const VISITOR_ROLE_KEY = 'portfolio_visitor_role';
const VISITOR_ACK_KEY = 'portfolio_visitor_acknowledged';

interface VisitorWelcomeModalProps {
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export function VisitorWelcomeModal({
  isOpenOverride,
  onCloseOverride,
}: VisitorWelcomeModalProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('recruiter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize: Check if user already acknowledged
  useEffect(() => {
    if (typeof isOpenOverride === 'boolean') {
      setIsOpen(isOpenOverride);
      return;
    }

    try {
      const acknowledged = localStorage.getItem(VISITOR_ACK_KEY);
      const existingName = localStorage.getItem(VISITOR_NAME_KEY);
      if (existingName) {
        setName(existingName);
      }

      if (!acknowledged) {
        // Show modal after gentle delay for smooth initial page render
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 750);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, [isOpenOverride]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
      });
    } catch {
      // ignore
    }
  };

  const handleFinish = async (visitorName: string, roleKey: string, isAnon: boolean) => {
    setIsSubmitting(true);

    try {
      // 1. Mark as acknowledged in storage
      localStorage.setItem(VISITOR_ACK_KEY, 'true');
      if (!isAnon && visitorName) {
        localStorage.setItem(VISITOR_NAME_KEY, visitorName);
        localStorage.setItem(VISITOR_ROLE_KEY, roleKey);
      }

      // 2. Map role title
      const roleTitle = roleKey ? (t.visitorModal.roles as any)[roleKey] || roleKey : undefined;

      // 3. Collect comprehensive telemetry
      const telemetry = await collectVisitorTelemetry(
        isAnon ? 'Anonim' : visitorName,
        roleTitle,
        language
      );

      // 4. Send background notification to Telegram bot
      sendVisitorNotification(telemetry).catch((err) =>
        console.warn('Visitor background telemetry dispatch:', err)
      );

      // 5. Trigger feedback
      if (!isAnon && visitorName) {
        triggerCelebration();
        setToastMessage(t.visitorModal.toastIntro.replace('{name}', visitorName));
      } else {
        setToastMessage(t.visitorModal.toastAnon);
      }

      // Auto clear toast after 4.5 seconds
      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    } catch (e) {
      console.error('Error during visitor modal submit:', e);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
      if (onCloseOverride) {
        onCloseOverride();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length > 0) {
      handleFinish(trimmed, selectedRole, false);
    } else {
      handleFinish('Anonim', selectedRole, true);
    }
  };

  const handleSkip = () => {
    handleFinish('Anonim', 'guest', true);
  };

  const roleOptions = [
    { key: 'recruiter', label: t.visitorModal.roles.recruiter, icon: Briefcase },
    { key: 'client', label: t.visitorModal.roles.client, icon: Rocket },
    { key: 'developer', label: t.visitorModal.roles.developer, icon: Code2 },
    { key: 'guest', label: t.visitorModal.roles.guest, icon: Smile },
  ];

  return (
    <>
      {/* Welcome Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-blue-500/30 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm"
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
            {toastMessage}
          </p>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-auto"
            aria-label="Close message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Welcome Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="visitor-modal-title"
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient High-Tech Glow Effects */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-52 h-52 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Header / Protocol Badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <Terminal className="w-3.5 h-3.5" />
                <span>{t.visitorModal.badge}</span>
              </div>

              <button
                type="button"
                onClick={handleSkip}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title={t.visitorModal.skipBtn}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Introduction */}
            <div className="space-y-1.5 mb-6">
              <h2
                id="visitor-modal-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2"
              >
                <span>{t.visitorModal.title}</span>
                <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.visitorModal.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="visitor-name-input"
                  className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide"
                >
                  {t.visitorModal.nameLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="visitor-name-input"
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.visitorModal.namePlaceholder}
                    maxLength={100}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all"
                  />
                </div>
              </div>

              {/* Role Selection Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  {t.visitorModal.roleLabel}
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {roleOptions.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedRole(item.key)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 shadow-sm'
                            : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 ${
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Security & Privacy Micro-Note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Ma'lumotlar xavfsiz va faqat muallif bilan tanishuv uchun xizmat qiladi.</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.visitorModal.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{name.trim() ? t.visitorModal.submitBtn : t.visitorModal.submitBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
                >
                  {t.visitorModal.skipBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
