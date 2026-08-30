import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, FileText, Phone, Mail, MapPin, Send } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../context/LanguageContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { candidateProfile, workExperience, educationList, skillCategories } = usePortfolioData();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handlePrint = () => {
    window.print();
  };

  const getLocalizedWork = (id: string, defRole: string, defCompany: string, defResp: string[]) => {
    let loc = t.timeline.workItems.kwork;
    if (id === 'paynet-crm') loc = t.timeline.workItems.paynet;
    if (id === 'rrr-academy-bot') loc = t.timeline.workItems.rrrAcademy;

    return {
      role: loc?.role || defRole,
      company: loc?.company || defCompany,
      responsibilities: loc?.responsibilities || defResp,
    };
  };

  const getLocalizedEdu = (id: string, defInst: string, defField: string) => {
    let loc = t.timeline.eduItems.school21;
    if (id === 'mohirdev') loc = t.timeline.eduItems.mohirdev;
    if (id === 'pro-unity') loc = t.timeline.eduItems.proUnity;
    if (id === 'it-center') loc = t.timeline.eduItems.itCenter;

    return {
      institution: loc?.institution || defInst,
      field: loc?.field || defField,
    };
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

        {/* Candidate Profile Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">{candidateProfile.name}</h2>
          <p className="text-sm font-mono text-blue-600 font-semibold mb-1">{candidateProfile.primaryTitle}</p>
          <p className="text-xs text-slate-500 mb-3">{candidateProfile.subTitle}</p>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {candidateProfile.location}</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-600" /> {candidateProfile.phone}</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-600" /> {candidateProfile.email}</span>
            <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5 text-blue-600" /> {candidateProfile.telegramHandle}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300">
          <h3 className="text-xs font-mono uppercase text-blue-700 font-bold tracking-wider mb-2">{t.resume.summaryTitle}</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{candidateProfile.summary || t.hero.subtext}</p>
        </div>

        {/* Core Skills (ATS Optimized) */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300">
          <h3 className="text-xs font-mono uppercase text-indigo-700 font-bold tracking-wider mb-2">Technical Proficiencies</h3>
          <div className="space-y-1.5 text-xs font-mono text-slate-700">
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                <span className="font-bold text-slate-900 min-w-[140px]">• {cat.title}:</span>
                <span className="text-slate-600">{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase text-amber-700 font-bold tracking-wider mb-3">{t.resume.experienceTitle}</h3>
          <div className="space-y-4">
            {workExperience.map((exp) => {
              const locWork = getLocalizedWork(exp.id, exp.role, exp.companyOrPlatform, exp.responsibilities);
              return (
                <div key={exp.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-mono font-bold text-slate-900">{locWork.role} — <span className="text-blue-600">{locWork.company}</span></h4>
                    <span className="text-[11px] font-mono text-slate-500">{exp.period}</span>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {locWork.responsibilities.map((r, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase text-indigo-700 font-bold tracking-wider mb-3">{t.resume.educationTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {educationList.map((edu) => {
              const locEdu = getLocalizedEdu(edu.id, edu.institution, edu.field);
              return (
                <div key={edu.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-mono font-bold text-slate-900">{locEdu.institution}</h4>
                    <span className="text-[10px] font-mono text-slate-500">{edu.period}</span>
                  </div>
                  <p className="text-[11px] font-mono text-blue-700">{locEdu.field}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
