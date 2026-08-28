import React from 'react';
import { Calendar } from 'lucide-react';
import { EducationItem } from '../types/portfolio';
import { SpotlightCard } from './SpotlightCard';

interface EduTimelineCardProps {
  edu: EducationItem;
  delay: string;
  inView: boolean;
}

export const EduTimelineCard: React.FC<EduTimelineCardProps> = ({ edu, delay, inView }) => {
  return (
    <div className="relative">
      {/* Node Marker */}
      <div className="absolute -left-[31px] top-6 w-3.5 h-3.5 rounded-full bg-white border-2 border-indigo-600 shadow-md group-hover:scale-125 transition-transform z-10" />

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
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            {edu.status}
          </span>
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-600" />
            {edu.period}
          </span>
        </div>

        <h4 className="text-lg font-bold font-mono text-slate-900 group-hover:text-indigo-600 transition-colors">
          {edu.institution}
        </h4>
        <p className="text-xs font-mono text-blue-700 font-semibold mb-3">{edu.field}</p>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          {edu.description}
        </p>
      </SpotlightCard>
    </div>
  );
};
