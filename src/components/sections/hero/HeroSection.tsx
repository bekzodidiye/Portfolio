import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ArrowRight, Terminal, Send, Bot, Heart, Sparkles, Code, ShieldCheck, Cpu, Layers, ChevronDown } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { HeroSystemVisualizer } from './HeroSystemVisualizer';
import { useLanguage } from '../../../context/LanguageContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { ScrollScene } from '../../common/ScrollScene';
import { interpolateKeyframes, Keyframe3D } from '../../../utils/keyframes3d';

const keyframesCard1: Keyframe3D[] = [
  { progress: 0.08, opacity: 0, transform: { x: 550, y: 220, z: -900, rx: 1.5, ry: 2.2, rz: 0.8, angle: -320, scale: 0.25 } },
  { progress: 0.24, opacity: 1, transform: { x: -160, y: -30, z: -10, rx: 0.2, ry: 0.5, rz: 0.12, angle: 14, scale: 1.15 } },
  { progress: 0.38, opacity: 1, transform: { x: -180, y: -50, z: 20, rx: 0.2, ry: 0.5, rz: 0.12, angle: 20, scale: 1.2 } },
  { progress: 0.50, opacity: 0, transform: { x: -750, y: -380, z: 500, rx: -1.2, ry: 2.8, rz: 1.2, angle: 360, scale: 0.35 } },
];

const keyframesCard2: Keyframe3D[] = [
  { progress: 0.34, opacity: 0, transform: { x: -550, y: -220, z: -900, rx: 2.2, ry: 1.5, rz: -0.8, angle: 320, scale: 0.25 } },
  { progress: 0.50, opacity: 1, transform: { x: 160, y: 30, z: -10, rx: 0.5, ry: 0.2, rz: -0.12, angle: -14, scale: 1.15 } },
  { progress: 0.64, opacity: 1, transform: { x: 180, y: 50, z: 20, rx: 0.5, ry: 0.2, rz: -0.12, angle: -20, scale: 1.2 } },
  { progress: 0.78, opacity: 0, transform: { x: 750, y: 380, z: 500, rx: 1.2, ry: -2.8, rz: -1.2, angle: -360, scale: 0.35 } },
];

