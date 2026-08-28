import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, FileText, Phone, Mail, MapPin, Send } from 'lucide-react';
import { CANDIDATE_PROFILE, WORK_EXPERIENCE, EDUCATION_LIST } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn"
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-2xl max-h-[88vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Resume Modal"
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-mono font-bold text-slate-900">{t.resume.title}</span>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/25 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.resume.printPdf}</span>
          </button>
        </div>

        {/* Candidate Profile Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-mono text-slate-900">{CANDIDATE_PROFILE.name}</h2>
          <p className="text-sm font-mono text-blue-600 font-semibold mb-1">{t.hero.typewriter[0]}</p>
          <p className="text-xs text-slate-500 mb-3">{t.hero.typewriter[1]}</p>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {CANDIDATE_PROFILE.location}</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-600" /> {CANDIDATE_PROFILE.phone}</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-600" /> {CANDIDATE_PROFILE.email}</span>
            <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5 text-blue-600" /> {CANDIDATE_PROFILE.telegramHandle}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h3 className="text-xs font-mono uppercase text-blue-700 font-bold tracking-wider mb-2">{t.resume.summaryTitle}</h3>
          <p className="text-xs text-slate-700 leading-relaxed">{t.hero.subtext}</p>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase text-amber-700 font-bold tracking-wider mb-3">{t.resume.experienceTitle}</h3>
          <div className="space-y-4">
            {WORK_EXPERIENCE.map((exp) => {
              const locWork = getLocalizedWork(exp.id, exp.role, exp.companyOrPlatform, exp.responsibilities);
              return (
                <div key={exp.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
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
            {EDUCATION_LIST.map((edu) => {
              const locEdu = getLocalizedEdu(edu.id, edu.institution, edu.field);
              return (
                <div key={edu.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
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
