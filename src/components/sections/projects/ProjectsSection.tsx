import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, ExternalLink, Github, Layers, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
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
      // 1. Stage Title & Badge (Active at progress 0.02 -> 0.24)
      if (headerRef.current) {
        let headerOpacity = 0;
        if (progress >= 0.01 && progress <= 0.25) {
          headerOpacity =
            progress < 0.07
              ? (progress - 0.01) / 0.06
              : progress > 0.18
              ? 1 - (progress - 0.18) / 0.07
              : 1;
        }
        const val = Math.max(0, Math.min(1, headerOpacity));
        headerRef.current.style.opacity = val.toString();
        headerRef.current.style.transform = `translateY(${(1 - val) * 30}px)`;
        headerRef.current.style.pointerEvents = val > 0.1 ? 'auto' : 'none';
      }

      // 2. 3D Project Cards in Stage (Active at progress 0.22 -> 0.98)
      const count = localizedProjects.length;
      if (count > 0 && window.innerWidth >= 768) {
        const slice = 0.74 / count;
        const activeDuration = 0.92 * slice;

        localizedProjects.forEach((_, idx) => {
          const el = cardRefs.current[idx];
          if (!el) return;

          const start = 0.22 + idx * slice;
          const end = start + activeDuration;
          let visibility = 0;

          if (progress >= start && progress <= end) {
            const fadeInEnd = start + 0.22 * activeDuration;
            const fadeOutStart = end - 0.22 * activeDuration;

            visibility =
              progress < fadeInEnd
                ? (progress - start) / (fadeInEnd - start)
                : progress > fadeOutStart
                ? 1 - (progress - fadeOutStart) / (end - fadeOutStart)
                : 1;
          }

          visibility = Math.max(0, Math.min(1, visibility));
          const isEven = idx % 2 === 0;
          const translateX = (isEven ? -1 : 1) * (1 - visibility) * 180;
          const rotateY = (isEven ? -1 : 1) * (1 - visibility) * 32;
          const scale = 0.8 + 0.2 * visibility;

          el.style.opacity = visibility.toString();
          el.style.transform = `translateX(${translateX.toFixed(1)}px) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
          el.style.pointerEvents = visibility > 0.4 ? 'auto' : 'none';
        });
      }
    },
    [localizedProjects]
  );

  return (
    <>
      {/* DESKTOP 3D SHOWROOM (height: 600vh, Sticky Pinned Viewport) */}
      <div className="hidden md:block">
        <ScrollScene
          height="600vh"
          onProgress={handleProgress}
          id="projects"
          className="bg-transparent text-slate-900"
        >
          {/* Subtle Ambient Radial Lighting */}
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
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-blue-600 border border-blue-200 bg-blue-50/90 px-4 py-1.5 rounded-full mb-4 shadow-sm backdrop-blur-md">
              {t.projects.titleBadge}
            </span>
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 drop-shadow-sm font-sans">
              {t.projects.heading}
            </h2>
            <p className="font-mono text-xs text-slate-500 max-w-md uppercase tracking-widest">
              Scroll qilib loyihalarni 3D sahnada ko'ring ↓
            </p>
          </div>

          {/* 3D PERSPECTIVE CAROUSEL STAGE */}
          <div
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-6"
            style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
          >
            {localizedProjects.map((project, idx) => (
              <div
                key={project.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none"
                style={{
                  opacity: 0,
                  transform: 'translateX(0px) rotateY(0deg) scale(0.8)',
                  willChange: 'transform, opacity',
                }}
              >
                {/* 3D Glassmorphism Showcase Card */}
                <div
                  className="w-[92vw] max-w-3xl rounded-3xl border border-blue-200/80 bg-white/95 backdrop-blur-2xl shadow-[0_25px_80px_-15px_rgba(37,99,235,0.25),0_0_40px_rgba(59,130,246,0.12)] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center pointer-events-auto"
                >
                  {/* Left Column: Tech Visual / Badges */}
                  <div className="w-full md:w-5/12 flex flex-col justify-between self-stretch bg-slate-50/80 rounded-2xl p-6 border border-slate-200">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="font-mono text-xs font-semibold px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 border border-blue-200">
                          {project.category}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 font-bold">
                          0{idx + 1} / 0{localizedProjects.length}
                        </span>
                      </div>

                      <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30 mb-4">
                        <Layers className="w-7 h-7" />
                      </div>

                      <h4 className="font-display text-xl font-bold text-slate-900 mb-2">
                        {project.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono line-clamp-3">
                        {project.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Architectural Highlights & CTAs */}
                  <div className="w-full md:w-7/12 flex flex-col justify-between self-stretch">
                    <div>
                      <span className="font-mono text-[10px] text-blue-600 uppercase tracking-widest font-semibold block mb-2">
                        Arxitektura & Asosiy Xususiyatlar
                      </span>
                      <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">
                        {project.name}
                      </h3>

                      <ul className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-600">
                        {project.keyFeatures.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="px-5 py-2.5 rounded-xl font-mono text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{t.projects.viewArchitecture}</span>
                      </button>

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <span>Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl font-mono text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1 active:scale-95"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollScene>
      </div>

      {/* MOBILE RESPONSIVE FALLBACK (block md:hidden) */}
      <section id="projects" className="block md:hidden py-16 px-4 bg-transparent">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.projects.titleBadge}</span>
          </div>
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
