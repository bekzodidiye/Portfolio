import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Check, Sparkles, FolderGit2, Link as LinkIcon, Tag } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';

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

  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

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

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.techStack.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tag),
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, idx) => idx !== index),
    }));
  };

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
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form scrollable area */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 pr-1 space-y-4 py-4">
            {/* Title & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Loyiha Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: Buddy Team (AI Match)"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nishon (Badge)
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Masalan: AI & Full-Stack"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kategoriya
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Masalan: Matching & AI Platform"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Muddat / Yil
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="Masalan: 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Demo / Telegram Bot URL
                </label>
                <input
                  type="text"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://t.me/... yoki demo link"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Qisqacha Tavsif (Summary) *
              </label>
              <textarea
                rows={2}
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Loyiha haqida 1-2 jumlalik qisqacha mazmun..."
                className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Architecture */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Arxitektura Bayoni (Architecture details)
              </label>
              <textarea
                rows={2}
                value={formData.architecture}
                onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                placeholder="Asinxron aiogram 3.x, Redis kesh, REST API va h.k."
                className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Tech Stack Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                Texnologiyalar Steki (Tech Stack)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Texnologiya nomi (masalan: Redis, Celery)..."
                  className="flex-1 px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
                >
                  Qo'shish
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-slate-950/40 rounded-xl border border-slate-800">
                {formData.techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-300 text-xs font-mono"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-400 hover:text-rose-400 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.techStack.length === 0 && (
                  <span className="text-xs text-slate-500 italic">Hali teglar qo'shilmagan</span>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Asosiy Imkoniyatlar (Key Features)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                  placeholder="Imkoniyat yozing va Enter bosing..."
                  className="flex-1 px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
                >
                  Qo'shish
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {formData.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
                  >
                    <span className="flex-1 mr-2">• {feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
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
