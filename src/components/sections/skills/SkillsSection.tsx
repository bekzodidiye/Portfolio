import React, { useRef, useCallback } from 'react';
import { Layers, Server, Database, Cpu, ShieldCheck, Code } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { useLanguage } from '../../../context/LanguageContext';
import { ScrollScene } from '../../common/ScrollScene';
import { FrameSequenceCanvas, FrameSequenceCanvasRef } from '../../common/FrameSequenceCanvas';

const SKILL_FRAME_START = 24;
const SKILL_FRAME_END = 212;
const SKILL_FRAME_COUNT = SKILL_FRAME_END - SKILL_FRAME_START + 1;

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-5 h-5 text-blue-600" />,
  Database: <Database className="w-5 h-5 text-indigo-600" />,
  Cpu: <Cpu className="w-5 h-5 text-cyan-600" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
};

const getTargetPercentage = (level: string, index: number): number => {
  if (level === 'Expert') return 92 + (index % 3) * 3;
  if (level === 'Advanced') return 82 + (index % 3) * 3;
  return 72 + (index % 3) * 3;
};

export const SkillsSection: React.FC = () => {
  const { t } = useLanguage();
  const { skillCategories } = usePortfolioData();

  const canvasRef = useRef<FrameSequenceCanvasRef>(null);
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
      // 1. Scrub 3D Skill Frame Sequence Canvas
      if (canvasRef.current) {
        canvasRef.current.drawProgress(progress);
      }

      // 2. Header reveal
      if (headerRef.current) {
        const hVal = Math.min(1, Math.max(0, progress / 0.15));
        headerRef.current.style.opacity = hVal.toString();
        headerRef.current.style.transform = `translateY(${(1 - hVal) * 20}px)`;
      }

      // 3. Cards reveal and Scrubbed Progress Bars
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
      {/* ── DESKTOP 3D SKILL SCROLL SCENE (450vh, Sticky Pinned Viewport) ── */}
      <div className="hidden md:block">
        <ScrollScene
          height="450vh"
          onProgress={handleProgress}
          id="skills"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* Clean White Background */}
          <div className="absolute inset-0 bg-white z-0" />

          {/* 189-FRAME 3D SKILL SEQUENCE CANVAS (inverted for white theme) */}
          <FrameSequenceCanvas
            ref={canvasRef}
            frameCount={SKILL_FRAME_COUNT}
            framePath={(idx) => {
              const normalized = Math.max(1, Math.min(SKILL_FRAME_COUNT, idx));
              const frameNum = Math.round(
                SKILL_FRAME_START +
                  ((normalized - 1) / Math.max(1, SKILL_FRAME_COUNT - 1)) *
                  (SKILL_FRAME_END - SKILL_FRAME_START)
              );
              return `https://xalimov.vercel.app/skill-frames/frame_${String(frameNum).padStart(4, '0')}.jpg`;
            }}
            className="opacity-[0.06] z-0"
            style={{ filter: 'invert(1) contrast(1.2) brightness(1.1)' }}
          />

          {/* Ambient Radial Glow — subtle indigo on white */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99, 102, 241, 0.05), transparent 75%)',
            }}
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-14 max-w-6xl mx-auto w-full pointer-events-none">
            {/* Header */}
            <div ref={headerRef} className="text-center max-w-2xl mx-auto pt-4" style={{ opacity: 0 }}>
              <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 border border-indigo-200 bg-indigo-50 px-3.5 py-1 inline-block mb-3 rounded-full font-semibold shadow-sm">
                TEXNIK ARSENALIM
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
                {t.skills.heading}
              </h2>
              <p className="font-sans text-slate-500 text-sm max-w-md mx-auto">
                {t.skills.subheading}
              </p>
            </div>

            {/* 4 Category Cards in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full pb-6 pointer-events-auto">
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
                    className="p-6 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-indigo-300 hover:shadow-[0_12px_40px_rgba(99,102,241,0.1)] transition-all duration-300"
                    style={{
                      opacity: 0,
                      transform: 'translateY(30px) scale(0.94)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                          {ICON_MAP[category.iconName] || <Code className="w-5 h-5 text-blue-600" />}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-bold text-slate-900 tracking-wide">
                            {loc.title || category.title}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-500">
                            {category.skills.length} texnologiya
                          </span>
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
                          <div key={skill.name} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-medium text-slate-700">{skill.name}</span>
                              <span className="text-slate-400">{target}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div
                                ref={(el) => {
                                  barRefs.current[idx][sIdx] = el;
                                }}
                                className="h-full rounded-full transition-all duration-150"
                                style={{
                                  width: '0%',
                                  background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #06b6d4 100%)',
                                  boxShadow: '0 0 8px rgba(99,102,241,0.3)',
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

      {/* ── MOBILE RESPONSIVE FALLBACK (md:hidden) ── */}
      <section className="block md:hidden py-16 px-4 bg-white">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 border border-indigo-200 bg-indigo-50 px-3 py-1 rounded-full mb-3 inline-block">
            TEXNIK ARSENALIM
          </span>
          <h2 className="text-2xl font-bold font-sans text-slate-900 mb-2">
            {t.skills.heading}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {t.skills.subheading}
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          {skillCategories.map((category, idx) => {
            const loc = getLocalizedCategory(idx);
            return (
              <div
                key={category.title}
                className="p-6 rounded-2xl border border-slate-200 bg-white shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {ICON_MAP[category.iconName] || <Code className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{loc.title || category.title}</h3>
                    <span className="text-[10px] font-mono text-slate-500">
                      {category.skills.length} texnologiya
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, sIdx) => {
                    const target = getTargetPercentage(skill.level, sIdx);
                    return (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-700">{skill.name}</span>
                          <span className="text-slate-400">{target}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${target}%`,
                              background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
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
      </section>
    </>
  );
};
