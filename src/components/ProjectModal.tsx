import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Github, CheckCircle2, Cpu } from 'lucide-react';
import { ProjectItem } from '../types/portfolio';
import { useLanguage } from '../context/LanguageContext';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;

    // Handle ESC and Tab Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    const timer = setTimeout(() => {
      if (modalRef.current) {
        const closeBtn = modalRef.current.querySelector<HTMLElement>('#project-modal-close-btn');
        closeBtn?.focus();
      }
    }, 50);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [project, onClose]);

  if (!project || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl rounded-2xl border border-slate-200 p-6 sm:p-8 bg-white shadow-2xl max-h-[88vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="project-modal-close-btn"
          onClick={onClose}
          aria-label="Close Project Modal"
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {project.badge}
          </span>
          <span className="text-xs font-mono text-slate-500">• {project.timeline}</span>
        </div>

        <h3 id="project-modal-title" className="text-2xl font-bold font-mono text-slate-900 mb-2">
          {project.name}
        </h3>
        <p className="text-sm text-slate-600 mb-6">{project.summary}</p>

        {/* Tech Stack Pills */}
        <div className="mb-6">
          <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2.5">
            {t.projects.techStackTitle}
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 text-blue-700 border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-6">
          <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2.5">
            {t.projects.keyFeaturesTitle}
          </h4>
          <ul className="space-y-2.5">
            {project.keyFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architecture Highlight */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-700 mb-1.5 font-semibold">
            <Cpu className="w-4 h-4" />
            <span>{t.projects.architectureTitle}</span>
          </div>
          <p className="text-xs font-mono text-slate-700 leading-relaxed">{project.architecture}</p>
        </div>

        {/* Action Links */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repo</span>
          </a>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-mono font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm shadow-blue-500/25 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t.projects.liveDemo}</span>
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
