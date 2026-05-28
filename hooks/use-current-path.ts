'use client';

import { useState, useEffect } from 'react';

/**
 * Returns the current browser pathname and keeps it in sync with popstate events.
 * Initialises to '' on the server (SSR-safe); updates to window.location.pathname
 * after hydration and on every SPA navigation.
 */
export function useCurrentPath(): string {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return currentPath;
}
