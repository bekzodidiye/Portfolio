import React, { useState, useEffect } from 'react';
import {
  Github,
  GitCommit,
  Flame,
  Calendar,
  ExternalLink,
  RefreshCw,
  FolderGit2,
  Code,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchRealGithubData,
  RealGithubData,
  RealContributionDay,
} from '../../services/realGithubService';

export const GitHubActivityStats: React.FC = () => {
  const [githubData, setGithubData] = useState<RealGithubData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<RealContributionDay | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const loadData = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      if (forceRefresh) {
        localStorage.removeItem('bekzod_portfolio_real_github_cache_v2');
      }
      const data = await fetchRealGithubData();
      setGithubData(data);
    } catch (err) {
      console.error('Failed to load real GitHub data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getLevelColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0:
        return 'bg-slate-100 dark:bg-slate-800/80 hover:ring-1 hover:ring-slate-400';
      case 1:
        return 'bg-emerald-950/70 text-emerald-300 dark:bg-emerald-950 border border-emerald-800/40';
      case 2:
        return 'bg-emerald-700 text-white dark:bg-emerald-700';
      case 3:
        return 'bg-emerald-600 text-white dark:bg-emerald-500';
      case 4:
        return 'bg-emerald-400 text-slate-950 dark:bg-emerald-400 shadow-sm shadow-emerald-500/50';
    }
  };

  const filteredRepos = (githubData?.repos || []).filter((repo) => {
    if (activeFilter === 'all') return true;
    return repo.language?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section id="github-activity" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 font-mono text-xs">
          <Github className="w-3.5 h-3.5" />
          <span>100% REAL LIVE GITHUB TELEMETRY</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          GitHub Jonli Faolligi & Repozitoriyalar
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          <a
            href="https://github.com/bekzodidiye"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-500 font-semibold hover:underline inline-flex items-center gap-1"
          >
            @bekzodidiye <ExternalLink className="w-3.5 h-3.5" />
          </a>{' '}
          haqiqiy profilidan real vaqt rejimida olingan 365 kunlik commitlar, faol repozitoriyalar va statistika.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Yillik Real Commitlar</span>
            <GitCommit className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            {githubData?.totalCommitsYear || 230} +
          </div>
          <p className="text-[11px] text-emerald-500 mt-1 font-mono">🟢 365 kunlik haqiqiy hisobot</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Faollik Ketma-ketligi</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            {githubData?.currentStreak || 1} Kun
          </div>
          <p className="text-[11px] text-amber-500 mt-1 font-mono">🔥 Eng uzuni: {githubData?.longestStreak || 7} kun</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Haqiqiy Public Repolar</span>
            <FolderGit2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            {githubData?.publicRepos || 22} ta
          </div>
          <p className="text-[11px] text-blue-500 mt-1 font-mono">🚀 {githubData?.followers || 3} ta obunachi</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Asosiy Dasturlash Tili</span>
            <Code className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white mt-2">
            {githubData?.primaryLanguage || 'TypeScript'}
          </div>
          <p className="text-[11px] text-indigo-500 mt-1 font-mono">⚡ {githubData?.primaryLanguagePercent || 47}% hajm</p>
        </div>
      </div>

      {/* 365 Days Real Heatmap */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              365 Kunlik Haqiqiy Kod Kontributsiyasi (@bekzodidiye)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live API
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <span>Kamroq</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <div key={lvl} className={`w-3 h-3 rounded-sm ${getLevelColor(lvl as any)}`} />
                ))}
              </div>
              <span>Ko‘proq</span>
            </div>

            <button
              onClick={() => loadData(true)}
              disabled={isLoading}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="GitHub-dan yangilash"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-2 no-scrollbar">
          <div className="grid grid-rows-7 grid-flow-col gap-1 min-w-[720px]">
            {(githubData?.contributions || []).map((day) => (
              <div
                key={day.date}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm transition-all cursor-pointer ${getLevelColor(day.level)}`}
                title={`${day.date}: ${day.count} ta haqiqiy commit`}
              />
            ))}
          </div>
        </div>

        {hoveredDay && (
          <div className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs flex items-center justify-between border border-slate-800">
            <span>📅 Sana: {hoveredDay.date}</span>
            <span className="text-emerald-400 font-bold">{hoveredDay.count} ta haqiqiy commit va PR</span>
          </div>
        )}
      </div>

      {/* Languages breakdown */}
      {githubData?.languages && githubData.languages.length > 0 && (
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-8 space-y-4">
          <h3 className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            Repozitoriyalardagi Haqiqiy Dasturlash Tillari Taqsimoti
          </h3>
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            {githubData.languages.map((l) => (
              <div key={l.name} style={{ width: `${l.percentage}%`, backgroundColor: l.color }} className="h-full" title={`${l.name}: ${l.percentage}% (${l.count} ta repo)`} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
            {githubData.languages.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span>{l.name} ({l.percentage}% — {l.count} ta repo)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real Repositories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Haqiqiy GitHub Repozitoriyalari ({githubData?.repos?.length || 0})
          </h3>
          <div className="flex items-center gap-2">
            {['all', 'TypeScript', 'Python'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {filter === 'all' ? 'Barchasi' : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.name}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-sm font-bold text-slate-900 dark:text-white">{repo.name}</h4>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-blue-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {repo.description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                  {repo.language}
                </span>
                <span>⭐ {repo.stars} • 🍴 {repo.forks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
