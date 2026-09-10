import React from 'react';
import { Briefcase, Rocket, Code2, Smile, LucideIcon } from 'lucide-react';

export interface RoleOption {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface VisitorRoleSelectorProps {
  label: string;
  selectedRole: string;
  onSelectRole: (roleKey: string) => void;
  roleLabels: {
    recruiter: string;
    client: string;
    developer: string;
    guest: string;
  };
}

export const VisitorRoleSelector: React.FC<VisitorRoleSelectorProps> = ({
  label,
  selectedRole,
  onSelectRole,
  roleLabels,
}) => {
  const roleOptions: RoleOption[] = [
    { key: 'recruiter', label: roleLabels.recruiter, icon: Briefcase },
    { key: 'client', label: roleLabels.client, icon: Rocket },
    { key: 'developer', label: roleLabels.developer, icon: Code2 },
    { key: 'guest', label: roleLabels.guest, icon: Smile },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {roleOptions.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRole === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectRole(item.key)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
