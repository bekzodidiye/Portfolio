import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  ease?: string;
  selector?: string;
}

export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const containerRef = useRef<T | null>(null);
  const {
    y = 36,
    duration = 0.85,
    stagger = 0.12,
    start = 'top 85%',
    ease = 'power3.out',
    selector = '.gsap-reveal',
  } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const targets = selector ? el.querySelectorAll(selector) : [el];
      if (targets.length === 0) return;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
        },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [y, duration, stagger, start, ease, selector]);

  return containerRef;
}
