import React from 'react';
import { Play, Database, Zap } from 'lucide-react';

interface RedisBenchmarkScenarioProps {
  isBenchmarking: boolean;
  dbLatency: number | null;
  redisLatency: number | null;
  onRunBenchmark: () => void;
}

export const RedisBenchmarkScenario: React.FC<RedisBenchmarkScenarioProps> = ({
  isBenchmarking,
  dbLatency,
  redisLatency,
  onRunBenchmark,
}) => {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span>Benchmark: Disk I/O vs In-Memory Redis Cache</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            10,000 ta so'rov uchun PostgreSQL diskdan o'qish va Redis kesh javob tezligi taqqoslashi.
          </p>
        </div>

        <button
          onClick={onRunBenchmark}
          disabled={isBenchmarking}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isBenchmarking ? 'Testing...' : 'Run 10k Benchmark'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PostgreSQL Disk Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
              <Database className="w-4 h-4" /> PostgreSQL 16 (Disk Query)
            </span>
            <span className="text-xs font-mono text-slate-400">
              {dbLatency ? `${dbLatency} ms` : '—'}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: dbLatency ? '85%' : '0%' }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Query: <code className="text-blue-300">SELECT * FROM projects WHERE is_active=true</code>
          </p>
        </div>

        {/* Redis Cache Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <Zap className="w-4 h-4" /> Redis 7.2 (RAM In-Memory Cache)
            </span>
            <span className="text-xs font-mono text-emerald-300 font-bold">
              {redisLatency ? `${redisLatency} ms` : '—'}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: redisLatency ? '4%' : '0%' }}
            />
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Cache Hit: <code className="text-emerald-300">GET portfolio:projects:active</code> (40x Faster!)
          </p>
        </div>
      </div>
    </div>
  );
};
