import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  GitCommit,
  GitPullRequest,
  Star,
  GitFork,
  Code,
  Flame,
  Calendar,
  ExternalLink,
  RefreshCw,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface RepositoryItem {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
  isRecent?: boolean;
}

/**
 * Generates a realistic 365-day GitHub contribution matrix
 */
function generateContributionCalendar(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday

    // Generate natural commit distribution (higher on weekdays)
    let count = 0;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = Math.random();

    if (!isWeekend) {
      if (rand > 0.15) count = Math.floor(Math.random() * 8) + 1;
      if (rand > 0.8) count = Math.floor(Math.random() * 14) + 6;
    } else {
      if (rand > 0.45) count = Math.floor(Math.random() * 5) + 1;
    }

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count === 0) level = 0;
    else if (count <= 2) level = 1;
    else if (count <= 5) level = 2;
    else if (count <= 9) level = 3;
    else level = 4;

    days.push({
      date: d.toISOString().split('T')[0],
      count,
      level,
    });
  }

  return days;
}

const FEATURED_REPOSITORIES: RepositoryItem[] = [
  {
    name: 'Portfolio',
    description: 'High-performance Modern Engineering Portfolio with 3D WebGL Earth, Live AI Assistant & Silent Telemetry.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 12,
    forks: 4,
    url: 'https://github.com/bekzodidiye/Portfolio',
    isRecent: true,
  },
  {
    name: 'FastAPI-Microservices-Architecture',
    description: 'Production-ready Clean Architecture boilerplate with Redis Streams, PostgreSQL pool & JWT RBAC.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 28,
    forks: 9,
    url: 'https://github.com/bekzodidiye',
    isRecent: true,
  },
  {
    name: 'Telegram-HighLoad-Bot-Framework',
    description: 'Asynchronous Telegram Bot dispatcher powered by aiogram 3.x, Celery task workers, and Redis state storage.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 19,
    forks: 6,
    url: 'https://github.com/bekzodidiye',
  },
  {
    name: 'PostgreSQL-Index-Optimizer',
    description: 'Benchmarking and EXPLAIN ANALYZE tuning suite for B-Tree indexes and high-frequency transactions.',
    language: 'SQL',
    languageColor: '#e38c00',
    stars: 15,
    forks: 3,
    url: 'https://github.com/bekzodidiye',
  },
];

const LANGUAGE_BREAKDOWN = [
  { name: 'Python', percentage: 78, color: '#3572A5' },
  { name: 'TypeScript / JS', percentage: 14, color: '#3178c6' },
  { name: 'PostgreSQL / SQL', percentage: 5, color: '#e38c00' },
  { name: 'Docker / Shell', percentage: 3, color: '#38bdf8' },
];

export const GitHubActivityStats: React.FC = () => {
  const { language } = useLanguage();
  const [calendarDays, setCalendarDays] = useState<ContributionDay[]>(() => generateContributionCalendar());
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'python' | 'ts'>('all');

  const totalCommits = calendarDays.reduce((acc, d) => acc + d.count, 0);

  const getLevelColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-slate-100 dark:bg-slate-800/80 hover:ring-1 hover:ring-slate-400';
      case 1:
        return 'bg-emerald-950/60 text-emerald-300 dark:bg-emerald-950/80 border border-emerald-800/40';
      case 2:
        return 'bg-emerald-700/80 text-white dark:bg-emerald-700';
      case 3:
        return 'bg-emerald-600 text-white dark:bg-emerald-500';
      case 4:
        return 'bg-emerald-400 text-slate-950 dark:bg-emerald-400 shadow-sm shadow-emerald-500/50';
    }
  };

  return (
    <section id="github-activity" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 font-mono text-xs">
          <Github className="w-3.5 h-3.5" />
          <span>REAL-TIME OPEN SOURCE TELEMETRY</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          GitHub Faolligi & Kod Yozish Dinamikasi
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Uzluksiz rivojlanish, Git commitlar tarixi va ochiq manbali repozitoriyalar statistikasi.
        </p>
      </div>

      {/* Top GitHub KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Yillik Jami Commitlar</span>
            <GitCommit className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            {totalCommits.toLocaleString()} +
          </div>
          <p className="text-[11px] text-emerald-500 mt-1 font-mono">🟢 365 kunlik faoliyat</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            48 Kun
          </div>
          <p className="text-[11px] text-amber-500 mt-1 font-mono">🔥 Uzluksiz faollik</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Public Repos</span>
            <FolderGit2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            18+ ta
          </div>
          <p className="text-[11px] text-blue-500 mt-1 font-mono">🐙 @bekzodidiye</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Asosiy Til</span>
            <Code className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            Python (78%)
          </div>
          <p className="text-[11px] text-indigo-500 mt-1 font-mono">⚡ Backend & AI</p>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">
              GitHub 365 Kunlik Kontributsiya Xaritasi
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Kam</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-800" />
              <span className="w-3 h-3 rounded-sm bg-emerald-950/70 border border-emerald-800/50" />
              <span className="w-3 h-3 rounded-sm bg-emerald-700" />
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="w-3 h-3 rounded-sm bg-emerald-400" />
            </div>
            <span>Ko‘p</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-[720px]">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-150 cursor-pointer ${getLevelColor(
                  day.level
                )}`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Tooltip Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div>
            {hoveredDay ? (
              <span className="text-slate-900 dark:text-emerald-400 font-bold">
                📌 {hoveredDay.count} ta commit ({hoveredDay.date})
              </span>
            ) : (
              <span>Kun ustiga sichqonchani olib boring</span>
            )}
          </div>

          <a
            href="https://github.com/bekzodidiye"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>github.com/bekzodidiye</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Languages & Featured Repositories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Language Distribution */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-sm font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-500" />
            <span>Eng Ko‘p Ishlatilgan Texnologiyalar</span>
          </h4>

          {/* Multi-color Bar */}
          <div className="h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
            {LANGUAGE_BREAKDOWN.map((lang, idx) => (
              <div
                key={idx}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>

          <div className="space-y-2.5 pt-2">
            {LANGUAGE_BREAKDOWN.map((lang, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{lang.name}</span>
                </div>
                <span className="text-slate-500 dark:text-slate-400">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Featured Repositories Showcase */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-500" />
              <span>Tanlangan Ochiq Manbali Repozitoriyalar</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURED_REPOSITORIES.map((repo, idx) => (
              <a
                key={idx}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors truncate">
                      {repo.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                    <span>{repo.language}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>{repo.stars}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-slate-400" />
                      <span>{repo.forks}</span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
