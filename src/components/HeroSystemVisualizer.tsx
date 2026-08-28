import React, { useState, useEffect } from 'react';
import { Activity, Server, Cpu, Database, Wifi, Shield, Terminal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HeroSystemVisualizer: React.FC = () => {
  const { t } = useLanguage();
  const [latency, setLatency] = useState(14);
  const [asyncTasks, setAsyncTasks] = useState(42);
  const [activeTab, setActiveTab] = useState<'metrics' | 'runtime'>('metrics');

  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 8));
      setAsyncTasks(Math.floor(38 + Math.random() * 12));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-lg lg:max-w-none flex flex-col gap-4">
      {/* Visualizer Card Container */}
      <div className="rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl overflow-hidden group hover:border-blue-300 transition-all duration-300">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between text-xs font-mono gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-rose-500 inline-block hover:opacity-80 shrink-0 cursor-pointer" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-amber-500 inline-block hover:opacity-80 shrink-0 cursor-pointer" />
            <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-emerald-500 inline-block hover:opacity-80 shrink-0 cursor-pointer" />
            <span className="text-slate-400 ml-1 sm:ml-2 font-medium truncate text-[11px] sm:text-xs">bekzod@core-node-01</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded text-[10px] sm:text-[11px] border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {t.visualizer.onlineStatus}
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-4 pt-2 gap-1.5 sm:gap-2 text-xs font-mono overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-t font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t.visualizer.telemetryTitle}</span>
          </button>
          <button
            onClick={() => setActiveTab('runtime')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-t font-semibold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'runtime'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t.visualizer.runtimeTitle}</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          {activeTab === 'metrics' ? (
            <div className="space-y-4">
              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden group/metric">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-mono mb-1">
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-blue-600" /> {t.visualizer.apiLatency}
                    </span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t.visualizer.latencyHealthy}
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 transition-transform duration-300 group-hover/metric:scale-105 origin-left">
                    {latency} ms
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">FastAPI Uvicorn Loop</span>
                  
                  {/* Subtle audio waveform / packet activity bars */}
                  <div className="flex items-end gap-1 h-3 mt-2">
                    {[40, 70, 45, 90, 60, 80, 50, 95, 65, 40].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-blue-400/40 rounded-full transition-all duration-500"
                        style={{ height: `${(h * (latency / 15)) % 100}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden group/metric">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-mono mb-1">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-600" /> {t.visualizer.asyncWorkers}
                    </span>
                    <span className="text-blue-600 font-semibold">{t.visualizer.workersActive}</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900 transition-transform duration-300 group-hover/metric:scale-105 origin-left">
                    {asyncTasks}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">aiogram 3.x Coroutines</span>

                  {/* Packet activity bars for workers */}
                  <div className="flex items-end gap-1 h-3 mt-2">
                    {[60, 45, 80, 55, 90, 75, 40, 85, 70, 50].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-indigo-400/40 rounded-full transition-all duration-500"
                        style={{ height: `${(h * (asyncTasks / 40)) % 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stack Cluster Status */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                  <span>{t.visualizer.subsystem}</span>
                  <span>{t.visualizer.engineProtocol}</span>
                  <span>{t.visualizer.status}</span>
                </div>
                <div className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded transition-colors">
                  <span className="text-cyan-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-blue-400" /> {t.visualizer.apiGateway}
                  </span>
                  <span className="text-slate-300">FastAPI 0.111+</span>
                  <span className="text-emerald-400 font-semibold">200 OK</span>
                </div>
                <div className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded transition-colors">
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" /> {t.visualizer.dbCluster}
                  </span>
                  <span className="text-slate-300">PostgreSQL + Redis</span>
                  <span className="text-emerald-400 font-semibold">Synced</span>
                </div>
                <div className="flex items-center justify-between hover:bg-slate-800/50 p-1 rounded transition-colors">
                  <span className="text-purple-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-purple-400" /> {t.visualizer.authSecurity}
                  </span>
                  <span className="text-slate-300">JWT + OAuth2</span>
                  <span className="text-emerald-400 font-semibold">Protected</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs space-y-1.5 overflow-x-auto">
              <p className="text-slate-500"># Initializing Python AsyncIO Service Node</p>
              <p><span className="text-purple-400">async def</span> <span className="text-blue-400">boot_service</span>():</p>
              <p className="pl-4">db = <span className="text-purple-400">await</span> init_pool(<span className="text-emerald-300">"postgresql://..."</span>)</p>
              <p className="pl-4">bot = Bot(token=os.getenv(<span className="text-emerald-300">"BOT_TOKEN"</span>))</p>
              <p className="pl-4">dp = Dispatcher(storage=RedisStorage())</p>
              <p className="pl-4 text-emerald-400">print(<span className="text-emerald-300">"⚡ Cluster ready: Bekzod Idiyev Core"</span>)</p>
              <p className="pl-4"><span className="text-purple-400">await</span> dp.start_polling(bot)</p>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>School 21 • Data Science Core</span>
          <span className="text-blue-600 font-semibold">Bukhara (UTC+5)</span>
        </div>
      </div>
    </div>
  );
};

