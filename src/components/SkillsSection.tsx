import React from 'react';
import { Layers } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useLanguage } from '../context/LanguageContext';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useGsapDepthParallax } from '../hooks/useGsapDepthParallax';
import { SkillTiltCard } from './SkillTiltCard';

export const SkillsSection: React.FC = () => {
  const { t } = useLanguage();
  const { skillCategories } = usePortfolioData();
  const sectionRef = useGsapReveal<HTMLElement>({
    y: 35,
    duration: 0.85,
    stagger: 0.12,
    start: 'top 85%',
    selector: '.skills-reveal',
  });

  const parallaxGridRef = useGsapDepthParallax<HTMLDivElement>({
    liftDistance: -18,
    tiltAngle: 2.5,
    stagger: 0.08,
  });

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

  return (
    <section ref={sectionRef} id="skills" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="skills-reveal text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.skills.titleBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {t.skills.heading}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
            {t.skills.subheading}
          </p>
        </div>

        <div ref={parallaxGridRef} className="skills-reveal grid grid-cols-1 md:grid-cols-2 gap-6 perspective-3d">
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
      </div>
    </section>
  );
};
