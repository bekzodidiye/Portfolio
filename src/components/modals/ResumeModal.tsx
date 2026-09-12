import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, FileText } from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useUIContext } from '../../context/UIContext';
import { ResumeDocumentContent } from './ResumeDocumentContent';

export const ResumeModal: React.FC = () => {
  const { t } = useLanguage();
  const { isResumeOpen, setIsResumeOpen } = useUIContext();
  const { candidateProfile, workExperience, educationList, skillCategories } = usePortfolioData();
  const modalRef = useRef<HTMLDivElement>(null);

  const onClose = () => setIsResumeOpen(false);

  useEffect(() => {
    if (!isResumeOpen) return;

    // Handle ESC and Tab Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on first interactive element or close button
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const closeBtn = modalRef.current.querySelector<HTMLElement>('#resume-modal-close-btn');
        closeBtn?.focus();
      }
    }, 50);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isResumeOpen]);

  if (!isResumeOpen || typeof document === 'undefined') return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn print:bg-white print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div
        ref={modalRef}
        id="resume-printable-area"
        className="relative w-full max-w-3xl rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-2xl max-h-[88vh] overflow-y-auto no-scrollbar print:max-h-none print:shadow-none print:border-none print:w-full print:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Hidden in Print */}
        <button
          id="resume-modal-close-btn"
          onClick={onClose}
          aria-label="Close Resume Modal"
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header - Hidden in Print */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span id="resume-modal-title" className="text-sm font-mono font-bold text-slate-900">
              {t.resume.title}
            </span>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/25 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.resume.printPdf}</span>
          </button>
        </div>

        {/* Printable Resume Content Component */}
        <ResumeDocumentContent
          candidateProfile={candidateProfile}
          workExperience={workExperience}
          educationList={educationList}
          skillCategories={skillCategories}
          t={t}
        />
      </div>
    </div>,
    document.body
  );
};
