import React from 'react';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Activity,
  Settings,
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'profile'
  | 'projects'
  | 'skills'
  | 'timeline'
  | 'analytics'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  projectsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  projectsCount,
}) => {
  const navItems: Array<{ id: AdminTab; label: string; icon: any }> = [
    { id: 'overview', label: 'Boshqaruv & Metrika', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil & Bio', icon: User },
    { id: 'projects', label: `Loyihalar (${projectsCount})`, icon: FolderGit2 },
    { id: 'skills', label: "Ko'nikmalar (Skills)", icon: Cpu },
    { id: 'timeline', label: "Tajriba & Ta'lim", icon: GraduationCap },
    { id: 'analytics', label: 'Jonli Telemetriya', icon: Activity },
    { id: 'settings', label: 'Sozlamalar & Backup', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/60 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 sm:p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto flex-shrink-0 no-scrollbar">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};
