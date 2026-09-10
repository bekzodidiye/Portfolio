import React from 'react';
import { ShieldCheck, Zap, Layers, Database, Code2 } from 'lucide-react';
import { SandboxTab } from './useBackendPlayground';

interface BackendPlaygroundNavProps {
  activeTab: SandboxTab;
  setActiveTab: (tab: SandboxTab) => void;
}

export const BackendPlaygroundNav: React.FC<BackendPlaygroundNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="font-mono text-xs text-slate-400 font-semibold hidden sm:inline">
          bekzod-api-engine v3.12 (AsyncIO)
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('ratelimit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ratelimit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Rate Limiter</span>
        </button>
        <button
          onClick={() => setActiveTab('jwt')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'jwt' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>JWT HS256</span>
        </button>
        <button
          onClick={() => setActiveTab('redis')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'redis' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Redis vs DB</span>
        </button>
        <button
          onClick={() => setActiveTab('webhook')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'webhook' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Webhook Queue</span>
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sql' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>SQL EXPLAIN Sandbox</span>
        </button>
      </div>
    </div>
  );
};
