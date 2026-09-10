import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { CandidateProfile, WorkExperienceItem, EducationItem, SkillCategory } from '../../types/portfolio';

interface ResumeDocumentContentProps {
  candidateProfile: CandidateProfile;
  workExperience: WorkExperienceItem[];
  educationList: EducationItem[];
  skillCategories: SkillCategory[];
  t: {
    hero: { subtext: string };
    resume: {
      summaryTitle: string;
      experienceTitle: string;
      educationTitle: string;
    };
    timeline: {
      workItems: Record<string, { role?: string; company?: string; responsibilities?: string[] }>;
      eduItems: Record<string, { institution?: string; field?: string }>;
    };
  };
}

export const ResumeDocumentContent: React.FC<ResumeDocumentContentProps> = ({
  candidateProfile,
  workExperience,
  educationList,
  skillCategories,
  t,
}) => {
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

  return (
    <>
      {/* Candidate Profile Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
          {candidateProfile.name}
        </h2>
        <p className="text-sm font-mono text-blue-600 font-semibold mb-1">
          {candidateProfile.primaryTitle}
        </p>
        <p className="text-xs text-slate-500 mb-3">{candidateProfile.subTitle}</p>

        <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600" /> {candidateProfile.location}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-blue-600" /> {candidateProfile.phone}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-indigo-600" /> {candidateProfile.email}
          </span>
          <span className="flex items-center gap-1">
            <Send className="w-3.5 h-3.5 text-blue-600" /> {candidateProfile.telegramHandle}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300">
        <h3 className="text-xs font-mono uppercase text-blue-700 font-bold tracking-wider mb-2">
          {t.resume.summaryTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {candidateProfile.summary || t.hero.subtext}
        </p>
      </div>

      {/* Core Skills (ATS Optimized) */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300">
        <h3 className="text-xs font-mono uppercase text-indigo-700 font-bold tracking-wider mb-2">
          Technical Proficiencies
        </h3>
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
        <h3 className="text-xs font-mono uppercase text-amber-700 font-bold tracking-wider mb-3">
          {t.resume.experienceTitle}
        </h3>
        <div className="space-y-4">
          {workExperience.map((exp) => {
            const locWork = getLocalizedWork(
              exp.id,
              exp.role,
              exp.companyOrPlatform,
              exp.responsibilities
            );
            return (
              <div
                key={exp.id}
                className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-mono font-bold text-slate-900">
                    {locWork.role} — <span className="text-blue-600">{locWork.company}</span>
                  </h4>
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
        <h3 className="text-xs font-mono uppercase text-indigo-700 font-bold tracking-wider mb-3">
          {t.resume.educationTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {educationList.map((edu) => {
            const locEdu = getLocalizedEdu(edu.id, edu.institution, edu.field);
            return (
              <div
                key={edu.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-mono font-bold text-slate-900">
                    {locEdu.institution}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">{edu.period}</span>
                </div>
                <p className="text-[11px] font-mono text-blue-700">{locEdu.field}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