const keyframesCard3: Keyframe3D[] = [
  { progress: 0.58, opacity: 0, transform: { x: 0, y: 550, z: -1000, rx: 2.5, ry: 1.8, rz: 1.5, angle: -360, scale: 0.25 } },
  { progress: 0.74, opacity: 1, transform: { x: 0, y: 0, z: 0, rx: 0.08, ry: 0.08, rz: 0.1, angle: 0, scale: 1.15 } },
  { progress: 0.88, opacity: 1, transform: { x: 0, y: -20, z: 20, rx: 0.08, ry: 0.08, rz: 0.1, angle: 6, scale: 1.2 } },
  { progress: 0.98, opacity: 0, transform: { x: 0, y: -650, z: 600, rx: -1.8, ry: 2.5, rz: -1.8, angle: 420, scale: 0.35 } },
];

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const { candidateProfile } = usePortfolioData();

  const introRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleProgress = useCallback(
    (progress: number) => {
      if (prefersReducedMotion) return;

      // 1. Initial Hero Text Fade/Lift (progress 0 -> 0.18)
      if (introRef.current) {
        const introOpacity = progress < 0.16 ? Math.max(0, 1 - progress / 0.16) : 0;
        introRef.current.style.opacity = introOpacity.toString();
        introRef.current.style.transform = `translateY(${-70 * progress}px) scale(${1 - progress * 0.15})`;
        introRef.current.style.pointerEvents = introOpacity > 0.1 ? 'auto' : 'none';
      }

      // Scroll Indicator Fade Out
      if (scrollIndicatorRef.current) {
        const indOpacity = progress < 0.08 ? 1 - progress / 0.08 : 0;
        scrollIndicatorRef.current.style.opacity = indOpacity.toString();
      }

      // 2. 3D Keyframe Cards (Desktop only)
      if (window.innerWidth >= 768) {
        if (card1Ref.current) {
          const s1 = interpolateKeyframes(keyframesCard1, progress);
          card1Ref.current.style.opacity = s1.opacity.toString();
          card1Ref.current.style.transform = s1.transformString;
          card1Ref.current.style.pointerEvents = s1.opacity > 0.4 ? 'auto' : 'none';
        }

        if (card2Ref.current) {
          const s2 = interpolateKeyframes(keyframesCard2, progress);
          card2Ref.current.style.opacity = s2.opacity.toString();
          card2Ref.current.style.transform = s2.transformString;
          card2Ref.current.style.pointerEvents = s2.opacity > 0.4 ? 'auto' : 'none';
        }

        if (card3Ref.current) {
          const s3 = interpolateKeyframes(keyframesCard3, progress);
          card3Ref.current.style.opacity = s3.opacity.toString();
          card3Ref.current.style.transform = s3.transformString;
          card3Ref.current.style.pointerEvents = s3.opacity > 0.4 ? 'auto' : 'none';
        }
      }
    },
    [prefersReducedMotion]
  );

  return (
    <>
      {/* DESKTOP 3D SCROLL SCENE (height: 500vh, Sticky Pinned Viewport) */}
      <div className="hidden md:block">
        <ScrollScene
          height="500vh"
          onProgress={handleProgress}
          id="hero"
          className="bg-transparent"
        >
          {/* Subtle Ambient Radial Glow on Scroll */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(59, 130, 246, 0.08), transparent 75%)',
            }}
          />

          {/* MAIN HERO INTRO (Active at progress 0 -> 0.16) */}
          <div
            ref={introRef}
            className="absolute inset-0 z-10 flex items-center justify-center px-6 lg:px-12"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Col: Bio & CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-700 text-xs font-mono mb-6 shadow-sm backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">{t.hero.badgeAvailable}</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-4 font-sans leading-[1.08]">
                  {candidateProfile.name}
                </h1>

                <p className="text-base text-slate-600 leading-relaxed max-w-xl mb-8">
                  {t.hero.subtext}
                </p>

                <div className="flex flex-wrap items-center gap-3.5 mb-8 w-full sm:w-auto">
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
                      href={candidateProfile.botUrl || 'https://t.me/my_portfolio_support_bot'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl font-mono text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm"
                      title="Interactive Telegram Assistant Bot"
                    >
                      <Bot className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-mono font-semibold">Bot Assistant</span>
                    </a>
                  </MagneticButton>

                  <MagneticButton strength={0.35}>
                    <a
                      href={candidateProfile.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl font-mono text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                      title="Telegram DM"
                    >
                      <Send className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-mono font-medium hidden sm:inline">{candidateProfile.telegramHandle}</span>
                    </a>
                  </MagneticButton>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-xl">
                  <div className="bg-white/90 p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
                    <span className="block text-xl font-bold font-mono text-blue-600">
                      <AnimatedCounter target={candidateProfile.freelanceCount} suffix="+" duration={1000} />
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

              {/* Right Column: Console Visualizer */}
              <div className="lg:col-span-5 flex justify-center w-full">
                <HeroSystemVisualizer />
              </div>
            </div>
          </div>

          {/* 3D PERSPECTIVE CAROUSEL STAGE (Card 1, Card 2, Card 3 fly in across 500vh) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
          >
            {/* CARD 1: Qadriyatlar & Tamoyillar (Principles & Values) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                ref={card1Ref}
                className="origin-center"
                style={{ opacity: 0, transform: 'translate3d(0,0,0) scale(0.1)', willChange: 'transform, opacity' }}
              >
                <div
                  className="p-8 md:p-10 rounded-3xl border border-blue-200/80 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(59,130,246,0.3),0_0_40px_rgba(59,130,246,0.15)]"
                  style={{ width: 'min(520px, 92vw)' }}
                >
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-blue-600 uppercase tracking-widest font-semibold block">
                        Chapter 01 • Philosophy
                      </span>
                      <h3 className="font-display text-2xl font-bold text-slate-900">
                        Qadriyatlar & Tamoyillar
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-4 font-sans text-sm md:text-base text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">Toza va masshtablanuvchan kod:</strong> Har bir modul SRP (Single Responsibility) qoidasiga bo'ysunadi.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">Production-Grade Barqarorlik:</strong> Xatolar yutib yuborilmaydi, logging va test qamrovi birlamchi mezon.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">AI & Avtomatlashtirish:</strong> Murakkab jarayonlarni intellektual botlar va avtonom agentlar bilan soddalashtirish.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CARD 2: Hozir O'rganayotgan & Rivojlantirayotganlar (Active Learning) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                ref={card2Ref}
                className="origin-center"
                style={{ opacity: 0, transform: 'translate3d(0,0,0) scale(0.1)', willChange: 'transform, opacity' }}
              >
                <div
                  className="p-8 md:p-10 rounded-3xl border border-emerald-200/80 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.15)]"
                  style={{ width: 'min(520px, 92vw)' }}
                >
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-sm">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest font-semibold block">
                        Chapter 02 • Growth & Deep-Dive
                      </span>
                      <h3 className="font-display text-2xl font-bold text-slate-900">
                        Hozir O'rganayotganlarim
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-4 font-sans text-sm md:text-base text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">High-Performance Async Backend:</strong> FastAPI, AsyncIO, event-driven mikroservislar va optimizatsiyalar.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">LLM Agents & RAG Pipelines:</strong> Gemini API, kontekstual xotira va bot orqali interaktiv tahlil.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">Algoritmlar & Tizimli dasturlash:</strong> School 21 intensiv dasturida past darajadagi C/C++ xotira xavfsizligi.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CARD 3: Hozir Ishlayotgan Loyihalar (Active Works) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                ref={card3Ref}
                className="origin-center"
                style={{ opacity: 0, transform: 'translate3d(0,0,0) scale(0.1)', willChange: 'transform, opacity' }}
              >
                <div
                  className="p-8 md:p-10 rounded-3xl border border-indigo-200/80 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(99,102,241,0.3),0_0_40px_rgba(99,102,241,0.15)]"
                  style={{ width: 'min(520px, 92vw)' }}
                >
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-indigo-600 uppercase tracking-widest font-semibold block">
                        Chapter 03 • Current Production
                      </span>
                      <h3 className="font-display text-2xl font-bold text-slate-900">
                        Faol Loyihalar & Ishlar
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-4 font-sans text-sm md:text-base text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">AI Portfolio Platform:</strong> Neon PostgreSQL, serverless Vercel backend va real vaqtli visitor monitoring.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">Telegram Bot Ekotizimi:</strong> Foydalanuvchilar bilan 24/7 aloqa, so'rovnomalar va avtomatlashtirilgan xabardorlik.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      <span>
                        <strong className="text-slate-900 font-semibold">Freelance & Tijoriy Buyurtmalar:</strong> 25+ muvaffaqiyatli topshirilgan backend va veb yechimlar.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Scroll Cue */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none transition-opacity duration-300"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
              Scroll to explore
            </span>
            <ChevronDown className="w-4 h-4 text-blue-600 animate-bounce" />
          </div>
        </ScrollScene>
      </div>

      {/* MOBILE RESPONSIVE FALLBACK (block md:hidden) - Zero sticky trap for mobile! */}
      <section className="block md:hidden pt-24 pb-14 px-4 bg-transparent">
        <div className="flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{t.hero.badgeAvailable}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3 font-sans">
            {candidateProfile.name}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {t.hero.subtext}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full mb-8">
            <a
              href="#projects"
              className="px-5 py-3 rounded-xl font-mono text-xs font-semibold text-white bg-blue-600 text-center shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              <span>{t.hero.exploreProjects}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={candidateProfile.botUrl || 'https://t.me/my_portfolio_support_bot'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 text-center flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Telegram Bot</span>
            </a>
          </div>

          {/* Mobile metrics */}
          <div className="grid grid-cols-2 gap-2 w-full mb-8">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="block text-lg font-bold font-mono text-blue-600">
                {candidateProfile.freelanceCount}+
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{t.hero.statFreelance}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="block text-lg font-bold font-mono text-indigo-600">School 21</span>
              <span className="text-[10px] text-slate-500 font-mono">{t.hero.statSchool21}</span>
            </div>
          </div>

          {/* Mobile Visualizer */}
          <div className="w-full">
            <HeroSystemVisualizer />
          </div>
        </div>
      </section>
    </>
  );
};
