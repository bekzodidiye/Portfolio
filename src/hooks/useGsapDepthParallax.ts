import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
    if (!el || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll<HTMLElement>('.parallax-card');
      
      cards.forEach((card, idx) => {
        // Initial state
        gsap.set(card, {
          y: 35,
          z: -30,
          rotationX: tiltAngle,
          transformPerspective: 1000,
        });

        // Scroll animation
        gsap.to(card, {
          y: liftDistance,
          z: 12,
          rotationX: tiltAngle * 0.6,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'center center',
            scrub: 1, // Smooth scrubbing
          }
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [liftDistance, tiltAngle]);

  return containerRef;
}
