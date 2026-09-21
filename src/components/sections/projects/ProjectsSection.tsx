import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ExternalLink, Github, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { ProjectItem } from '../../../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { ProjectCard } from './ProjectCard';
import { useLanguage } from '../../../context/LanguageContext';
import { ScrollScene } from '../../common/ScrollScene';
import { FrameSequenceCanvas, FrameSequenceCanvasRef } from '../../common/FrameSequenceCanvas';

const TUNNEL_FRAME_START = 1;
const TUNNEL_FRAME_END = 97;
const TUNNEL_FRAME_COUNT = TUNNEL_FRAME_END - TUNNEL_FRAME_START + 1;

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage();
  const { featuredProjects } = usePortfolioData();

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const canvasRef = useRef<FrameSequenceCanvasRef>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getLocalizedProject = (project: ProjectItem) => {
    let loc = (t.projects.items as any)[project.id];
    if (project.id === 'portfolio-bot') loc = t.projects.items.portfolioBot;
    else if (project.id === 'buddy-team') loc = t.projects.items.buddyTeam;
    else if (project.id === 'esports-bot') loc = t.projects.items.esportsBot;
    else if (project.id === 'peerlearn-app') loc = t.projects.items.peerLearn;

    return {
      ...project,
      category: loc?.category || project.category,
      summary: loc?.summary || project.summary,
      keyFeatures: loc?.features || project.keyFeatures,
      architecture: loc?.architecture || project.architecture,
    };
  };

  const localizedProjects = featuredProjects.map(getLocalizedProject);

  const handleProgress = useCallback(
    (progress: number) => {
      // 1. Scrub 3D Tunnel Sequence Canvas
      if (canvasRef.current) {
        canvasRef.current.drawProgress(progress);
      }

      // 2. Stage Title & Badge (Active at progress 0.02 -> 0.26)
      if (headerRef.current) {
        let tVal = 0;
        if (progress >= 0.02 && progress <= 0.26) {
          tVal =
            progress < 0.07
              ? (progress - 0.02) / 0.05
              : progress > 0.20
              ? 1 - (progress - 0.20) / 0.06
              : 1;
        }
        const val = Math.max(0, Math.min(1, tVal));
        headerRef.current.style.opacity = val.toString();
        headerRef.current.style.transform = `translateY(${(1 - val) * 25}px)`;
        headerRef.current.style.pointerEvents = val > 0.1 ? 'auto' : 'none';
      }

      // 3. 3D Project Cards Alternating Left/Right (Active at progress 0.26 -> 0.93)
      const count = localizedProjects.length;
      if (count > 0 && window.innerWidth >= 768) {
        const startRange = 0.26;
        const endRange = 0.93;
        const totalAvailable = endRange - startRange;
        const step = totalAvailable / count;
        const windowSize = step * 0.9;

        localizedProjects.forEach((_, idx) => {
          const el = cardRefs.current[idx];
          if (!el) return;

          const startWindow = startRange + idx * step;
          const endWindow = startWindow + windowSize;

          let op = 0;
          if (progress >= startWindow && progress <= endWindow) {
            const fadeIn = startWindow + windowSize * 0.25;
            const fadeOut = endWindow - windowSize * 0.25;

            if (progress < fadeIn) {
              op = (progress - startWindow) / (fadeIn - startWindow);
            } else if (progress > fadeOut) {
              op = 1 - (progress - fadeOut) / (endWindow - fadeOut);
            } else {
              op = 1;
            }
          }

          op = Math.max(0, Math.min(1, op));
          const isEven = idx % 2 === 0;
          const sideOffset = (isEven ? -1 : 1) * (1 - op) * 140;
          const rotateY = (isEven ? -1 : 1) * (1 - op) * 28;
          const scale = 0.7 + op * 0.3;

          el.style.opacity = op.toString();
          el.style.transform = `translateX(${sideOffset.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
          el.style.pointerEvents = op > 0.35 ? 'auto' : 'none';
        });
      }
    },
    [localizedProjects]
  );

  return (
    <>
      {/* ── DESKTOP 3D TUNNEL SHOWROOM (700vh, Sticky Pinned Viewport) ── */}
      <div className="hidden md:block">
        <ScrollScene
          height="700vh"
          onProgress={handleProgress}
          id="projects"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* Clean White Background */}
          <div className="absolute inset-0 bg-white z-0" />

          {/* 97-FRAME 3D HYPERSPACE TUNNEL SEQUENCE CANVAS (inverted for white theme) */}
          <FrameSequenceCanvas
            ref={canvasRef}
            frameCount={TUNNEL_FRAME_COUNT}
            framePath={(idx) => {
              const frameNumber = Math.min(TUNNEL_FRAME_END, Math.max(TUNNEL_FRAME_START, idx));
              return `https://xalimov.vercel.app/tunnel-frames/frame_${String(frameNumber).padStart(4, '0')}.jpg`;
            }}
            className="opacity-[0.07] z-0"
            style={{ filter: 'invert(1) contrast(1.3) brightness(1.1)' }}
          />

          {/* Radial Ambient Glow — subtle blue on white */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37, 99, 235, 0.05), transparent 75%)',
            }}
          />

          {/* CHAPTER TITLE (Transitions in at start of section) */}
          <div
            ref={headerRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-600 border border-blue-200 bg-blue-50 px-4 py-1.5 rounded-full mb-4 shadow-sm">
              {t.projects.titleBadge}
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-3 font-sans">
              {t.projects.heading}
            </h2>
            <p className="font-mono text-xs text-slate-500 max-w-sm uppercase tracking-widest">
              SCROLL QILIB KASHF ETING ↓
            </p>
          </div>

          {/* 3D PERSPECTIVE CAROUSEL STAGE (Alternating Left & Right) */}
          <div
            className="absolute inset-0 z-30 pointer-events-none"
            style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
          >
            {localizedProjects.map((project, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={`absolute inset-0 flex items-center justify-center p-6 ${
                    isEven ? 'md:justify-start md:pl-20 lg:pl-32' : 'md:justify-end md:pr-20 lg:pr-32'
                  } pointer-events-none`}
                  style={{
                    opacity: 0,
                    transform: 'translateX(0px) rotateY(0deg) scale(0.7)',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* Light Glassmorphic Showcase Card */}
                  <div
                    className="p-7 md:p-8 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-2xl transition-all duration-300 pointer-events-auto"
                    style={{
                      width: 'min(490px, 92vw)',
                      boxShadow: '0 30px 90px -10px rgba(37, 99, 235, 0.12), 0 8px 32px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Top Status Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="font-mono text-[10px] text-blue-600 font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                        0{idx + 1} • {project.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{project.badge || 'Production'}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold font-sans text-slate-900 mb-2 tracking-tight">
                      {project.name}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-slate-600 leading-relaxed font-sans mb-5 line-clamp-3">
                      {project.summary}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-600 bg-slate-50 border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20 active:scale-95"
                      >
                        <span>{t.projects.viewCode}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollScene>
      </div>

      {/* ── MOBILE RESPONSIVE FALLBACK (md:hidden) ── */}
      <section className="block md:hidden py-16 px-4 bg-white">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">
            {t.projects.titleBadge}
          </span>
          <h2 className="text-2xl font-bold font-sans text-slate-900 mb-2">
            {t.projects.heading}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {t.projects.subheading}
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          {localizedProjects.map((project, idx) => (
            <div
              key={project.id}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-blue-600 font-semibold uppercase">
                  0{idx + 1} • {project.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {project.badge || 'Live'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5">{project.name}</h3>
              <p className="text-xs text-slate-600 mb-4 line-clamp-3">{project.summary}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full py-2 text-center rounded-xl bg-blue-600 text-white font-mono text-xs font-semibold shadow-sm"
              >
                {t.projects.viewCode} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Project Deep Dive Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};
