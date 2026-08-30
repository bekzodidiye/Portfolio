import React from 'react';
import { Briefcase, GraduationCap, Clock } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { WorkExperienceItem, EducationItem } from '../types/portfolio';
import { useLanguage } from '../context/LanguageContext';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { WorkTimelineCard } from './WorkTimelineCard';
import { EduTimelineCard } from './EduTimelineCard';

export const TimelineSection: React.FC = () => {
  const { t } = useLanguage();
  const { workExperience, educationList } = usePortfolioData();
  const sectionRef = useGsapReveal<HTMLElement>({
    y: 35,
    duration: 0.85,
    stagger: 0.12,
    start: 'top 85%',
    selector: '.timeline-reveal',
  });

  const getLocalizedWork = (work: WorkExperienceItem) => {
    let loc = t.timeline.workItems.kwork;
    if (work.id === 'paynet-crm') loc = t.timeline.workItems.paynet;
    if (work.id === 'rrr-academy-bot') loc = t.timeline.workItems.rrrAcademy;

    return {
      ...work,
      role: loc?.role || work.role,
      companyOrPlatform: loc?.company || work.companyOrPlatform,
      badge: loc?.badge || work.badge,
      period: loc?.period || work.period,
      responsibilities: loc?.responsibilities || work.responsibilities,
    };
  };

  const getLocalizedEdu = (edu: EducationItem) => {
    let loc = t.timeline.eduItems.school21;
    if (edu.id === 'mohirdev') loc = t.timeline.eduItems.mohirdev;
    if (edu.id === 'pro-unity') loc = t.timeline.eduItems.proUnity;
    if (edu.id === 'it-center') loc = t.timeline.eduItems.itCenter;

    return {
      ...edu,
      institution: loc?.institution || edu.institution,
      field: loc?.field || edu.field,
      period: loc?.period || edu.period,
      status: loc?.status || edu.status,
      description: loc?.description || edu.description,
    };
  };

  return (
    <section ref={sectionRef} id="experience" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="timeline-reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.timeline.titleBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {t.timeline.heading}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
            {t.timeline.subheading}
          </p>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 relative">
          {/* Left Column: Work Experience */}
          <div className="timeline-reveal">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-slate-900">{t.timeline.workTitle}</h3>
                <p className="text-xs text-slate-500">{t.timeline.workSubtitle}</p>
              </div>
            </div>

            <div className="space-y-6 relative border-l-2 border-blue-200 ml-4 pl-6">
              {workExperience.map((rawExp, idx) => {
                const exp = getLocalizedWork(rawExp);
                const delay = `${idx * 140 + 100}ms`;
                return (
                  <WorkTimelineCard
                    key={exp.id}
                    exp={exp}
                    delay={delay}
                    inView={true}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Column: Educational Journey */}
          <div className="timeline-reveal">
            <div className="flex items-center gap-3 mb-8 pb-3 border-b border-slate-200">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-mono text-slate-900">{t.timeline.eduTitle}</h3>
                <p className="text-xs text-slate-500">{t.timeline.eduSubtitle}</p>
              </div>
            </div>

            <div className="space-y-6 relative border-l-2 border-indigo-200 ml-4 pl-6">
              {educationList.map((rawEdu, idx) => {
                const edu = getLocalizedEdu(rawEdu);
                const delay = `${idx * 140 + 100}ms`;
                return (
                  <EduTimelineCard
                    key={edu.id}
                    edu={edu}
                    delay={delay}
                    inView={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
