import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ArrowRight, Terminal, Bot, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { useLanguage } from '../../../context/LanguageContext';
import { MagneticButton } from '../../ui/MagneticButton';
import { AnimatedCounter } from '../../ui/AnimatedCounter';
import { ScrollScene } from '../../common/ScrollScene';
import { FrameSequenceCanvas, FrameSequenceCanvasRef } from '../../common/FrameSequenceCanvas';
import { FloatingSceneCard } from '../../common/FloatingSceneCard';
import { interpolateKeyframes, Keyframe3D } from '../../../utils/keyframes3d';

const FRAME_START = 1;
const FRAME_END = 300;
const FRAME_COUNT = FRAME_END - FRAME_START + 1;

// Exact 3D Keyframe Choreography from xalimov.vercel.app architecture
const card1Timeline: Keyframe3D[] = [
  { progress: 0.10, opacity: 0, transform: { x: 550, y: 220, z: -900, rx: 1.5, ry: 2.2, rz: 0.8, angle: -320, scale: 0.25 } },
  { progress: 0.26, opacity: 1, transform: { x: -180, y: -40, z: -20, rx: 0.2, ry: 0.5, rz: 0.12, angle: 16, scale: 1.25 } },
  { progress: 0.40, opacity: 1, transform: { x: -200, y: -60, z: 10, rx: 0.2, ry: 0.5, rz: 0.12, angle: 22, scale: 1.30 } },
  { progress: 0.54, opacity: 0, transform: { x: -750, y: -380, z: 500, rx: -1.2, ry: 2.8, rz: 1.2, angle: 360, scale: 0.35 } },
];

const card2Timeline: Keyframe3D[] = [
  { progress: 0.36, opacity: 0, transform: { x: -550, y: -220, z: -900, rx: 2.2, ry: 1.5, rz: -0.8, angle: 320, scale: 0.25 } },
  { progress: 0.52, opacity: 1, transform: { x: 180, y: 40, z: -20, rx: 0.5, ry: 0.2, rz: -0.12, angle: -16, scale: 1.25 } },
  { progress: 0.66, opacity: 1, transform: { x: 200, y: 60, z: 10, rx: 0.5, ry: 0.2, rz: -0.12, angle: -22, scale: 1.30 } },
  { progress: 0.80, opacity: 0, transform: { x: 750, y: 380, z: 500, rx: 1.2, ry: -2.8, rz: -1.2, angle: -360, scale: 0.35 } },
];

