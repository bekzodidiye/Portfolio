import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { useLanguage } from '../../../context/LanguageContext';
import { generateCandidateSpec, executeTerminalCommand } from './terminalCommands';

export const TerminalCliWindow: React.FC = () => {
  const { language } = useLanguage();
  const { candidateProfile, setIsAdminOpen } = usePortfolioData();
  const [copied, setCopied] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [cliHistory, setCliHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'python3 -c "import bekzod; print(bekzod.status())"',
      output: '⚡ Status: 200 OK | Open to Full-Time & High-Impact Freelance Contracts',
    },
  ]);

  const specCode = generateCandidateSpec(candidateProfile, language);

  const handleCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(specCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        setCopied(false);
      });
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const res = executeTerminalCommand(inputVal, {
      candidateProfile,
      language,
      openAdmin: () => setIsAdminOpen(true),
    });

    if (res.clear) {
      setCliHistory([]);
      setInputVal('');
      return;
    }

    if (res.output) {
      setCliHistory((prev) => [...prev, { cmd: inputVal, output: res.output! }]);
    }
    setInputVal('');
  };

  return (
    <div
      id="unix-terminal-window"
      className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white text-slate-900"
    >
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-xs font-mono text-slate-500 ml-3 hidden sm:inline-block">
            bekzod@workstation: ~/architecture/spec.py
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
            UTF-8 • Python 3.12
          </span>
          <button
            onClick={handleCopy}
            id="terminal-copy-spec-btn"
            className="text-xs font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm bg-white overflow-x-auto">
        <div className="flex items-center gap-2 text-slate-500 mb-4 pb-2 border-b border-slate-100">
          <span className="text-blue-600">bekzod@arch-linux:~$</span>
          <span className="text-slate-900 font-semibold">cat backend_engineer_spec.py</span>
        </div>

        <pre className="text-slate-800 leading-relaxed overflow-x-auto whitespace-pre font-mono">
          <code>
            <span className="text-slate-500">{`"""\nbekzod_engineer_spec.py\n=============================================================================\nCandidate: Bekzod Idiyev\nStatus: AVAILABLE_FOR_HIRE = True\n=============================================================================\n"""`}</span>
            {'\n\n'}
            <span className="text-purple-600">from</span> <span className="text-blue-600">dataclasses</span> <span className="text-purple-600">import</span> <span className="text-amber-600">dataclass</span>{'\n'}
            <span className="text-purple-600">from</span> <span className="text-blue-600">typing</span> <span className="text-purple-600">import</span> <span className="text-amber-600">List, Dict</span>{'\n\n'}
            <span className="text-amber-600">@dataclass</span>{'\n'}
            <span className="text-purple-600">class</span> <span className="text-cyan-600 font-bold">BackendEngineer</span>:{'\n'}
            {'    '}name: <span className="text-blue-600">str</span> = <span className="text-emerald-600">"{candidateProfile.name}"</span>{'\n'}
            {'    '}title: <span className="text-blue-600">str</span> = <span className="text-emerald-600">"{candidateProfile.primaryTitle}"</span>{'\n'}
            {'    '}education: <span className="text-blue-600">str</span> = <span className="text-emerald-600">"{candidateProfile.subTitle}"</span>{'\n'}
            {'    '}base_location: <span className="text-blue-600">str</span> = <span className="text-emerald-600">"{candidateProfile.location}"</span>{'\n'}
            {'    '}telegram_bot: <span className="text-blue-600">str</span> = <span className="text-emerald-600">"{candidateProfile.botUsername || '@my_portfolio_support_bot'}"</span>{'\n'}
            {'    '}kwork_deliveries: <span className="text-blue-600">int</span> = <span className="text-amber-600">{candidateProfile.freelanceCount}</span>{'\n\n'}
            {'    '}<span className="text-purple-600">def</span> <span className="text-blue-600">execute_mission</span>(self) -&gt; <span className="text-blue-600">str</span>:{'\n'}
            {'        '}<span className="text-purple-600">return</span> <span className="text-emerald-600">"Designing zero-downtime APIs & scalable Telegram engines."</span>
          </code>
        </pre>

        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
          {cliHistory.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-blue-600">bekzod@arch-linux:~$</span>
                <span className="text-slate-900">{item.cmd}</span>
              </div>
              <div className="text-emerald-700 bg-emerald-50 py-1 pl-4 border-l-2 border-emerald-500/40 text-xs sm:text-sm">
                {item.output}
              </div>
            </div>
          ))}

          <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4">
            <span className="text-blue-600">bekzod@arch-linux:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type 'help', 'skills', 'projects', 'contact' or 'clear'..."
              className="flex-1 bg-transparent text-slate-900 border-none outline-none font-mono text-xs sm:text-sm placeholder:text-slate-400 focus:ring-0"
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Run
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
