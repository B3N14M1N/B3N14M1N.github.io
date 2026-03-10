import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook that tracks which section is currently visible in the viewport.
 *
 * @param {string} sectionSelector   - CSS selector for the tracked sections.
 * @param {object} [options]
 * @param {number} [options.offset=0.4] - fraction of viewport height to use as threshold.
 * @param {boolean} [options.updateHash=false] - update the URL hash on scroll.
 * @returns {{ activeId: string, scrollTo: (id: string) => void }}
 */
export function useScrollSpy(sectionSelector, { offset = 0.4, updateHash = false } = {}) {
  const [activeId, setActiveId] = useState('');
  const isManualRef = useRef(false);
  const manualTimerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Delay enabling scroll spy so initial deep-link scroll
    // can finish without the spy overriding the target.
    const enableTimer = setTimeout(() => {
      mountedRef.current = true;
    }, 1200);

    const handleScroll = () => {
      if (isManualRef.current || !mountedRef.current) return;

      const sections = document.querySelectorAll(sectionSelector);
      if (!sections.length) return;

      const threshold = window.innerHeight * offset;
      let bestId = '';

      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top < threshold) {
          bestId = el.id;
        }
      }

      if (bestId) {
        setActiveId(bestId);
        if (updateHash) {
          const currentHash = window.location.hash;
          const baseHash = currentHash.split('#').slice(0, 2).join('#') || '#';
          const newHash = `${baseHash}#${bestId}`;
          if (currentHash !== newHash) {
            window.history.replaceState(null, '', newHash);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(enableTimer);
    };
  }, [sectionSelector, offset, updateHash]);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Temporarily disable scroll spy so we don't fight
    isManualRef.current = true;
    clearTimeout(manualTimerRef.current);

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);

    // Re-enable after scroll settles
    manualTimerRef.current = setTimeout(() => {
      isManualRef.current = false;
      mountedRef.current = true; // also ensure spy is enabled after manual scrolls
    }, 1000);
  }, []);

  return { activeId, scrollTo };
}
