import { useEffect } from 'react';

const BASE_TITLE = 'Beniamin Cioban';

/**
 * Sets document.title on mount and restores the base title on unmount.
 * @param {string} title - Page-specific part (e.g. "Projects").
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    return () => { document.title = BASE_TITLE; };
  }, [title]);
}
