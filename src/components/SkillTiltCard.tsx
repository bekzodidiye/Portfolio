import React, { useState } from 'react';
import { Server, Database, Cpu, ShieldCheck, Code } from 'lucide-react';
import { SkillCategory } from '../types/portfolio';

const ICON_MAP: Record<string, React.ReactNode> = {
  Server: <Server className="w-6 h-6 text-blue-600" />,
  Database: <Database className="w-6 h-6 text-indigo-600" />,
  Cpu: <Cpu className="w-6 h-6 text-amber-600" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
};

interface SkillTiltCardProps {
  category: SkillCategory;
  index: number;
  localizedTitle: string;
  localizedDesc: string;
  isVisible: boolean;
}

export const SkillTiltCard: React.FC<SkillTiltCardProps> = ({
  category,
  index,
  localizedTitle,
  localizedDesc,
  isVisible,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const transitionDelay = `${index * 140 + 100}ms`;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isVisible
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${
              isHovered ? '1.02' : '1'
            }, ${isHovered ? '1.02' : '1'}, 1)`
          : 'perspective(1000px) translateY(45px) scale(0.94) rotateX(10deg)',
        opacity: isVisible ? 1 : 0,
        transition: isHovered
          ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
          : `transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${transitionDelay}, opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${transitionDelay}, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
      className={`parallax-card rounded-2xl p-6 sm:p-7 bg-white/90 backdrop-blur-md relative group overflow-hidden border ${
        isHovered
          ? 'border-blue-400 shadow-2xl bg-white'
          : 'border-slate-200 shadow-sm'
      }`}
    >
      {/* Mouse Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.09), transparent 50%)`,
        }}
      />

      <div className="flex items-center gap-3.5 mb-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:border-blue-400 group-hover:scale-110 transition-all duration-300">
          {ICON_MAP[category.iconName] || <Code className="w-6 h-6 text-blue-600" />}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-mono group-hover:text-blue-600 transition-colors">
            {localizedTitle || category.title}
          </h3>
          <p className="text-xs text-slate-500 font-sans">{localizedDesc || category.description}</p>
        </div>
      </div>

      <div className="space-y-2.5 mt-5 relative z-10">
        {category.skills.map((skill, sIdx) => (
          <div
            key={sIdx}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100/80 hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-xs sm:text-sm font-mono font-semibold text-slate-800">
                {skill.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {skill.tag && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 text-slate-600">
                  {skill.tag}
                </span>
              )}
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  skill.level === 'Expert'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : skill.level === 'Advanced'
                    ? 'text-blue-700 bg-blue-50 border border-blue-200'
                    : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                }`}
              >
                {skill.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
