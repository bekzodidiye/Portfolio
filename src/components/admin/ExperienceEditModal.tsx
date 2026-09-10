import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, GraduationCap } from 'lucide-react';
import { WorkExperienceItem, EducationItem } from '../../types/portfolio';
import { WorkExperienceForm } from './WorkExperienceForm';
import { EducationForm } from './EducationForm';

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
  if (!isOpen) return null;

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
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {type === 'work' && onSaveWork && (
            <WorkExperienceForm
              initialData={item as WorkExperienceItem}
              onSave={onSaveWork}
              onClose={onClose}
            />
          )}

          {type === 'edu' && onSaveEdu && (
            <EducationForm
              initialData={item as EducationItem}
              onSave={onSaveEdu}
              onClose={onClose}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
