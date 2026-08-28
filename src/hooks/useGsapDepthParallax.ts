import { useEffect, useRef } from 'react';

interface DepthParallaxOptions {
  liftDistance?: number;
  tiltAngle?: number;
  stagger?: number;
}

export function useGsapDepthParallax<T extends HTMLElement>(
  options: DepthParallaxOptions = {}
) {
  const containerRef = useRef<T>(null);
  const {
    liftDistance = -20,
    tiltAngle = 3,
  } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animId: number;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Progress from 0 (entering bottom) to 1 (center)
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height * 0.5)));

      const cards = el.querySelectorAll<HTMLElement>('.parallax-card');
      cards.forEach((card, idx) => {
        const staggerOffset = idx * 0.08;
        const cardProgress = Math.max(0, Math.min(1, (progress - staggerOffset) / (1 - staggerOffset)));
        
        const y = 35 * (1 - cardProgress) + liftDistance * cardProgress;
        const z = -30 * (1 - cardProgress) + 12 * cardProgress;
        const rotX = tiltAngle * (1 - cardProgress) - tiltAngle * 0.4 * cardProgress;

        card.style.transform = `perspective(1000px) translateY(${y}px) translateZ(${z}px) rotateX(${rotX}deg)`;
        card.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)';
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [liftDistance, tiltAngle]);

  return containerRef;
}
