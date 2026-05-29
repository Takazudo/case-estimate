'use client';

import { useState, useEffect } from 'react';
import { normalizePath } from '@/utils/normalize-path';

/**
 * Returns the current browser pathname and keeps it in sync with popstate events.
 * Initialises to '' on the server (SSR-safe); updates to window.location.pathname
 * after hydration and on every SPA navigation.
 *
 * The pathname is normalized (trailing slash stripped) so consumers can compare
 * it against slash-free route literals (e.g. '/m') even when Netlify Pretty URLs
 * 301-redirect to a trailing slash in production.
 */
export function useCurrentPath(): string {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(normalizePath(window.location.pathname));

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return currentPath;
}
