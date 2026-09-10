import React from 'react';
import { Code2 } from 'lucide-react';
import { ArchitectureNode } from './architectureData';

interface ArchitectureInspectorPanelProps {
  activeNode: ArchitectureNode;
}

export const ArchitectureInspectorPanel: React.FC<ArchitectureInspectorPanelProps> = ({
  activeNode,
}) => {
  return (
    <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="border-b border-slate-800 pb-3">
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 uppercase font-semibold">
          {activeNode.category}
        </span>
        <h3 className="text-lg font-bold text-white font-mono mt-1.5">{activeNode.name}</h3>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">{activeNode.summary}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400">Kechikish (p99 Latency)</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            {activeNode.metrics.latency}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400">O‘tkazuvchanlik (Throughput)</div>
          <div className="text-base font-bold font-mono text-blue-400 mt-0.5">
            {activeNode.metrics.throughput}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
          Texnologiyalar & Stack:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeNode.metrics.techStack.map((t, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-slate-950 text-slate-200 border border-slate-800"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5 text-blue-400" /> {activeNode.codeSnippet.filename}
          </span>
        </div>
        <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
          <code>{activeNode.codeSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
};
