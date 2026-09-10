import React from 'react';
import { FolderGit2, Link as LinkIcon } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';

interface ProjectBasicFieldsProps {
  formData: Omit<ProjectItem, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<ProjectItem, 'id'>>>;
}

export const ProjectBasicFields: React.FC<ProjectBasicFieldsProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <>
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
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))}
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
          onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
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
          onChange={(e) => setFormData((prev) => ({ ...prev, architecture: e.target.value }))}
          placeholder="Asinxron aiogram 3.x, Redis kesh, REST API va h.k."
          className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
    </>
  );
};
