import React from 'react';
import { Play, Database } from 'lucide-react';

interface SqlExplainScenarioProps {
  sqlMode: 'unindexed' | 'indexed';
  isExecutingSql: boolean;
  sqlRunResult: {
    executionTime: number;
    bufferReads: string;
    scannedRows: string;
    improvement: string;
    queryPlan: string[];
  } | null;
  onRunSql: (mode: 'unindexed' | 'indexed') => void;
}

export const SqlExplainScenario: React.FC<SqlExplainScenarioProps> = ({
  sqlMode,
  isExecutingSql,
  sqlRunResult,
  onRunSql,
}) => {
  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span>PostgreSQL 16: Sequential Scan vs B-Tree Composite Index</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            1,000,000 qatorlik tranzaksiyalar jadvalidan filtrli qidiruvning EXPLAIN (ANALYZE, BUFFERS) taqqoslashi.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => onRunSql('unindexed')}
            disabled={isExecutingSql}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              sqlMode === 'unindexed' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Indekssiz (Seq Scan)
          </button>
          <button
            onClick={() => onRunSql('indexed')}
            disabled={isExecutingSql}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              sqlMode === 'indexed' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. B-Tree Indeksli (Index Scan)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Bajarilayotgan SQL So'rovi</span>
            <span className="text-[10px] font-mono text-amber-400">
              {sqlMode === 'unindexed' ? 'Disk I/O Heavy' : 'Composite Index Optimized'}
            </span>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs leading-relaxed overflow-x-auto">
            <code>
              {sqlMode === 'unindexed'
                ? `-- 1. Oddiy filtr (Jadvalda 1,000,000 qator mavjud)\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, user_id, amount, status, created_at\nFROM transactions\nWHERE user_id = 49201 AND status = 'COMPLETED'\nORDER BY created_at DESC\nLIMIT 20;`
                : `-- 2. Composite B-Tree Indeks yaratilgan:\n-- CREATE INDEX idx_tx_user_status_created \n-- ON transactions (user_id, status, created_at DESC);\n\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, user_id, amount, status, created_at\nFROM transactions\nWHERE user_id = 49201 AND status = 'COMPLETED'\nORDER BY created_at DESC\nLIMIT 20;`}
            </code>
          </pre>

          <button
            onClick={() => onRunSql(sqlMode)}
            disabled={isExecutingSql}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              sqlMode === 'unindexed'
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {isExecutingSql
                ? 'Query rejasini tahlil qilmoqda...'
                : sqlMode === 'unindexed'
                ? 'Sekin So\'rovni Bajarish (Seq Scan)'
                : 'Optimallashtirilgan So\'rovni Bajarish (Index Scan)'}
            </span>
          </button>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">EXPLAIN (ANALYZE, BUFFERS) Natijasi</span>
            {sqlRunResult && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  sqlMode === 'indexed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {sqlRunResult.improvement}
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-3">
            {sqlRunResult ? (
              <>
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400">Execution Time:</div>
                    <div
                      className={`text-lg font-bold ${
                        sqlRunResult.executionTime < 5 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {sqlRunResult.executionTime} ms
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Disk / Buffer Reads:</div>
                    <div className="text-xs font-bold text-slate-200 mt-1">{sqlRunResult.bufferReads}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">PostgreSQL Query Plan Tree:</div>
                  <pre className="p-2.5 rounded-xl bg-slate-950 text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
                    {sqlRunResult.queryPlan.join('\n')}
                  </pre>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Tugmani bosing va 1,000,000 qatorlik jadvalda PostgreSQL qidiruv tezligini tekshiring...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
