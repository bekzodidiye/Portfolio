import React, { useRef, useCallback } from 'react';
import { Layers, Server, Database, Cpu, ShieldCheck, Code } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { useLanguage } from '../../../context/LanguageContext';
import { ScrollScene } from '../../common/ScrollScene';

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-5 h-5 text-blue-600" />,
  Database: <Database className="w-5 h-5 text-indigo-600" />,
  Cpu: <Cpu className="w-5 h-5 text-amber-600" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
};

const getTargetPercentage = (level: string, index: number): number => {
  if (level === 'Expert') return 92 + (index % 3) * 3; // 92% - 98%
  if (level === 'Advanced') return 82 + (index % 3) * 3; // 82% - 88%
  return 72 + (index % 3) * 3; // 72% - 78%
};

export const SkillsSection: React.FC = () => {
  const { t } = useLanguage();
  const { skillCategories } = usePortfolioData();

  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[][]>([]);

  const getLocalizedCategory = (idx: number) => {
    switch (idx) {
      case 0:
        return {
          title: t.skills.categories.backendTitle,
          desc: t.skills.categories.backendDesc,
        };
      case 1:
        return {
          title: t.skills.categories.dbTitle,
          desc: t.skills.categories.dbDesc,
        };
      case 2:
        return {
          title: t.skills.categories.devopsTitle,
          desc: t.skills.categories.devopsDesc,
        };
      case 3:
        return {
          title: t.skills.categories.archTitle,
          desc: t.skills.categories.archDesc,
        };
      default:
        return { title: '', desc: '' };
    }
  };

  const handleProgress = useCallback(
    (progress: number) => {
      // 1. Header reveal
      if (headerRef.current) {
        const hVal = Math.min(1, Math.max(0, progress / 0.15));
        headerRef.current.style.opacity = hVal.toString();
        headerRef.current.style.transform = `translateY(${(1 - hVal) * 20}px)`;
      }

      // 2. Cards reveal and Scrubbed Progress Bars
      if (window.innerWidth >= 768) {
        skillCategories.forEach((cat, catIdx) => {
          const cardEl = cardRefs.current[catIdx];
          if (!cardEl) return;

          // Card entrance
          const cardStart = 0.08 + catIdx * 0.08;
          const cardEnd = cardStart + 0.22;
          const cardFactor = Math.min(1, Math.max(0, (progress - cardStart) / (cardEnd - cardStart)));

          cardEl.style.opacity = cardFactor.toString();
          cardEl.style.transform = `translateY(${((1 - cardFactor) * 30).toFixed(1)}px) scale(${(0.94 + 0.06 * cardFactor).toFixed(3)})`;

          // Skill Bars fill up based on scroll
          const barsForCat = barRefs.current[catIdx];
          if (barsForCat) {
            cat.skills.forEach((skill, sIdx) => {
              const barEl = barsForCat[sIdx];
              if (!barEl) return;

              const target = getTargetPercentage(skill.level, sIdx);
              const barStart = 0.2 + catIdx * 0.12 + sIdx * 0.04;
              const barEnd = barStart + 0.28;
              let fillRatio = 0;
              if (progress >= barStart) {
                fillRatio = Math.min(1, Math.max(0, (progress - barStart) / (barEnd - barStart)));
              }
              barEl.style.width = `${(fillRatio * target).toFixed(1)}%`;
            });
          }
        });
      }
    },
    [skillCategories]
  );

  return (
    <>
      {/* DESKTOP 3D SCROLL SCENE (height: 450vh, Sticky Pinned Viewport) */}
      <div className="hidden md:block">
        <ScrollScene
          height="450vh"
          onProgress={handleProgress}
          id="skills"
          className="bg-transparent text-slate-900"
        >
          {/* Ambient Lighting */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99, 102, 241, 0.06), transparent 70%)',
            }}
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-14 max-w-6xl mx-auto w-full">
            <div ref={headerRef} className="text-center max-w-2xl mx-auto pt-4" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 border border-indigo-200 bg-indigo-50 px-3.5 py-1 inline-block mb-3 rounded-full font-semibold shadow-sm">
                TEXNIK ARSENALIM
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
                {t.skills.heading}
              </h2>
              <p className="font-sans text-slate-600 text-sm max-w-md mx-auto">
                {t.skills.subheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full pb-6">
              {skillCategories.map((category, idx) => {
                const loc = getLocalizedCategory(idx);
                if (!barRefs.current[idx]) {
                  barRefs.current[idx] = [];
                }

                return (
                  <div
                    key={category.title}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    className="p-6 rounded-3xl border border-indigo-200/80 bg-white/90 backdrop-blur-2xl shadow-xl hover:border-indigo-400 transition-all duration-300"
                    style={{
                      opacity: 0,
                      transform: 'translateY(30px) scale(0.94)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                          {ICON_MAP[category.iconName] || <Code className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide">
                            {loc.title || category.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-sans">{loc.desc || category.description}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md uppercase">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {category.skills.map((skill, sIdx) => {
                        const target = getTargetPercentage(skill.level, sIdx);
                        return (
                          <div key={sIdx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-slate-800 font-medium truncate">
                                {skill.name}
                              </span>
                              <span className="font-mono text-indigo-600 font-bold text-[11px]">
                                {target}%
                              </span>
                            </div>

                            <div
                              className="relative h-2.5 w-full rounded-full overflow-hidden"
                              style={{
                                background: 'rgba(226, 232, 240, 0.7)',
                                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
                              }}
                            >
                              <div
                                ref={(el) => {
                                  barRefs.current[idx][sIdx] = el;
                                }}
                                className="h-full rounded-full"
                                style={{
                                  width: '0%',
                                  background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #06b6d4 100%)',
                                  boxShadow: '0 0 8px rgba(99,102,241,0.4)',
                                  transition: 'width 0.1s linear',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollScene>
      </div>

      {/* MOBILE RESPONSIVE FALLBACK (block md:hidden) */}
      <section id="skills" className="block md:hidden py-14 px-5 bg-transparent">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1 inline-block mb-3 rounded-full font-semibold">
            TEXNIK ARSENALIM
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2">
            {t.skills.heading}
          </h2>
          <p className="font-sans text-slate-600 text-xs max-w-sm mx-auto">
            {t.skills.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {skillCategories.map((category, idx) => {
            const loc = getLocalizedCategory(idx);
            return (
              <div
                key={category.title}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {ICON_MAP[category.iconName] || <Code className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {loc.title || category.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{loc.desc || category.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, sIdx) => {
                    const target = getTargetPercentage(skill.level, sIdx);
                    return (
                      <div key={sIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-800">{skill.name}</span>
                          <span className="font-mono text-indigo-600 font-bold text-[10px]">{target}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            style={{ width: `${target}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};
