import React from 'react';
import { RotateCcw, Trash2, MapPin } from 'lucide-react';
import { GlobalVisitorGlobe } from '../GlobalVisitorGlobe';
import { RealVisitorRecord, RealAnalyticsSummary } from '../../../services/realVisitorStorage';

interface AdminAnalyticsTabProps {
  realLogs: RealVisitorRecord[];
  realSummary: RealAnalyticsSummary;
  onRefreshLogs: () => void;
  onClearLogs: () => void;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  realLogs,
  realSummary,
  onRefreshLogs,
  onClearLogs,
}) => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Haqiqiy Mehmonlar Monitoringi</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              100% Real Live
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Portfolio saytiga haqiqatda tashrif buyurgan real foydalanuvchilar va IP-lar tahlili
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshLogs}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yangilash</span>
          </button>
          {realLogs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/60 text-xs font-mono text-rose-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Loglarni Tozalash</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D Global Visitor Earth */}
      <GlobalVisitorGlobe />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Jami Real Tashriflar</div>
          <div className="text-3xl font-bold text-white mt-1">{realSummary.totalVisitors} ta</div>
          <p className="text-[11px] text-emerald-400 mt-1">🟢 Telemetry Gateway Faol</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Bugungi Real Tashriflar</div>
          <div className="text-3xl font-bold text-blue-400 mt-1">{realSummary.todayVisitors} ta</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {realSummary.topLocations.map((l) => l.city).slice(0, 3).join(', ') || "O'zbekiston"}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Haqiqiy Qurilmalar Nisbati</div>
          <div className="text-lg font-bold text-white mt-1">
            {realSummary.mobilePercent}% Mobile | {realSummary.desktopPercent}% PC
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">Real User-Agent & Hardware Context</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">So'nggi Real Tashrif Buyuruvchilar Logi ({realLogs.length}):</h3>
          <span className="text-[11px] font-mono text-slate-500">Telegramga sinxronlangan</span>
        </div>

        {realLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            Hozircha saqlangan yangi tashriflar yo'q. Saytga kirilganda avtomatik qayd etiladi.
          </div>
        ) : (
          <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar">
            {realLogs.map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{v.visitorName}</span>
                    {v.visitorRole && (
                      <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                        {v.visitorRole}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                      {v.ip}
                    </span>
                  </div>
                  <div className="text-slate-400 flex flex-wrap items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{v.city}, {v.country}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-300">{v.isp}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-400">{v.deviceType} | {v.os} ({v.browser})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] text-slate-400 font-mono">{v.timestamp}</span>
                  <a
                    href={`https://yandex.uz/maps/?pt=${v.longitude},${v.latitude},pm2rdm&z=16`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 text-[10px] font-medium hover:bg-blue-900 transition-colors shrink-0"
                  >
                    Xarita Pin
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
