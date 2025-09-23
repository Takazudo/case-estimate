import { useCallback } from 'react';

/**
 * Custom hook for scrolling to the top of the page
 * Simply uses window.scrollTo for consistency
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return scrollToTop;
}
