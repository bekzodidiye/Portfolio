import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { FEATURED_PROJECTS } from '../data/portfolioData';
import { ProjectItem } from '../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { ProjectCard } from './ProjectCard';
import { useLanguage } from '../context/LanguageContext';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { useGsapDepthParallax } from '../hooks/useGsapDepthParallax';

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useGsapReveal<HTMLElement>({
    y: 40,
    duration: 0.85,
    stagger: 0.12,
    start: 'top 85%',
    selector: '.project-reveal',
  });

  const parallaxGridRef = useGsapDepthParallax<HTMLDivElement>({
    liftDistance: -20,
    tiltAngle: 3,
    stagger: 0.06,
  });

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const getLocalizedProject = (project: ProjectItem) => {
    let loc = t.projects.items.buddyTeam;
    if (project.id === 'portfolio-bot') loc = t.projects.items.portfolioBot;
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

  return (
    <section ref={sectionRef} id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="project-reveal text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.projects.titleBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {t.projects.heading}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
            {t.projects.subheading}
          </p>
        </div>

        {/* 2x2 Clean Card Grid with GSAP ScrollTrigger 3D Depth Parallax */}
        <div ref={parallaxGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-3d">
          {FEATURED_PROJECTS.map((rawProject, idx) => {
            const project = getLocalizedProject(rawProject);
            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                viewArchitectureLabel={t.projects.viewArchitecture}
                onSelect={(p) => setSelectedProject(p)}
              />
            );
          })}
        </div>
      </div>

      {/* Detail Dialog */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};


