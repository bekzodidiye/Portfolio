import React from 'react';
import { Plus, User, Download } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';

interface AdminOverviewTabProps {
  onOpenNewProject: () => void;
  onGoToProfile: () => void;
  onExport: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onOpenNewProject,
  onGoToProfile,
  onExport,
}) => {
  const { candidateProfile, featuredProjects, skillCategories, workExperience, educationList } = usePortfolioData();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Xush kelibsiz, {candidateProfile.name}! 👋
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Portfolio boshqaruv markazining umumiy holati va tezkor ko'rsatkichlari
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs text-slate-400">Jami Loyihalar</span>
          <div className="text-2xl font-bold text-white mt-1">{featuredProjects.length} ta</div>
          <span className="text-[10px] text-blue-400">aiogram, FastAPI, AI</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs text-slate-400">Ko'nikmalar</span>
          <div className="text-2xl font-bold text-white mt-1">
            {skillCategories.reduce((acc, c) => acc + c.skills.length, 0)} ta
          </div>
          <span className="text-xs font-medium text-indigo-300">{skillCategories.length} ta kategoriya</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs text-slate-400">Ish Tajribalari</span>
          <div className="text-2xl font-bold text-white mt-1">{workExperience.length} ta</div>
          <span className="text-xs font-medium text-emerald-300">{candidateProfile.freelanceCount}+ frilans</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs text-slate-400">Ta'lim & Kurslar</span>
          <div className="text-2xl font-bold text-white mt-1">{educationList.length} ta</div>
          <span className="text-xs font-medium text-amber-300">School 21, Mohirdev</span>
        </div>
      </div>

      {/* Telegram Gateway & System Status */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white">Telegram Gateway & Webhook Holati</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-400">
            Vercel Serverless 24/7
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-1.5">
            <div className="text-slate-400 font-medium">Asosiy Webhook Endpoint:</div>
            <code className="text-blue-400 text-[11px] font-mono block bg-slate-900 px-2 py-1 rounded-lg break-all">
              /api/webhook
            </code>
            <p className="text-[11px] text-slate-400">
              Ushbu endpoint Telegram bot so'rovlarini to'xtovsiz qabul qiladi va PostgreSQL-ga saqlaydi.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-1.5">
            <div className="text-slate-400 font-medium">Bot Tokenda 401 Xatolik Chiqsa:</div>
            <p className="text-[11px] text-slate-300">
              Agar bot xabarlarga javob bermasa, Telegram <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-semibold">@BotFather</a> orqali yangi token oling va Vercel Environment Variables ga <code className="text-amber-400 font-mono">TELEGRAM_BOT_TOKEN</code> sifatida kiriting.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white">Tezkor Amallar:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onOpenNewProject}
            className="p-3 rounded-2xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Loyiha Qo'shish</span>
          </button>

          <button
            onClick={onGoToProfile}
            className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Profilni Tahrirlash</span>
          </button>

          <button
            onClick={onExport}
            className="p-3 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 hover:bg-emerald-600/20 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Zaxira Nusxasini Olish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
