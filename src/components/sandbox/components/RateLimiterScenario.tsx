import React from 'react';
import { Play, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RateLimiterScenarioProps {
  tokens: number;
  rateLimitExceeded: boolean;
  rateLogs: Array<{ id: number; status: number; msg: string; time: string; latency: number }>;
  onTriggerRequest: () => void;
}

export const RateLimiterScenario: React.FC<RateLimiterScenarioProps> = ({
  tokens,
  rateLimitExceeded,
  rateLogs,
  onTriggerRequest,
}) => {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>Algorithm: Token Bucket (FastAPI + Redis)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Maksimal 5 ta token sig'imi. Har 2.5 soniyada Redis 1 ta yangi token to'ldirib turadi.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400">Tokens:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i <= tokens ? 'bg-blue-500 shadow-sm shadow-blue-400/50' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-white ml-1">{tokens}/5</span>
          </div>

          <button
            onClick={onTriggerRequest}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Send Request (POST)</span>
          </button>
        </div>
      </div>

      {rateLimitExceeded && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-mono flex items-center gap-2.5 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            <strong>429 TOO MANY REQUESTS:</strong> Rate limit exceeded! Redis bucket empty. Wait for refill...
          </span>
        </div>
      )}

      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Server Telemetry Logs</span>
          <span>Endpoint: /api/v1/auth/token</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
          {rateLogs.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Tugmani bosing va so'rov yuborishni boshlang...</p>
          ) : (
            rateLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2 rounded-lg flex items-center justify-between border ${
                  log.status === 200
                    ? 'bg-blue-950/40 border-blue-800/50 text-blue-300'
                    : 'bg-red-950/40 border-red-800/50 text-red-300'
                }`}
              >
                <span>{log.msg}</span>
                <span className="text-[10px] text-slate-400">
                  {log.time} ({log.latency}ms)
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
