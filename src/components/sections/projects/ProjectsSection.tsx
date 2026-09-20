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
          style={{ backgroundColor: '#050505' }}
          className="text-white"
        >
          {/* Deep Dark Space Background */}
          <div className="absolute inset-0 bg-[#050505] z-0" />

          {/* 97-FRAME 3D HYPERSPACE TUNNEL SEQUENCE CANVAS (xalimov.vercel.app exact animation) */}
          <FrameSequenceCanvas
            ref={canvasRef}
            frameCount={TUNNEL_FRAME_COUNT}
            framePath={(idx) => {
              const frameNumber = Math.min(TUNNEL_FRAME_END, Math.max(TUNNEL_FRAME_START, idx));
              return `https://xalimov.vercel.app/tunnel-frames/frame_${String(frameNumber).padStart(4, '0')}.jpg`;
            }}
            className="opacity-75 z-0"
          />

          {/* Radial Ambient Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37, 99, 235, 0.12), transparent 75%)',
            }}
          />

          {/* CHAPTER TITLE (Transitions in at start of section) */}
          <div
            ref={headerRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-400 border border-blue-500/30 bg-blue-500/15 px-4 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-md">
              {t.projects.titleBadge}
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-3 drop-shadow-2xl font-sans">
              {t.projects.heading}
            </h2>
            <p className="font-mono text-xs text-slate-300 max-w-sm uppercase tracking-widest drop-shadow">
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
                  {/* 3D Glassmorphic Showcase Card */}
                  <div
                    className="p-7 md:p-8 rounded-3xl border border-blue-500/40 bg-[#090914]/90 backdrop-blur-2xl transition-all duration-300 pointer-events-auto text-white"
                    style={{
                      width: 'min(490px, 92vw)',
                      boxShadow: '0 30px 90px -10px rgba(37, 99, 235, 0.45), 0 0 60px rgba(0,0,0,0.95)',
                    }}
                  >
                    {/* Top Status Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="font-mono text-[10px] text-blue-400 font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30">
                        0{idx + 1} • {project.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{project.status || 'Production'}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold font-sans text-white mb-2 tracking-tight">
                      {project.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-slate-300 leading-relaxed font-sans mb-5 line-clamp-3">
                      {project.summary}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-300 bg-white/5 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/30 active:scale-95"
                      >
                        <span>{t.projects.viewCaseStudy}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="GitHub Repository"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
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
      <section className="block md:hidden py-16 px-4 bg-[#050505] text-white">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] uppercase tracking-widest text-blue-400 border border-blue-500/30 bg-blue-500/15 px-3 py-1 rounded-full mb-3 inline-block">
            {t.projects.titleBadge}
          </span>
          <h2 className="text-2xl font-bold font-sans text-white mb-2">
            {t.projects.heading}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {t.projects.subheading}
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          {localizedProjects.map((project, idx) => (
            <div
              key={project.id}
              className="p-6 rounded-2xl border border-white/15 bg-[#090914] shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-blue-400 font-semibold uppercase">
                  0{idx + 1} • {project.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                  {project.status || 'Live'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">{project.title}</h3>
              <p className="text-xs text-slate-300 mb-4 line-clamp-3">{project.summary}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedProject(project)}
                className="w-full py-2 text-center rounded-xl bg-blue-600 text-white font-mono text-xs font-semibold shadow-sm"
              >
                {t.projects.viewCaseStudy} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Project Deep Dive Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
};
