import { useCallback } from 'react';

/**
 * Custom hook for scrolling to the top of the page
 * Looks for a container with data-scroll-container attribute,
 * falls back to window scroll if not found
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    // Find the scrollable container marked with data attribute
    const scrollContainer = document.querySelector('[data-scroll-container]');

    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  return scrollToTop;
}
