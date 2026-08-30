import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Briefcase, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { WorkExperienceItem, EducationItem } from '../../types/portfolio';

interface ExperienceEditModalProps {
  isOpen: boolean;
  type: 'work' | 'edu';
  item?: WorkExperienceItem | EducationItem | null;
  onClose: () => void;
  onSaveWork?: (item: Omit<WorkExperienceItem, 'id'>, id?: string) => void;
  onSaveEdu?: (item: Omit<EducationItem, 'id'>, id?: string) => void;
}

export const ExperienceEditModal: React.FC<ExperienceEditModalProps> = ({
  isOpen,
  type,
  item,
  onClose,
  onSaveWork,
  onSaveEdu,
}) => {
  // Work Form State
  const [workRole, setWorkRole] = useState('');
  const [workCompany, setWorkCompany] = useState('');
  const [workPeriod, setWorkPeriod] = useState('2026 – Present');
  const [workBadge, setWorkBadge] = useState('');
  const [workRespList, setWorkRespList] = useState<string[]>([]);
  const [respInput, setRespInput] = useState('');
  const [workTechTags, setWorkTechTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Education Form State
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduPeriod, setEduPeriod] = useState('2025 – Present');
  const [eduField, setEduField] = useState('');
  const [eduStatus, setEduStatus] = useState('Completed');
  const [eduDesc, setEduDesc] = useState('');

  useEffect(() => {
    if (type === 'work') {
      const w = item as WorkExperienceItem | undefined;
      if (w) {
        setWorkRole(w.role || '');
        setWorkCompany(w.companyOrPlatform || '');
        setWorkPeriod(w.period || '');
        setWorkBadge(w.badge || '');
        setWorkRespList(w.responsibilities || []);
        setWorkTechTags(w.techTags || []);
      } else {
        setWorkRole('');
        setWorkCompany('Kwork (Freelance Market)');
        setWorkPeriod('2026 – Present');
        setWorkBadge('Delivered Projects');
        setWorkRespList([]);
        setWorkTechTags(['Python', 'FastAPI', 'PostgreSQL']);
      }
    } else {
      const e = item as EducationItem | undefined;
      if (e) {
        setEduInstitution(e.institution || '');
        setEduPeriod(e.period || '');
        setEduField(e.field || '');
        setEduStatus(e.status || 'Completed');
        setEduDesc(e.description || '');
      } else {
        setEduInstitution('School 21');
        setEduPeriod('2025 – Present');
        setEduField('Backend Systems Engineering & Data Science');
        setEduStatus('In Progress');
        setEduDesc('');
      }
    }
  }, [item, type, isOpen]);

  if (!isOpen) return null;

  const handleAddResp = () => {
    if (respInput.trim()) {
      setWorkRespList([...workRespList, respInput.trim()]);
      setRespInput('');
    }
  };

  const handleRemoveResp = (idx: number) => {
    setWorkRespList(workRespList.filter((_, i) => i !== idx));
  };

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
    if (type === 'work' && onSaveWork) {
      if (!workRole.trim() || !workCompany.trim()) return;
      onSaveWork(
        {
          role: workRole,
          companyOrPlatform: workCompany,
          period: workPeriod,
          badge: workBadge || undefined,
          responsibilities: workRespList,
          techTags: workTechTags,
        },
        item?.id
      );
    } else if (type === 'edu' && onSaveEdu) {
      if (!eduInstitution.trim() || !eduField.trim()) return;
      onSaveEdu(
        {
          institution: eduInstitution,
          period: eduPeriod,
          field: eduField,
          status: eduStatus,
          description: eduDesc,
        },
        item?.id
      );
    }
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
          className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                {type === 'work' ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {type === 'work'
                    ? item
                      ? 'Ish Tajribasini Tahrirlash'
                      : 'Yangi Ish Tajribasi'
                    : item
                    ? 'Ta\'limni Tahrirlash'
                    : 'Yangi Ta\'lim / Sertifikat'}
                </h3>
                <p className="text-xs text-slate-400">
                  {type === 'work' ? 'Kompaniya, lavozim va vazifalar' : 'Muassasa, mutaxassislik va davr'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 space-y-4 py-4 pr-1">
            {type === 'work' ? (
              <>
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
                      className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs"
                    >
                      Qo'shish
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {workTechTags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1">
                        {t}
                        <button type="button" onClick={() => handleRemoveTag(t)} className="text-rose-400">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bajarilgan Vazifalar</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={respInput}
                      onChange={(e) => setRespInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddResp();
                        }
                      }}
                      placeholder="Vazifani yozing va Enter bosing..."
                      className="flex-1 px-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddResp}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs"
                    >
                      Qo'shish
                    </button>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {workRespList.map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-1.5 rounded bg-slate-950/50 text-xs text-slate-300">
                        <span className="flex-1 mr-2">• {r}</span>
                        <button type="button" onClick={() => handleRemoveResp(i)} className="text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Saqlash</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
