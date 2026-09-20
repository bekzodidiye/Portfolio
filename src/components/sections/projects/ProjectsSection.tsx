import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ExternalLink, Github, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '../../../context/PortfolioDataContext';
import { ProjectItem } from '../../../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { ProjectCard } from './ProjectCard';
import { useLanguage } from '../../../context/LanguageContext';
import { ScrollScene } from '../../common/ScrollScene';

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage();
  const { featuredProjects } = usePortfolioData();

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

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
      // 1. Stage Title & Badge (Active at progress 0.02 -> 0.26)
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

      // 2. 3D Project Cards Alternating Left/Right (Active at progress 0.26 -> 0.98)
      const count = localizedProjects.length;
      if (count > 0 && window.innerWidth >= 768) {
        const slice = 0.68 / count;
        const activeDuration = 0.90 * slice;

        localizedProjects.forEach((_, idx) => {
          const el = cardRefs.current[idx];
          if (!el) return;

          const start = 0.26 + idx * slice;
          const end = start + activeDuration;
          let visibility = 0;

          if (progress >= start && progress <= end) {
            const fadeInEnd = start + 0.25 * activeDuration;
            const fadeOutStart = end - 0.25 * activeDuration;

            visibility =
              progress < fadeInEnd
                ? (progress - start) / (fadeInEnd - start)
                : progress > fadeOutStart
                ? 1 - (progress - fadeOutStart) / (end - fadeOutStart)
                : 1;
          }

          visibility = Math.max(0, Math.min(1, visibility));
          const isEven = idx % 2 === 0;
          const translateX = (isEven ? -1 : 1) * (1 - visibility) * 140;
          const rotateY = (isEven ? -1 : 1) * (1 - visibility) * 28;
          const scale = 0.72 + 0.28 * visibility;

          el.style.opacity = visibility.toString();
          el.style.transform = `translateX(${translateX.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
          el.style.pointerEvents = visibility > 0.35 ? 'auto' : 'none';
        });
      }
    },
    [localizedProjects]
  );

  return (
    <>
      {/* DESKTOP 3D SHOWROOM (height: 700vh, Sticky Pinned Viewport) */}
      <div className="hidden md:block">
        <ScrollScene
          height="700vh"
          onProgress={handleProgress}
          id="projects"
          className="bg-transparent text-slate-900"
        >
          {/* Ambient Lighting */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(37, 99, 235, 0.06), transparent 70%)',
            }}
          />

          {/* CHAPTER TITLE (Transitions in at start of section) */}
          <div
            ref={headerRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-600 border border-blue-200 bg-blue-50/90 px-4 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-md">
              {t.projects.titleBadge}
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-3 drop-shadow-sm font-sans">
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
                    transform: 'translateX(0px) rotateY(0deg) scale(0.72)',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* 3D Glassmorphic Showcase Card */}
                  <div
                    className="p-7 md:p-8 rounded-3xl border border-blue-400/40 bg-white/95 backdrop-blur-2xl transition-all duration-300 pointer-events-auto"
                    style={{
                      width: 'min(490px, 92vw)',
                      boxShadow: '0 30px 90px -10px rgba(37, 99, 235, 0.35), 0 0 50px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-semibold">
                        0{idx + 1} • {project.category}
                      </span>
                      <span className="font-mono text-xs px-3.5 py-1 rounded-full border uppercase tracking-widest font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                        {project.badge || 'Live'}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 mb-4">
                      <Layers className="w-6 h-6" />
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                      {project.name}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-5 font-sans">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 py-3 text-center font-mono text-xs uppercase tracking-widest bg-blue-600 text-white font-extrabold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all cursor-pointer active:scale-95"
                      >
                        BATAFSIL KO'RISH →
                      </button>

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 transition-all"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollScene>
      </div>

      {/* MOBILE RESPONSIVE FALLBACK (block md:hidden) */}
      <section id="projects" className="block md:hidden py-14 px-5 bg-transparent overflow-hidden">
        <div className="text-center mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-blue-600 border border-blue-200 bg-blue-50 px-3.5 py-1 rounded-full mb-3 inline-block">
            {t.projects.titleBadge}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t.projects.heading}
          </h2>
          <p className="text-slate-600 text-xs max-w-sm mx-auto mt-2">
            {t.projects.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {localizedProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              viewArchitectureLabel={t.projects.viewArchitecture}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </section>

      {/* Architectural Deep-Dive Dialog */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};
