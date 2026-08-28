import React from 'react';
import { Github, ExternalLink, ArrowUpRight, CheckCircle2, Code2, Bot, Users, Trophy } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';
import { SpotlightCard } from './SpotlightCard';

const PROJECT_ICONS: Record<string, React.ReactNode> = {
  'buddy-team': <Users className="w-5 h-5 text-blue-600" />,
  'esports-bot': <Trophy className="w-5 h-5 text-amber-600" />,
  'peerlearn-app': <Bot className="w-5 h-5 text-indigo-600" />,
};

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  viewArchitectureLabel: string;
  onSelect: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  viewArchitectureLabel,
  onSelect,
}) => {
  return (
    <SpotlightCard className="project-reveal parallax-card p-6 flex flex-col justify-between card-3d group relative overflow-hidden">
      {/* Top Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
          index === 0
            ? 'from-blue-500 to-indigo-600'
            : index === 1
            ? 'from-amber-500 to-blue-500'
            : 'from-indigo-600 to-blue-500'
        } opacity-90`}
      />

      <div>
        {/* Header Meta */}
        <div className="flex items-center justify-between gap-2 mb-4 pt-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 group-hover:border-blue-300 transition-colors">
              {PROJECT_ICONS[project.id] || <Code2 className="w-5 h-5 text-blue-600" />}
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {project.badge}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500">{project.timeline}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold font-mono text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
          {project.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-5 line-clamp-2">
          {project.summary}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map((tech, tIdx) => (
            <span
              key={tIdx}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50/80 text-blue-700 border border-blue-100"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Key Highlights */}
        <ul className="space-y-2 mb-6">
          {project.keyFeatures.slice(0, 2).map((feat, fIdx) => (
            <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => onSelect(project)}
          className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
        >
          <span>{viewArchitectureLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} on GitHub`}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.name} demo`}
              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};
