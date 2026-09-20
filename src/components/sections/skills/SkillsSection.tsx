import React, { useRef, useCallback } from 'react';
import { Layers } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { useLanguage } from '../../../context/LanguageContext';
import { SkillTiltCard } from './SkillTiltCard';
import { ScrollScene } from '../../common/ScrollScene';

export const SkillsSection: React.FC = () => {
  const { t } = useLanguage();
  const { skillCategories } = usePortfolioData();

  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        const hVal = Math.min(1, Math.max(0, progress / 0.18));
        headerRef.current.style.opacity = hVal.toString();
        headerRef.current.style.transform = `translateY(${(1 - hVal) * 25}px)`;
      }

      // 2. Cards stagger reveal and 3D depth based on scroll progress
      if (window.innerWidth >= 768) {
        skillCategories.forEach((_, idx) => {
          const el = cardRefs.current[idx];
          if (!el) return;

          const start = 0.12 + idx * 0.12;
          const end = start + 0.35;
          let factor = 0;
          if (progress >= start) {
            factor = Math.min(1, Math.max(0, (progress - start) / (end - start)));
          }

          const translateY = (1 - factor) * 35;
          const scale = 0.92 + 0.08 * factor;
          el.style.opacity = factor.toString();
          el.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
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

          <div className="absolute inset-0 z-10 flex flex-col justify-center max-w-6xl mx-auto px-6">
            <div ref={headerRef} className="text-center mb-10" style={{ opacity: 0 }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50/90 border border-indigo-200 text-indigo-700 text-xs font-mono mb-3 shadow-sm backdrop-blur-md">
                <Layers className="w-3.5 h-3.5" />
                <span>{t.skills.titleBadge}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                {t.skills.heading}
              </h2>
              <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
                {t.skills.subheading}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {skillCategories.map((category, idx) => {
                const loc = getLocalizedCategory(idx);
                return (
                  <div
                    key={category.title}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    style={{
                      opacity: 0,
                      transform: 'translateY(35px) scale(0.92)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    <SkillTiltCard
                      category={category}
                      index={idx}
                      localizedTitle={loc.title || category.title}
                      localizedDesc={loc.desc || category.description}
                      isVisible={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollScene>
      </div>

      {/* MOBILE RESPONSIVE FALLBACK (block md:hidden) */}
      <section id="skills" className="block md:hidden py-16 px-4 bg-transparent">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.skills.titleBadge}</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t.skills.heading}
          </h2>
          <p className="text-slate-600 text-xs max-w-sm mx-auto mt-2">
            {t.skills.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {skillCategories.map((category, idx) => {
            const loc = getLocalizedCategory(idx);
            return (
              <SkillTiltCard
                key={category.title}
                category={category}
                index={idx}
                localizedTitle={loc.title || category.title}
                localizedDesc={loc.desc || category.description}
                isVisible={true}
              />
            );
          })}
        </div>
      </section>
    </>
  );
};
