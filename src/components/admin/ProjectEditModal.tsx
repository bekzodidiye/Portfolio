import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, FolderGit2 } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';
import { ProjectBasicFields } from './ProjectBasicFields';
import { ProjectTagsInput } from './ProjectTagsInput';
import { ProjectFeaturesInput } from './ProjectFeaturesInput';

interface ProjectEditModalProps {
  isOpen: boolean;
  project?: ProjectItem | null;
  onClose: () => void;
  onSave: (project: Omit<ProjectItem, 'id'>, id?: string) => void;
}

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<ProjectItem, 'id'>>({
    name: '',
    category: '',
    timeline: '2026',
    techStack: [],
    summary: '',
    keyFeatures: [],
    architecture: '',
    githubUrl: '',
    demoUrl: '',
    badge: 'Production Ready',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        category: project.category || '',
        timeline: project.timeline || '2026',
        techStack: [...(project.techStack || [])],
        summary: project.summary || '',
        keyFeatures: [...(project.keyFeatures || [])],
        architecture: project.architecture || '',
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        badge: project.badge || 'Active',
      });
    } else {
      setFormData({
        name: '',
        category: 'Telegram Bot & API Engine',
        timeline: '2026',
        techStack: ['Python 3.12', 'FastAPI', 'PostgreSQL', 'Docker'],
        summary: '',
        keyFeatures: [],
        architecture: '',
        githubUrl: 'https://github.com/bekzodidiye',
        demoUrl: '',
        badge: 'New Project',
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData, project?.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {project ? 'Loyihani Tahrirlash' : 'Yangi Loyiha Qo\'shish'}
                </h3>
                <p className="text-xs text-slate-400">
                  Loyiha tavsifi, texnologik steki va havolalarini kiriting
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form scrollable area */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 pr-1 space-y-4 py-4">
            <ProjectBasicFields formData={formData} setFormData={setFormData} />

            <ProjectTagsInput
              techStack={formData.techStack}
              onChange={(techStack) => setFormData((prev) => ({ ...prev, techStack }))}
            />

            <ProjectFeaturesInput
              keyFeatures={formData.keyFeatures}
              onChange={(keyFeatures) => setFormData((prev) => ({ ...prev, keyFeatures }))}
            />

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{project ? 'Saqlash' : 'Loyiha Qo\'shish'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
