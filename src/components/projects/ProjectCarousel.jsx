import { useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';

function ProjectCarousel({ projects, activeIndex, onSelect }) {
  const containerRef = useRef(null);
  const touchStartRef = useRef(null);

  const scrollToIndex = useCallback((index) => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('[data-carousel-card]');
    const target = cards[index];
    if (!target) return;
    const containerWidth = container.offsetWidth;
    const targetWidth = target.offsetWidth;
    const scrollPos = target.offsetLeft - (containerWidth / 2) + (targetWidth / 2);
    container.scrollTo({ left: scrollPos, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  const nav = useCallback((dir) => {
    onSelect(prev => {
      let next = (typeof prev === 'number' ? prev : activeIndex) + dir;
      if (next < 0) next = projects.length - 1;
      if (next >= projects.length) next = 0;
      return next;
    });
  }, [activeIndex, projects.length, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') nav(-1);
      else if (e.key === 'ArrowRight') nav(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nav]);

  // Touch/swipe support
  const handleTouchStart = (e) => { touchStartRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) nav(diff > 0 ? 1 : -1);
    touchStartRef.current = null;
  };

  if (!projects.length) return null;

  return (
    <div className="relative max-w-6xl mx-auto px-4">
      {/* Arrows */}
      <button
        onClick={() => nav(-1)}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface-elevated border border-border text-text-muted hover:text-primary hover:border-primary shadow-sm transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => nav(1)}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface-elevated border border-border text-text-muted hover:text-primary hover:border-primary shadow-sm transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Cards */}
      <div
        ref={containerRef}
        className="projects-scroll-container flex items-center justify-start"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ghost spacer at start so first card can center */}
        <div className="flex-shrink-0 w-[calc(50%-9rem)] md:w-[calc(50%-10rem)]" aria-hidden="true" />

        {projects.map((project, i) => (
          <div key={project.id} data-carousel-card className="flex-shrink-0">
            <ProjectCard
              project={project}
              isActive={i === activeIndex}
              onClick={() => onSelect(i)}
            />
          </div>
        ))}

        {/* Ghost spacer at end so last card can center */}
        <div className="flex-shrink-0 w-[calc(50%-9rem)] md:w-[calc(50%-10rem)]" aria-hidden="true" />
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            aria-label={`Go to project ${i + 1}`}
            className={`rounded-full transition-all ${
              i === activeIndex
                ? 'w-6 h-2 bg-primary'
                : 'w-2 h-2 bg-border hover:bg-text-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectCarousel;
