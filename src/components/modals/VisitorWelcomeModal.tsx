import React from 'react';
import { User, Sparkles, ArrowRight, ShieldCheck, X, Terminal } from 'lucide-react';
import { VisitorToast } from './VisitorToast';
import { VisitorRoleSelector } from './VisitorRoleSelector';
import { useVisitorModal } from './useVisitorModal';

interface VisitorWelcomeModalProps {
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export function VisitorWelcomeModal({
  isOpenOverride,
  onCloseOverride,
}: VisitorWelcomeModalProps) {
  const {
    isOpen,
    name,
    setName,
    selectedRole,
    setSelectedRole,
    isSubmitting,
    toastMessage,
    setToastMessage,
    handleSubmit,
    handleSkip,
    t,
  } = useVisitorModal({ isOpenOverride, onCloseOverride });

  return (
    <>
      <VisitorToast message={toastMessage} onClose={() => setToastMessage(null)} />

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
            <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-blue-500/15 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 w-52 h-52 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <Terminal className="w-3.5 h-3.5" />
                <span>{t.visitorModal.badge}</span>
              </div>

              <button
                type="button"
                onClick={handleSkip}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title={t.visitorModal.skipBtn}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <VisitorRoleSelector
                label={t.visitorModal.roleLabel}
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                roleLabels={t.visitorModal.roles}
              />

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Ma'lumotlar xavfsiz va faqat muallif bilan tanishuv uchun xizmat qiladi.</span>
              </div>

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
                      <span>{t.visitorModal.submitBtn}</span>
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
