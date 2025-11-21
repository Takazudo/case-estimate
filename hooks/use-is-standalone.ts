'use client';

import { useSyncExternalStore } from 'react';

// Extend Navigator interface for iOS standalone property
interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Detect if the app is running in standalone mode (PWA)
 * Supports both iOS (navigator.standalone) and other platforms (matchMedia)
 */
function getIsStandalone(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check iOS standalone mode
  const nav = window.navigator as NavigatorStandalone;
  if ('standalone' in nav && nav.standalone === true) {
    return true;
  }

  // Check display-mode: standalone for Android/desktop PWAs
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
}

/**
 * Hook to detect if the app is running in standalone mode (PWA)
 * Supports iOS Safari, Android Chrome, and desktop PWAs
 * Uses useSyncExternalStore to prevent flash on first render
 *
 * @returns boolean - true if running in standalone mode, false otherwise
 */
export function useIsStandalone(): boolean {
  return useSyncExternalStore(
    (callback) => {
      // Subscribe to display-mode changes
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    getIsStandalone,
    () => false, // Server-side snapshot
  );
}
