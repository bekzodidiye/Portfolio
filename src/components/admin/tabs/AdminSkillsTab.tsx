import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { SkillItem } from '../../../types/portfolio';

interface AdminSkillsTabProps {
  onAddSkill: (categoryIndex: number) => void;
  onEditSkill: (categoryIndex: number, skillIndex: number, skill: SkillItem) => void;
  showToast: (msg: string) => void;
}

export const AdminSkillsTab: React.FC<AdminSkillsTabProps> = ({
  onAddSkill,
  onEditSkill,
  showToast,
}) => {
  const { skillCategories, deleteSkill } = usePortfolioData();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Ko'nikmalar va Texnologik Steklar
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Har bir kategoriya bo'yicha texnologiyalar va tajriba darajalarini boshqaring
        </p>
      </div>

      <div className="space-y-6">
        {skillCategories.map((category, catIdx) => (
          <div key={category.title} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{category.title}</span>
                  <span className="text-xs font-normal text-slate-400">({category.skills.length} ta ko'nikma)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
              </div>

              <button
                onClick={() => onAddSkill(catIdx)}
                className="px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ko'nikma Qo'shish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {category.skills.map((skill, sIdx) => (
                <div
                  key={skill.name}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{skill.name}</div>
                    <div className="text-[10px] text-blue-400 font-mono">
                      {skill.level} • {skill.tag}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditSkill(catIdx, sIdx, skill)}
                      className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteSkill(catIdx, sIdx);
                        showToast("🗑️ Ko'nikma o'chirildi.");
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
