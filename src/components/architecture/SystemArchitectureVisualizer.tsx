import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Activity,
  Play,
  RotateCcw,
  Code2,
  Terminal,
  GitBranch,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ARCHITECTURE_PIPELINES, ArchitecturePipeline, ArchitectureNode } from './architectureData';

export const SystemArchitectureVisualizer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(ARCHITECTURE_PIPELINES[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(ARCHITECTURE_PIPELINES[0].nodes[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const activePipeline = ARCHITECTURE_PIPELINES.find((p) => p.id === selectedPipelineId) || ARCHITECTURE_PIPELINES[0];
  const activeNode = activePipeline.nodes.find((n) => n.id === selectedNodeId) || activePipeline.nodes[0];

  const handleRunSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStepIndex(0);
    setSimLogs([`🚀 [${new Date().toLocaleTimeString()}] Tranzaksiya oqimi ishga tushirildi...`]);

    for (let i = 0; i < activePipeline.requestFlowSteps.length; i++) {
      const step = activePipeline.requestFlowSteps[i];
      setCurrentStepIndex(i);
      setSelectedNodeId(step.nodeId);

      setSimLogs((prev) => [
        ...prev,
        `⚡ [${step.durationMs}ms] ${step.title}: ${step.log}`,
      ]);

      await new Promise((r) => setTimeout(r, 900));
    }

    setSimLogs((prev) => [
      ...prev,
      `✅ [${new Date().toLocaleTimeString()}] Barcha bosqichlar 0 ta xato bilan 100% muvaffaqiyatli yakunlandi!`,
    ]);
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setCurrentStepIndex(-1);
    setSimLogs([]);
    setSelectedNodeId(activePipeline.nodes[0].id);
  };

  return (
    <section id="architecture-visualizer" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>PRODUCTION-READY SYSTEM ARCHITECTURE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          Mikroxizmatlar & Tizim Arxitekturasi Xaritasi
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Yuqori yuklamali backend tizimlarning so‘rovlar oqimi, kesh qatlamlari, navbatlar va ma’lumotlar bazasi topologiyasini interaktiv boshqaring.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {ARCHITECTURE_PIPELINES.map((pipe) => {
          const isSelected = pipe.id === selectedPipelineId;
          return (
            <button
              key={pipe.id}
              onClick={() => {
                setSelectedPipelineId(pipe.id);
                setSelectedNodeId(pipe.nodes[0].id);
                handleResetSimulation();
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>{pipe.title}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-800 text-blue-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {pipe.badge}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Mikroxizmatlar Topologiyasi ({activePipeline.nodes.length} ta tugun)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Oqim Ishlamoqda...' : 'So‘rovni Simulyatsiya Qilish'}</span>
              </button>

              {simLogs.length > 0 && (
                <button
                  onClick={handleResetSimulation}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative">
            {activePipeline.nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              const isCurrentStep = currentStepIndex >= 0 && activePipeline.requestFlowSteps[currentStepIndex]?.nodeId === node.id;
              const Icon = node.icon;

              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50'
                  } ${isCurrentStep ? 'ring-4 ring-emerald-500/40 border-emerald-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border ${node.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-400">#{index + 1}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{node.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-medium">{node.tag}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{node.summary}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>⏱️ {node.metrics.latency}</span>
                    <span>⚡ {node.metrics.throughput}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {simLogs.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
              <div className="text-[11px] text-slate-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-emerald-400" /> Trace Console</span>
                <span className="text-emerald-400">{isSimulating ? 'IN_PROGRESS' : 'COMPLETED'}</span>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1 no-scrollbar">
                {simLogs.map((log, i) => (<div key={i}>{log}</div>))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 uppercase">
              {activeNode.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">{activeNode.name}</h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activeNode.summary}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">Kechikish (Latency)</div>
              <div className="text-base font-bold font-mono text-emerald-500 mt-0.5">{activeNode.metrics.latency}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">O‘tkazuvchanlik</div>
              <div className="text-base font-bold font-mono text-blue-500 mt-0.5">{activeNode.metrics.throughput}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Texnologiyalar:</div>
            <div className="flex flex-wrap gap-1.5">
              {activeNode.metrics.techStack.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-blue-500" /> {activeNode.codeSnippet.filename}</span>
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
              <code>{activeNode.codeSnippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