const card3Timeline: Keyframe3D[] = [
  { progress: 0.60, opacity: 0, transform: { x: 0, y: 550, z: -1000, rx: 2.5, ry: 1.8, rz: 1.5, angle: -360, scale: 0.25 } },
  { progress: 0.74, opacity: 1, transform: { x: 0, y: 0, z: 0, rx: 0.08, ry: 0.08, rz: 0.1, angle: 0, scale: 1.30 } },
  { progress: 0.88, opacity: 1, transform: { x: 0, y: -20, z: 20, rx: 0.08, ry: 0.08, rz: 0.1, angle: 8, scale: 1.35 } },
  { progress: 0.98, opacity: 0, transform: { x: 0, y: -650, z: 600, rx: -1.8, ry: 2.5, rz: -1.8, angle: 420, scale: 0.35 } },
];

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();
  const { candidateProfile } = usePortfolioData();

  const canvasRef = useRef<FrameSequenceCanvasRef>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const reducedRef = useRef(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    setIsReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      reducedRef.current = e.matches;
      setIsReduced(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleProgress = useCallback((progress: number) => {
    // 1. Scrub 3D Head Canvas sequence
    if (!reducedRef.current && canvasRef.current) {
      canvasRef.current.drawProgress(progress);
    }

    // 2. Initial Hero Intro Fade Out (progress 0.0 -> 0.15)
    if (introTextRef.current) {
      const op = progress < 0.15 ? 1 - progress / 0.15 : 0;
      introTextRef.current.style.opacity = op.toString();
      introTextRef.current.style.transform = `translateY(${progress * -60}px)`;
      introTextRef.current.style.pointerEvents = op > 0.05 ? 'auto' : 'none';
    }

    // Scroll Cue Fade
    if (scrollIndicatorRef.current) {
      const indOp = progress < 0.08 ? 1 - progress / 0.08 : 0;
      scrollIndicatorRef.current.style.opacity = indOp.toString();
    }

    if (reducedRef.current) return;

    // 3. 3D Keyframe Cards Interpolation (Desktop only)
    if (window.innerWidth >= 768) {
      if (card1Ref.current) {
        const s1 = interpolateKeyframes(card1Timeline, progress);
        card1Ref.current.style.opacity = s1.opacity.toString();
        card1Ref.current.style.transform = s1.transformString;
        card1Ref.current.style.pointerEvents = s1.opacity > 0.35 ? 'auto' : 'none';
      }

      if (card2Ref.current) {
        const s2 = interpolateKeyframes(card2Timeline, progress);
        card2Ref.current.style.opacity = s2.opacity.toString();
        card2Ref.current.style.transform = s2.transformString;
        card2Ref.current.style.pointerEvents = s2.opacity > 0.35 ? 'auto' : 'none';
      }

      if (card3Ref.current) {
        const s3 = interpolateKeyframes(card3Timeline, progress);
        card3Ref.current.style.opacity = s3.opacity.toString();
        card3Ref.current.style.transform = s3.transformString;
        card3Ref.current.style.pointerEvents = s3.opacity > 0.35 ? 'auto' : 'none';
      }
    }
  }, []);

  return (
    <>
      {/* ── DESKTOP CINEMATIC 3D CANVAS HERO (500vh, Sticky Pinned Viewport) ── */}
      <div className="hidden md:block">
        <ScrollScene
          height="500vh"
          onProgress={handleProgress}
          id="hero"
          style={{ backgroundColor: '#050505' }}
        >
          {/* Deep Dark Space Background */}
          <div className="absolute inset-0 bg-[#050505] z-0" />

          {/* 300-FRAME 3D WIREFRAME CYBER HEAD CANVAS (xalimov.vercel.app exact animation) */}
          {!isReduced ? (
            <FrameSequenceCanvas
              ref={canvasRef}
              frameCount={FRAME_COUNT}
              framePath={(i) => {
                const frameNumber = Math.min(FRAME_END, Math.max(FRAME_START, i));
                return `https://xalimov.vercel.app/frames/frame_${String(frameNumber).padStart(4, '0')}.jpg`;
              }}
              className="opacity-75 z-0"
            />
          ) : (
            <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
              <img
                src="https://xalimov.vercel.app/frames/frame_0001.jpg"
                alt="Hero Static"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
          )}

          {/* Radial Ambient Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37, 99, 235, 0.12), transparent 75%)',
            }}
          />

          {/* MAIN CENTERED HERO INTRO (Active at progress 0.0 -> 0.15) */}
          <div
            ref={introTextRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Center Profile Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 rounded-full border-2 border-blue-400/60 bg-white/10 backdrop-blur-md overflow-hidden shadow-[0_0_45px_rgba(37,99,235,0.35)] flex items-center justify-center group">
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-extrabold font-mono shadow-inner">
                BI
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#050505] shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
            </div>

            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/15 px-4 py-1.5 font-mono text-[11px] tracking-widest text-blue-300 backdrop-blur-md uppercase rounded-full mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.hero.badgeAvailable}</span>
            </div>

            {/* Large Bold Display Name */}
            <h1 className="mx-auto font-display font-extrabold tracking-tight leading-[1.06] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-2xl">
              {candidateProfile.name}
            </h1>

            {/* Tech Subtitle */}
            <p className="mx-auto mt-3 font-mono tracking-widest uppercase font-semibold text-xs sm:text-sm text-blue-400 drop-shadow">
              Python • FastAPI • School 21 • Telegram Bot Architecture
            </p>

            {/* Mission Bio */}
            <p className="mx-auto mt-4 max-w-[56ch] text-sm sm:text-base leading-relaxed text-slate-300 font-sans">
              {t.hero.subtext}
            </p>

            {/* Action CTAs with Magnetic Physics */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
              <MagneticButton strength={0.3}>
                <a
                  href="#projects"
                  className="px-6 py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/35 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{t.hero.exploreProjects}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.25}>
                <a
                  href="#contact"
                  className="px-5 py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-blue-400/50 transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>{t.hero.getInTouch}</span>
                </a>
              </MagneticButton>

              <MagneticButton strength={0.35}>
                <a
                  href={candidateProfile.botUrl || 'https://t.me/my_portfolio_support_bot'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm"
                  title="Telegram Assistant Bot"
                >
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-semibold">Bot Assistant</span>
                </a>
              </MagneticButton>
            </div>

            {/* Metrics Counter Bar */}
            <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 border-t border-white/10 pt-5">
              <div className="text-center">
                <span className="block text-2xl font-bold font-mono text-blue-400">
                  <AnimatedCounter target={candidateProfile.freelanceCount} suffix="+" duration={1000} />
                </span>
                <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">{t.hero.statFreelance}</span>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-center">
                <span className="block text-2xl font-bold font-mono text-indigo-400">School 21</span>
                <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">{t.hero.statSchool21}</span>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div className="text-center">
                <span className="block text-2xl font-bold font-mono text-cyan-400">Python 3.12+</span>
                <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">{t.hero.statPython}</span>
              </div>
              <div className="w-px h-8 bg-white/15 hidden sm:block" />
              <div className="text-center hidden sm:block">
                <span className="block text-2xl font-bold font-mono text-white">Bukhara</span>
                <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">{t.hero.statLocation}</span>
              </div>
            </div>
          </div>

          {/* 3D PERSPECTIVE CAROUSEL STAGE (Card 1, Card 2, Card 3 in 3D space) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
          >
            {/* CARD 1: Qadriyatlar & Tamoyillar (Flies to LEFT at x: -180, y: -40) */}
            <FloatingSceneCard ref={card1Ref} id="hero-card-values">
              <div
                className="p-8 md:p-9 rounded-3xl border border-blue-500/40 bg-[#0a0f1d]/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(37,99,235,0.45),0_0_40px_rgba(59,130,246,0.25)] text-white"
                style={{ width: 'min(500px, 92vw)' }}
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest font-semibold block">
                      Stage 01 • Philosophy
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                      Qadriyatlar & Tamoyillar
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3.5 font-sans text-sm md:text-base text-slate-200 leading-relaxed font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                    <span>Toza, o'qilishi oson va masshtablanuvchi kod yozish madaniyati (SRP, Clean Architecture)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                    <span>Doimiy o'rganish va amaliyot orqali yangi backend tizimlarini egallash</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                    <span>Muammolarga innovatsion avtonom bot va AI integratsiyalari orqali yechim topish</span>
                  </li>
                </ul>
              </div>
            </FloatingSceneCard>

            {/* CARD 2: Hozir O'rganayotganlar (Flies to RIGHT at x: 180, y: 40) */}
            <FloatingSceneCard ref={card2Ref} id="hero-card-learning">
              <div
                className="p-8 md:p-9 rounded-3xl border border-emerald-500/40 bg-[#081512]/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(16,185,129,0.45),0_0_40px_rgba(16,185,129,0.25)] text-white"
                style={{ width: 'min(490px, 92vw)' }}
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-sm">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-semibold block">
                      Stage 02 • Active Deep-Dive
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                      Hozir O'rganayotganlar
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3.5 font-sans text-sm md:text-base text-slate-200 leading-relaxed font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>High-Performance Async Backends & FastAPI Event Loops</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>Large Language Models (LLM) & RAG Vector Systems</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>School 21 C/C++ Low-Level Systems & Algorithmics</span>
                  </li>
                </ul>
              </div>
            </FloatingSceneCard>

            {/* CARD 3: Hozir Ishlayotgan Loyihalar (Flies to CENTER at x: 0, y: 0) */}
            <FloatingSceneCard ref={card3Ref} id="hero-card-working">
              <div
                className="p-8 md:p-9 rounded-3xl border border-indigo-500/40 bg-[#0e0d1f]/90 backdrop-blur-2xl shadow-[0_30px_90px_-10px_rgba(99,102,241,0.45),0_0_40px_rgba(99,102,241,0.25)] text-white"
                style={{ width: 'min(480px, 92vw)' }}
              >
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-sm">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest font-semibold block">
                      Stage 03 • Current Production
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white">
                      Hozir Ishlayotganlar
                    </h3>
                  </div>
                </div>

                <ul className="space-y-3.5 font-sans text-sm text-slate-200 leading-relaxed font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <span>AI Portfolio & Interactive Real-Time Web Platform</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <span>Official Telegram Bot Assistant with WebApp & FSM Engine</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <span>Kwork & Freelance Production Client Deliveries (8+ Orders)</span>
                  </li>
                </ul>
              </div>
            </FloatingSceneCard>
          </div>

          {/* Bottom Floating Scroll Cue */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none transition-opacity duration-300"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-slate-400">
              Scroll
            </span>
            <div className="w-px h-7 bg-gradient-to-b from-blue-400/80 to-transparent" />
          </div>
        </ScrollScene>
      </div>

      {/* ── MOBILE RESPONSIVE FALLBACK (md:hidden) ── */}
      <section className="block md:hidden pt-24 pb-14 px-5 bg-[#050505] text-center flex flex-col justify-center items-center text-white">
        <div className="relative w-24 h-24 mb-4 rounded-full border-2 border-blue-400/60 bg-white/10 shadow-md flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold font-mono">
            BI
          </div>
          <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050505] animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[10px] font-mono mb-3 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t.hero.badgeAvailable}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-sans">
          {candidateProfile.name}
        </h1>

        <p className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Python • Backend • School 21
        </p>

        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mb-6">
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
            className="px-5 py-3 rounded-xl font-mono text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 text-center flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Telegram Bot</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm">
            <span className="block text-lg font-bold font-mono text-blue-400">
              {candidateProfile.freelanceCount}+
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{t.hero.statFreelance}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm">
            <span className="block text-lg font-bold font-mono text-indigo-400">School 21</span>
            <span className="text-[10px] text-slate-400 font-mono">{t.hero.statSchool21}</span>
          </div>
        </div>
      </section>
    </>
  );
};
