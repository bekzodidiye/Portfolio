import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { WorkExperienceItem } from '../types/portfolio';
import { SpotlightCard } from './SpotlightCard';

interface WorkTimelineCardProps {
  exp: WorkExperienceItem;
  delay: string;
  inView: boolean;
}

export const WorkTimelineCard: React.FC<WorkTimelineCardProps> = ({ exp, delay, inView }) => {
  return (
    <div className="relative">
      {/* Node Marker */}
      <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-white border-2 border-blue-600 shadow-md group-hover:scale-125 transition-transform z-10" />

      <SpotlightCard
        style={{
          transform: inView ? 'perspective(1000px) translateY(0) scale(1)' : 'perspective(1000px) translateY(35px) scale(0.95)',
          opacity: inView ? 1 : 0,
          transition: `transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}, opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delay}, border-color 0.3s ease, box-shadow 0.3s ease`,
        }}
        className="p-6 card-3d group"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            {exp.badge}
          </span>
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-600" />
            {exp.period}
          </span>
        </div>

        <h4 className="text-lg font-bold font-mono text-slate-900 group-hover:text-blue-600 transition-colors">
          {exp.role}
        </h4>
        <p className="text-xs font-mono text-amber-700 font-semibold mb-4">{exp.companyOrPlatform}</p>

        {/* Responsibilities */}
        <ul className="space-y-2 mb-4">
          {exp.responsibilities.map((resp, rIdx) => (
            <li key={rIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>{resp}</span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {exp.techTags.map((tag, tIdx) => (
            <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      </SpotlightCard>
    </div>
  );
};
