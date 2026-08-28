import React, { useEffect, useRef } from 'react';
import { initSubtleThreeScene } from './subtleThreeScene';

export const ModernBackground: React.FC = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const controller = initSubtleThreeScene(canvasContainerRef.current);
    return () => {
      controller.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle 3D Interactive WebGL Layer (Responds dynamically to Scroll & Parallax) */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-0 opacity-80 transition-opacity duration-700"
      />

      {/* Dynamic Ambient Luminous Gradients */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[72rem] h-[36rem] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[32rem] h-[32rem] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -right-32 w-[36rem] h-[36rem] bg-indigo-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-[40rem] h-[28rem] bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

      {/* Modern Engineering Radial Masked Grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(203, 213, 225, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203, 213, 225, 0.35) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      {/* Subtle Dot Matrix Accent Overlay */}
      <div
        className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(100, 116, 139, 0.35) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
};
