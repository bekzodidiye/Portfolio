import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { WorkExperienceItem, EducationItem } from '../../../types/portfolio';

interface AdminTimelineTabProps {
  onAddWork: () => void;
  onEditWork: (work: WorkExperienceItem) => void;
  onAddEdu: () => void;
  onEditEdu: (edu: EducationItem) => void;
  showToast: (msg: string) => void;
}

export const AdminTimelineTab: React.FC<AdminTimelineTabProps> = ({
  onAddWork,
  onEditWork,
  onAddEdu,
  onEditEdu,
  showToast,
}) => {
  const { workExperience, deleteWorkExperience, educationList, deleteEducation } = usePortfolioData();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Ish Tajribasi va Ta'lim
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Kompaniyalar, platformalar, universitet va kurslar ro'yxatini boshqaring
        </p>
      </div>

      {/* Work Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
            💼 Ish Tajribasi ({workExperience.length})
          </h3>
          <button
            onClick={onAddWork}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ish Joyi Qo'shish</span>
          </button>
        </div>

        <div className="space-y-3">
          {workExperience.map((work) => (
            <div key={work.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{work.role}</span>
                  <span className="text-xs text-slate-400">@ {work.companyOrPlatform}</span>
                  <span className="text-xs text-slate-500 font-mono">({work.period})</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-0.5 list-disc list-inside">
                  {work.responsibilities.slice(0, 2).map((r, i) => (
                    <li key={i} className="truncate">{r}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEditWork(work)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
                      deleteWorkExperience(work.id);
                      showToast("🗑️ Ish tajribasi o'chirildi.");
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
            🎓 Ta'lim & Muassasalar ({educationList.length})
          </h3>
          <button
            onClick={onAddEdu}
            className="px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ta'lim Qo'shish</span>
          </button>
        </div>

        <div className="space-y-3">
          {educationList.map((edu) => (
            <div key={edu.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{edu.institution}</span>
                  <span className="text-xs text-blue-400 font-mono">({edu.period})</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-[10px] text-blue-300">{edu.status}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{edu.field}</p>
                <p className="text-xs text-slate-400">{edu.description}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEditEdu(edu)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
                      deleteEducation(edu.id);
                      showToast("🗑️ Ta'lim o'chirildi.");
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-950/30 text-rose-400 hover:bg-rose-900/60 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
