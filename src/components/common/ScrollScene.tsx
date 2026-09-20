import React, { useEffect, useRef } from 'react';

interface ScrollSceneProps {
  height?: string;
  onProgress: (progress: number) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const ScrollScene: React.FC<ScrollSceneProps> = ({
  height = '400vh',
  onProgress,
  children,
  className = '',
  id,
  style,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isTickingRef = useRef(false);
  const onProgressRef = useRef(onProgress);
  const topRef = useRef(0);
  const heightRef = useRef(0);
  const travelRef = useRef(1);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const recalculateBounds = () => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    topRef.current = rect.top + scrollY;
    heightRef.current = el.offsetHeight;
    travelRef.current = Math.max(1, heightRef.current - window.innerHeight);
  };

  useEffect(() => {
    recalculateBounds();

    const handleScroll = () => {
      if (isTickingRef.current) return;
      isTickingRef.current = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight;
        const top = topRef.current;
        const totalHeight = heightRef.current;
        const travel = travelRef.current;

        // Check if in viewport range
        if (scrollY + windowHeight >= top && scrollY <= top + totalHeight) {
          const progress = Math.min(1, Math.max(0, (scrollY - top) / travel));
          onProgressRef.current(progress);
        }
        isTickingRef.current = false;
      });
    };

    const handleResize = () => {
      recalculateBounds();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative ${className}`}
      style={{ height, ...style }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ willChange: 'transform', transform: 'translate3d(0,0,0)', ...style }}
      >
        {children}
      </div>
    </section>
  );
};
