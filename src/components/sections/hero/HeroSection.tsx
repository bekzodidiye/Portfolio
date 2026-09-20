import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ArrowRight, Terminal, Send, Bot, ShieldCheck, Cpu, Layers, ChevronDown, Sparkles } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { useLanguage } from '../../../context/LanguageContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { ScrollScene } from '../../common/ScrollScene';
import { Hero3DCanvas, Hero3DCanvasRef } from '../../common/Hero3DCanvas';
import { interpolateKeyframes, Keyframe3D } from '../../../utils/keyframes3d';

// Exact 3D Keyframe Choreography from xalimov.vercel.app architecture
const keyframesCard1: Keyframe3D[] = [
  { progress: 0.1, opacity: 0, transform: { x: 550, y: 220, z: -900, rx: 1.5, ry: 2.2, rz: 0.8, angle: -320, scale: 0.25 } },
  { progress: 0.26, opacity: 1, transform: { x: -200, y: -40, z: -20, rx: 0.2, ry: 0.5, rz: 0.12, angle: 16, scale: 1.25 } },
  { progress: 0.4, opacity: 1, transform: { x: -220, y: -60, z: 10, rx: 0.2, ry: 0.5, rz: 0.12, angle: 22, scale: 1.3 } },
  { progress: 0.54, opacity: 0, transform: { x: -750, y: -380, z: 500, rx: -1.2, ry: 2.8, rz: 1.2, angle: 360, scale: 0.35 } },
];

const keyframesCard2: Keyframe3D[] = [
  { progress: 0.36, opacity: 0, transform: { x: -550, y: -220, z: -900, rx: 2.2, ry: 1.5, rz: -0.8, angle: 320, scale: 0.25 } },
  { progress: 0.52, opacity: 1, transform: { x: 200, y: 40, z: -20, rx: 0.5, ry: 0.2, rz: -0.12, angle: -16, scale: 1.25 } },
  { progress: 0.66, opacity: 1, transform: { x: 220, y: 60, z: 10, rx: 0.5, ry: 0.2, rz: -0.12, angle: -22, scale: 1.3 } },
  { progress: 0.8, opacity: 0, transform: { x: 750, y: 380, z: 500, rx: 1.2, ry: -2.8, rz: -1.2, angle: -360, scale: 0.35 } },
];

