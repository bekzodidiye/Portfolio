import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';

export const TerminalCliWindow: React.FC = () => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [cliHistory, setCliHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: 'python3 -c "import bekzod; print(bekzod.status())"',
      output: '⚡ Status: 200 OK | Open to Full-Time & High-Impact Freelance Contracts',
    },
  ]);

  const specCode = `"""
bekzod_engineer_spec.py
=============================================================================
Candidate: ${CANDIDATE_PROFILE.name}
Role: ${CANDIDATE_PROFILE.primaryTitle}
Education: ${CANDIDATE_PROFILE.subTitle}
Location: ${CANDIDATE_PROFILE.location}
Status: AVAILABLE_FOR_HIRE = True
Language: ${language.toUpperCase()}
=============================================================================
"""

from dataclasses import dataclass
from typing import List, Dict

@dataclass
class BackendEngineer:
    name: str = "${CANDIDATE_PROFILE.name}"
    title: str = "${CANDIDATE_PROFILE.primaryTitle}"
    education: str = "${CANDIDATE_PROFILE.subTitle}"
    base_location: str = "${CANDIDATE_PROFILE.location}"
    telegram_bot: str = "${CANDIDATE_PROFILE.botUsername || '@my_portfolio_support_bot'}"
    kwork_deliveries: int = ${CANDIDATE_PROFILE.freelanceCount}

    def execute_mission(self) -> str:
        return "Designing zero-downtime APIs & scalable Telegram engines."`;

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
    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) return;

    let output = '';
    switch (trimmed) {
      case 'help':
        output = language === 'uz'
          ? 'Mavjud buyruqlar: cat spec, whoami, skills, projects, bot, contact, clear, python --version'
          : language === 'ru'
          ? 'Доступные команды: cat spec, whoami, skills, projects, bot, contact, clear, python --version'
          : 'Available commands: cat spec, whoami, skills, projects, bot, contact, clear, python --version';
        break;
      case 'whoami':
        output = `${CANDIDATE_PROFILE.name} — ${t.hero.typewriter[0]} & ${t.hero.typewriter[1]}`;
        break;
      case 'skills':
        output = 'FastAPI, Django, PostgreSQL, Redis, Docker, aiogram 3.x, WebSockets, Clean Architecture';
        break;
      case 'projects':
        output = '1. Portfolio Assistant Bot | 2. Buddy Team (AI Match) | 3. Esports Tournament Bot | 4. PeerLearn Mini App';
        break;
      case 'bot':
      case 'telegram-bot':
        output = `🤖 Official Interactive Telegram Assistant: ${CANDIDATE_PROFILE.botUsername || '@my_portfolio_support_bot'} (${CANDIDATE_PROFILE.botUrl || 'https://t.me/my_portfolio_support_bot'})`;
        break;
      case 'contact':
        output = `Bot: ${CANDIDATE_PROFILE.botUsername} | Telegram: ${CANDIDATE_PROFILE.telegramHandle} | Email: ${CANDIDATE_PROFILE.email} | Phone: ${CANDIDATE_PROFILE.phone}`;
        break;
      case 'python --version':
        output = 'Python 3.12.3 (CPython Linux x86_64, High-Performance AsyncIO)';
        break;
      case 'stats':
      case 'visitors':
      case 'analytics':
        output = `📊 PORTFOLIO LIVE TELEMETRY: 24/7 Serverless Visitor Gateway Active | Real-time GPS Alerts connected to Telegram Bot (${CANDIDATE_PROFILE.botUsername || '@my_portfolio_support_bot'}). Admin panel: Type /admin in Telegram bot.`;
        break;
      case 'clear':
        setCliHistory([]);
        setInputVal('');
        return;
      default:
        output = `bash: command not found: ${trimmed}. Type 'help' for available commands.`;
    }

    setCliHistory((prev) => [...prev, { cmd: inputVal, output }]);
    setInputVal('');
  };

  return (
    <div
      id="unix-terminal-window"
      className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-slate-100"
    >
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-xs font-mono text-slate-400 ml-3 hidden sm:inline-block">
            bekzod@workstation: ~/architecture/spec.py
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            UTF-8 • Python 3.12
          </span>
          <button
            onClick={handleCopy}
            id="terminal-copy-spec-btn"
            className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm bg-slate-950 overflow-x-auto">
        <div className="flex items-center gap-2 text-slate-400 mb-4 pb-2 border-b border-slate-800">
          <span className="text-cyan-400">bekzod@arch-linux:~$</span>
          <span className="text-white font-semibold">cat backend_engineer_spec.py</span>
        </div>

        <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre font-mono">
          <code>
            <span className="text-slate-500">{`"""\nbekzod_engineer_spec.py\n=============================================================================\nCandidate: Bekzod Idiyev\nStatus: AVAILABLE_FOR_HIRE = True\n=============================================================================\n"""`}</span>
            {'\n\n'}
            <span className="text-purple-400">from</span> <span className="text-blue-300">dataclasses</span> <span className="text-purple-400">import</span> <span className="text-amber-300">dataclass</span>{'\n'}
            <span className="text-purple-400">from</span> <span className="text-blue-300">typing</span> <span className="text-purple-400">import</span> <span className="text-amber-300">List, Dict</span>{'\n\n'}
            <span className="text-amber-400">@dataclass</span>{'\n'}
            <span className="text-purple-400">class</span> <span className="text-cyan-300 font-bold">BackendEngineer</span>:{'\n'}
            {'    '}name: <span className="text-blue-300">str</span> = <span className="text-emerald-400">"{CANDIDATE_PROFILE.name}"</span>{'\n'}
            {'    '}title: <span className="text-blue-300">str</span> = <span className="text-emerald-400">"{CANDIDATE_PROFILE.primaryTitle}"</span>{'\n'}
            {'    '}education: <span className="text-blue-300">str</span> = <span className="text-emerald-400">"{CANDIDATE_PROFILE.subTitle}"</span>{'\n'}
            {'    '}base_location: <span className="text-blue-300">str</span> = <span className="text-emerald-400">"{CANDIDATE_PROFILE.location}"</span>{'\n'}
            {'    '}telegram_bot: <span className="text-blue-300">str</span> = <span className="text-emerald-400">"{CANDIDATE_PROFILE.botUsername || '@my_portfolio_support_bot'}"</span>{'\n'}
            {'    '}kwork_deliveries: <span className="text-blue-300">int</span> = <span className="text-amber-400">{CANDIDATE_PROFILE.freelanceCount}</span>{'\n\n'}
            {'    '}<span className="text-purple-400">def</span> <span className="text-blue-400">execute_mission</span>(self) -&gt; <span className="text-blue-300">str</span>:{'\n'}
            {'        '}<span className="text-purple-400">return</span> <span className="text-emerald-300">"Designing zero-downtime APIs & scalable Telegram engines."</span>
          </code>
        </pre>

        <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
          {cliHistory.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-cyan-400">bekzod@arch-linux:~$</span>
                <span className="text-white">{item.cmd}</span>
              </div>
              <div className="text-emerald-400/90 pl-4 border-l-2 border-emerald-500/40 text-xs sm:text-sm">
                {item.output}
              </div>
            </div>
          ))}

          <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4">
            <span className="text-cyan-400">bekzod@arch-linux:~$</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type 'help', 'skills', 'projects', 'contact' or 'clear'..."
              className="flex-1 bg-transparent text-white border-none outline-none font-mono text-xs sm:text-sm placeholder:text-slate-500 focus:ring-0"
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
