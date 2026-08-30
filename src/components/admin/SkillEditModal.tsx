import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Cpu } from 'lucide-react';
import { SkillItem } from '../../types/portfolio';

interface SkillEditModalProps {
  isOpen: boolean;
  categoryTitle: string;
  skill?: SkillItem | null;
  onClose: () => void;
  onSave: (skill: SkillItem) => void;
}

export const SkillEditModal: React.FC<SkillEditModalProps> = ({
  isOpen,
  categoryTitle,
  skill,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<SkillItem>({
    name: '',
    level: 'Expert',
    tag: '',
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        level: skill.level || 'Expert',
        tag: skill.tag || '',
      });
    } else {
      setFormData({
        name: '',
        level: 'Expert',
        tag: 'Core Stack',
      });
    }
  }, [skill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
          className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {skill ? 'Ko\'nikmani Tahrirlash' : 'Yangi Ko\'nikma Qo\'shish'}
                </h3>
                <p className="text-xs text-slate-400">Kategoriya: {categoryTitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Texnologiya / Ko'nikma Nomi *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masalan: FastAPI, Docker, GraphQL"
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Daraja (Proficiency Level)
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Expert">Expert (Yuqori daraja)</option>
                <option value="Advanced">Advanced (Ilg'or daraja)</option>
                <option value="Intermediate">Intermediate (O'rta daraja)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Qisqa Teg / Nishon
              </label>
              <input
                type="text"
                value={formData.tag || ''}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Masalan: High-Perf Async, Primary RDBMS"
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

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
