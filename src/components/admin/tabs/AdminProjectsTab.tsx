import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { ProjectItem } from '../../../types/portfolio';

interface AdminProjectsTabProps {
  onNewProject: () => void;
  onEditProject: (project: ProjectItem) => void;
  showToast: (msg: string) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({
  onNewProject,
  onEditProject,
  showToast,
}) => {
  const { featuredProjects, deleteProject } = usePortfolioData();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Loyihalar Boshqaruvi ({featuredProjects.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Portfoliodagi barcha loyihalarni tahrirlang, yangi qo'shing yoki o'chiring
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi Loyiha</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {featuredProjects.map((project, idx) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-white">{project.name}</h3>
                <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/60 text-blue-300 text-[10px] font-mono">
                  {project.badge}
                </span>
                <span className="text-xs text-slate-500">({project.timeline})</span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{project.summary}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onEditProject(project)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Tahrirlash"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`"${project.name}" loyihasini o'chirishni tasdiqlaysizmi?`)) {
                    deleteProject(project.id);
                    showToast("🗑️ Loyiha o'chirildi.");
                  }
                }}
                className="p-2 rounded-xl bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/60 text-rose-400 transition-colors cursor-pointer"
                title="O'chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
