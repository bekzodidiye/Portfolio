import React, { useState } from 'react';
import { WorkExperienceItem } from '../../types/portfolio';
import { WorkExperienceRespList } from './WorkExperienceRespList';

interface WorkExperienceFormProps {
  initialData?: WorkExperienceItem | null;
  onSave: (item: Omit<WorkExperienceItem, 'id'>, id?: string) => void;
  onClose: () => void;
}

export const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [workRole, setWorkRole] = useState(initialData?.role || '');
  const [workCompany, setWorkCompany] = useState(initialData?.companyOrPlatform || 'Kwork (Freelance Market)');
  const [workPeriod, setWorkPeriod] = useState(initialData?.period || '2026 – Present');
  const [workBadge, setWorkBadge] = useState(initialData?.badge || 'Delivered Projects');
  const [workRespList, setWorkRespList] = useState<string[]>(initialData?.responsibilities || []);
  const [workTechTags, setWorkTechTags] = useState<string[]>(
    initialData?.techTags || ['Python', 'FastAPI', 'PostgreSQL']
  );
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !workTechTags.includes(tagInput.trim())) {
      setWorkTechTags([...workTechTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setWorkTechTags(workTechTags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workRole.trim() || !workCompany.trim()) return;
    onSave(
      {
        role: workRole,
        companyOrPlatform: workCompany,
        period: workPeriod,
        badge: workBadge || undefined,
        responsibilities: workRespList,
        techTags: workTechTags,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 space-y-4 py-4 pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Lavozim (Role) *</label>
          <input
            type="text"
            required
            value={workRole}
            onChange={(e) => setWorkRole(e.target.value)}
            placeholder="Masalan: Backend Developer"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Kompaniya / Platforma *</label>
          <input
            type="text"
            required
            value={workCompany}
            onChange={(e) => setWorkCompany(e.target.value)}
            placeholder="Masalan: Kwork, Paynet CRM"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Davr (Period)</label>
          <input
            type="text"
            value={workPeriod}
            onChange={(e) => setWorkPeriod(e.target.value)}
            placeholder="Masalan: 2026 – Present"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nishon (Badge)</label>
          <input
            type="text"
            value={workBadge}
            onChange={(e) => setWorkBadge(e.target.value)}
            placeholder="Masalan: 8+ Delivered Projects"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Tech Tags */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Texnologiyalar</label>
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
            placeholder="Texnologiya yozing (masalan: Django)..."
            className="flex-1 px-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs cursor-pointer hover:bg-slate-700"
          >
            Qo'shish
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {workTechTags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
              {t}
              <button type="button" onClick={() => handleRemoveTag(t)} className="text-rose-400 cursor-pointer">×</button>
            </span>
          ))}
        </div>
      </div>

      <WorkExperienceRespList
        responsibilities={workRespList}
        onChange={setWorkRespList}
      />

      <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          Saqlash
        </button>
      </div>
    </form>
  );
};
