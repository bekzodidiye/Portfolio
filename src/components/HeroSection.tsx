import React from 'react';
import { ArrowRight, Terminal, Send } from 'lucide-react';
import { CANDIDATE_PROFILE } from '../data/portfolioData';
import { HeroSystemVisualizer } from './HeroSystemVisualizer';
import { useLanguage } from '../context/LanguageContext';
import { MagneticButton } from './MagneticButton';
import { AnimatedCounter } from './AnimatedCounter';
import { useGsapReveal } from '../hooks/useGsapReveal';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useGsapReveal<HTMLElement>({
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    start: 'top 95%',
    selector: '.hero-reveal',
  });

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-[90vh] pt-28 pb-16 flex items-center px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Engineer Bio & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Availability Badge */}
          <div className="hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold">{t.hero.badgeAvailable}</span>
          </div>

          {/* Main Title */}
          <h1 className="hero-reveal text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-4 font-sans">
            BEKZOD <span className="text-blue-600">IDIYEV</span>
          </h1>

          {/* Brief Subtext */}
          <p className="hero-reveal text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mb-8">
            {t.hero.subtext}
          </p>

          {/* Action CTAs with Magnetic Physics */}
          <div className="hero-reveal flex flex-wrap items-center gap-3.5 mb-8 w-full sm:w-auto">
            <MagneticButton strength={0.3}>
              <a
                href="#projects"
                className="px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t.hero.exploreProjects}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.25}>
              <a
                href="#contact"
                className="px-5 py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>{t.hero.getInTouch}</span>
              </a>
            </MagneticButton>

            <MagneticButton strength={0.35}>
              <a
                href={CANDIDATE_PROFILE.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl font-mono text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                title="Telegram DM"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono font-medium hidden sm:inline">@toyneden</span>
              </a>
            </MagneticButton>
          </div>

          {/* Metric Badges Grid with Animated Numbers */}
          <div className="hero-reveal grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-xl">
            <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
              <span className="block text-xl font-bold font-mono text-blue-600">
                <AnimatedCounter target={7} suffix="+" duration={1000} />
              </span>
              <span className="text-[11px] text-slate-500 font-mono">{t.hero.statFreelance}</span>
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
              <span className="block text-xl font-bold font-mono text-indigo-600">School 21</span>
              <span className="text-[11px] text-slate-500 font-mono">{t.hero.statSchool21}</span>
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all">
              <span className="block text-xl font-bold font-mono text-amber-600">Python 3.12+</span>
              <span className="text-[11px] text-slate-500 font-mono">{t.hero.statPython}</span>
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all">
              <span className="block text-xl font-bold font-mono text-slate-900">Bukhara</span>
              <span className="text-[11px] text-slate-500 font-mono">{t.hero.statLocation}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visualizer Console */}
        <div className="hero-reveal lg:col-span-5 flex justify-center w-full">
          <HeroSystemVisualizer />
        </div>
      </div>
    </section>
  );
};