const keyframesCard3: Keyframe3D[] = [
  { progress: 0.6, opacity: 0, transform: { x: 0, y: 550, z: -1000, rx: 2.5, ry: 1.8, rz: 1.5, angle: -360, scale: 0.25 } },
  { progress: 0.74, opacity: 1, transform: { x: 0, y: 0, z: 0, rx: 0.08, ry: 0.08, rz: 0.1, angle: 0, scale: 1.3 } },
  { progress: 0.88, opacity: 1, transform: { x: 0, y: -20, z: 20, rx: 0.08, ry: 0.08, rz: 0.1, angle: 8, scale: 1.35 } },
  { progress: 0.98, opacity: 0, transform: { x: 0, y: -650, z: 600, rx: -1.8, ry: 2.5, rz: -1.8, angle: 420, scale: 0.35 } },
];

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const { candidateProfile } = usePortfolioData();

  const canvas3dRef = useRef<Hero3DCanvasRef>(null);
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
      // 1. Scrub Three.js 3D Cyber Model
      if (canvas3dRef.current) {
        canvas3dRef.current.drawProgress(progress);
      }

      if (prefersReducedMotion) return;

      // 2. Initial Centered Hero Intro Fade Out (progress 0 -> 0.15)
      if (introRef.current) {
        const introOpacity = progress < 0.15 ? Math.max(0, 1 - progress / 0.15) : 0;
        introRef.current.style.opacity = introOpacity.toString();
        introRef.current.style.transform = `translateY(${-60 * progress}px)`;
        introRef.current.style.pointerEvents = introOpacity > 0.05 ? 'auto' : 'none';
      }

      // Scroll Cue Fade
      if (scrollIndicatorRef.current) {
        const indOpacity = progress < 0.08 ? 1 - progress / 0.08 : 0;
        scrollIndicatorRef.current.style.opacity = indOpacity.toString();
      }

      // 3. 3D Keyframe Cards Interpolation (Desktop only)
      if (window.innerWidth >= 768) {
        if (card1Ref.current) {
          const s1 = interpolateKeyframes(keyframesCard1, progress);
          card1Ref.current.style.opacity = s1.opacity.toString();
          card1Ref.current.style.transform = s1.transformString;
          card1Ref.current.style.pointerEvents = s1.opacity > 0.35 ? 'auto' : 'none';
        }

        if (card2Ref.current) {
          const s2 = interpolateKeyframes(keyframesCard2, progress);
          card2Ref.current.style.opacity = s2.opacity.toString();
          card2Ref.current.style.transform = s2.transformString;
          card2Ref.current.style.pointerEvents = s2.opacity > 0.35 ? 'auto' : 'none';
        }

        if (card3Ref.current) {
          const s3 = interpolateKeyframes(keyframesCard3, progress);
          card3Ref.current.style.opacity = s3.opacity.toString();
          card3Ref.current.style.transform = s3.transformString;
          card3Ref.current.style.pointerEvents = s3.opacity > 0.35 ? 'auto' : 'none';
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
          {/* THREE.JS 3D CYBER ENTITY / NEURAL MESH CANVAS */}
          <Hero3DCanvas ref={canvas3dRef} />

          {/* AMBIENT RADIAL LIGHTING */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37, 99, 235, 0.07), transparent 75%)',
            }}
          />

          {/* MAIN CENTERED HERO INTRO (Active at progress 0.0 -> 0.15) */}
          <div
            ref={introRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Center Profile Avatar / Neural Ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 rounded-full border-2 border-blue-400/60 bg-white/80 backdrop-blur-md overflow-hidden shadow-[0_0_35px_rgba(37,99,235,0.25)] flex items-center justify-center group">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-extrabold font-mono shadow-inner">
                BI
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>

            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50/85 px-4 py-1.5 font-mono text-[11px] tracking-widest text-blue-700 backdrop-blur-md uppercase rounded-full mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.hero.badgeAvailable}</span>
            </div>

            {/* Large Bold Display Name */}
            <h1 className="mx-auto font-display font-extrabold tracking-tight leading-[1.06] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 drop-shadow-sm">
              {candidateProfile.name}
            </h1>

            {/* Tech Subtitle */}
            <p className="mx-auto mt-3 font-mono tracking-widest uppercase font-semibold text-xs sm:text-sm text-blue-600">
              Python • FastAPI • School 21 • Telegram Bot Architecture
            </p>

            {/* Mission Bio */}
            <p className="mx-auto mt-4 max-w-[56ch] text-sm sm:text-base leading-relaxed text-slate-600 font-sans">
              {t.hero.subtext}
            </p>

            {/* Action CTAs with Magnetic Physics */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
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
                  title="Telegram Assistant Bot"
                >
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-mono font-semibold">Bot Assistant</span>
                </a>
              </MagneticButton>
            </div>

            {/* Metrics Counter Bar */}
            <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 border-t border-slate-200/80 pt-5">
              <div className="text-center">
                <span className="block text-2xl font-bold font-mono text-blue-600">
                  <AnimatedCounter target={candidateProfile.freelanceCount} suffix="+" duration={1000} />
                </span>
                <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{t.hero.statFreelance}</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <span className="block text-2xl font-bold font-mono text-indigo-600">School 21</span>
                <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{t.hero.statSchool21}</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="text-center">
                <span className="block text-2xl font-bold font-mono text-amber-600">Python 3.12+</span>
                <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{t.hero.statPython}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 hidden sm:block" />
              <div className="text-center hidden sm:block">
                <span className="block text-2xl font-bold font-mono text-slate-900">Bukhara</span>
                <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">{t.hero.statLocation}</span>
              </div>
            </div>
          </div>

          {/* 3D PERSPECTIVE CAROUSEL STAGE (Card 1, Card 2, Card 3 fly in with 3D rotation) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
          >
            {/* CARD 1: Qadriyatlar & Tamoyillar (Flies to LEFT at x: -200, y: -40) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                ref={card1Ref}
                className="origin-center"
                style={{ opacity: 0, transform: 'translate3d(0,0,0) scale(0.1)', willChange: 'transform, opacity' }}
              >
                <div
                  className="p-8 md:p-9 rounded-3xl border border-blue-400/50 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(37,99,235,0.35),0_0_40px_rgba(59,130,246,0.2)]"
                  style={{ width: 'min(500px, 92vw)' }}
                >
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-blue-600 uppercase tracking-widest font-semibold block">
                        Stage 01 • Philosophy
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900">
                        Qadriyatlar & Tamoyillar
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-3.5 font-sans text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                      <span>Toza, o'qilishi oson va masshtablanuvchi kod yozish madaniyati (SRP, Clean Architecture)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                      <span>Doimiy o'rganish va amaliyot orqali yangi backend tizimlarini egallash</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                      <span>Muammolarga innovatsion avtonom bot va AI integratsiyalari orqali yechim topish</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CARD 2: Hozir O'rganayotganlar (Flies to RIGHT at x: 200, y: 40) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                ref={card2Ref}
                className="origin-center"
                style={{ opacity: 0, transform: 'translate3d(0,0,0) scale(0.1)', willChange: 'transform, opacity' }}
              >
                <div
                  className="p-8 md:p-9 rounded-3xl border border-emerald-400/50 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(16,185,129,0.35),0_0_40px_rgba(16,185,129,0.2)]"
                  style={{ width: 'min(490px, 92vw)' }}
                >
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-sm">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-emerald-600 uppercase tracking-widest font-semibold block">
                        Stage 02 • Active Deep-Dive
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900">
                        Hozir O'rganayotganlar
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-3.5 font-sans text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span>High-Performance Async Backends & FastAPI Event Loops</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span>Large Language Models (LLM) & RAG Vector Systems</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span>School 21 C/C++ Low-Level Systems & Algorithmics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CARD 3: Hozir Ishlayotgan Loyihalar (Flies to CENTER at x: 0, y: 0) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                ref={card3Ref}
                className="origin-center"
                style={{ opacity: 0, transform: 'translate3d(0,0,0) scale(0.1)', willChange: 'transform, opacity' }}
              >
                <div
                  className="p-8 md:p-9 rounded-3xl border border-indigo-400/50 bg-white/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(99,102,241,0.35),0_0_40px_rgba(99,102,241,0.2)]"
                  style={{ width: 'min(480px, 92vw)' }}
                >
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shadow-sm">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-indigo-600 uppercase tracking-widest font-semibold block">
                        Stage 03 • Current Production
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900">
                        Hozir Ishlayotganlar
                      </h3>
                    </div>
                  </div>

                  <ul className="space-y-3.5 font-sans text-sm text-slate-700 leading-relaxed font-medium">
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <span>AI Portfolio & Interactive Real-Time Web Platform</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <span>Official Telegram Bot Assistant with WebApp & FSM Engine</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      <span>Kwork & Freelance Production Client Deliveries (8+ Orders)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Scroll Cue */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none transition-opacity duration-300"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">
              Scroll
            </span>
            <div className="w-px h-7 bg-gradient-to-b from-blue-500/60 to-transparent" />
          </div>
        </ScrollScene>
      </div>

      {/* MOBILE RESPONSIVE FALLBACK (block md:hidden) */}
      <section className="block md:hidden pt-24 pb-14 px-5 bg-transparent text-center flex flex-col justify-center items-center">
        <div className="relative w-24 h-24 mb-4 rounded-full border-2 border-blue-400/60 bg-white shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold font-mono">
            BI
          </div>
          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono mb-3 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.hero.badgeAvailable}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 font-sans">
          {candidateProfile.name}
        </h1>

        <p className="text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider mb-4">
          Python • Backend • School 21
        </p>

        <p className="text-xs text-slate-600 leading-relaxed max-w-xs mb-6">
          {t.hero.subtext}
        </p>

        <div className="flex flex-col gap-2.5 w-full max-w-xs mb-8">
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

        <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
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
      </section>
    </>
  );
};
