import React from 'react';
import { ShieldCheck, Eye, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onCloseAdmin: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onCloseAdmin,
  onLogout,
}) => {
  return (
    <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">
              Bekzod Idiyev — Admin Panel
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-[10px] font-mono text-emerald-400 font-medium">
              CMS v2.0 Live
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Barcha bo'limlar 100% dinamik boshqaruvda
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onCloseAdmin}
          className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portfolioni Ko'rish</span>
        </button>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl bg-rose-600/10 border border-rose-500/30 hover:bg-rose-600/20 text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Chiqish</span>
        </button>
      </div>
    </header>
  );
};
