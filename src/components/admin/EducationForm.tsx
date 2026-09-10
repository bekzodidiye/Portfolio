import React, { useState } from 'react';
import { EducationItem } from '../../types/portfolio';

interface EducationFormProps {
  initialData?: EducationItem | null;
  onSave: (item: Omit<EducationItem, 'id'>, id?: string) => void;
  onClose: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [eduInstitution, setEduInstitution] = useState(initialData?.institution || 'School 21');
  const [eduPeriod, setEduPeriod] = useState(initialData?.period || '2025 – Present');
  const [eduField, setEduField] = useState(
    initialData?.field || 'Backend Systems Engineering & Data Science'
  );
  const [eduStatus, setEduStatus] = useState(initialData?.status || 'In Progress');
  const [eduDesc, setEduDesc] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduInstitution.trim() || !eduField.trim()) return;
    onSave(
      {
        institution: eduInstitution,
        period: eduPeriod,
        field: eduField,
        status: eduStatus,
        description: eduDesc,
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 space-y-4 py-4 pr-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Muassasa (Institution) *</label>
          <input
            type="text"
            required
            value={eduInstitution}
            onChange={(e) => setEduInstitution(e.target.value)}
            placeholder="Masalan: School 21, Mohirdev"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mutaxassislik (Field) *</label>
          <input
            type="text"
            required
            value={eduField}
            onChange={(e) => setEduField(e.target.value)}
            placeholder="Masalan: Backend Systems Engineering"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Davr (Period)</label>
          <input
            type="text"
            value={eduPeriod}
            onChange={(e) => setEduPeriod(e.target.value)}
            placeholder="Masalan: 2025 – Present"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Holati (Status)</label>
          <input
            type="text"
            value={eduStatus}
            onChange={(e) => setEduStatus(e.target.value)}
            placeholder="Masalan: Completed / In Progress"
            className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Tavsif (Description)</label>
        <textarea
          rows={3}
          value={eduDesc}
          onChange={(e) => setEduDesc(e.target.value)}
          placeholder="Ta'lim yo'nalishi va o'rganilgan asosiy mavzular..."
          className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
        />
      </div>

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
