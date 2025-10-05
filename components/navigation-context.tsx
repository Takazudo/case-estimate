'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Animation timing constants for consistency and maintainability
const ANIMATION_DURATIONS = {
  FADE_IN: 400, // ms - matches CSS animation duration in globals.css
  NAVIGATION_TIMEOUT: 2000, // ms - maximum expected navigation time
} as const;

interface NavigationContextType {
  isPageLoading: boolean;
  pageAnimationClass: string;
  triggerNavigation: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageAnimationClass, setPageAnimationClass] = useState(() =>
    pathname === '/m' ? '' : 'page-fade-in',
  );
  const failsafeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPathnameRef = React.useRef(pathname);

  // Reset loading state when pathname changes (not search params)
  useEffect(() => {
    // Only trigger animations when the pathname actually changes
    // Ignore search param changes to support in-page navigation (like gallery dialog)
    const isPathnameChange = previousPathnameRef.current !== pathname;

    if (!isPathnameChange) {
      // Search params changed but pathname didn't - skip animations
      return;
    }

    // Update the previous pathname reference
    previousPathnameRef.current = pathname;

    setIsPageLoading(false);

    // Clear any pending failsafe timeout to prevent race conditions
    if (failsafeTimeoutRef.current) {
      clearTimeout(failsafeTimeoutRef.current);
      failsafeTimeoutRef.current = null;
    }

    // Skip page transition animations for /m route (case selection mini app)
    // Users interacting with colors/models/panels shouldn't see fade animations
    if (pathname === '/m') {
      setPageAnimationClass('');
      return;
    }

    // Trigger fade-in animation for other page loads
    setPageAnimationClass('page-fade-in');

    // Reset animation class after animation completes
    const timer = setTimeout(() => {
      setPageAnimationClass('');
    }, ANIMATION_DURATIONS.FADE_IN);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const triggerNavigation = (path: string) => {
    // Clear any existing failsafe timeout before starting new navigation
    if (failsafeTimeoutRef.current) {
      clearTimeout(failsafeTimeoutRef.current);
      failsafeTimeoutRef.current = null;
    }

    // Skip loading animations when navigating to /m route
    // The case selection mini app should feel instant and responsive
    if (path === '/m') {
      setIsPageLoading(false);
      setPageAnimationClass('');
      return;
    }

    setIsPageLoading(true);
    // Set loading state for page content
    setPageAnimationClass('page-loading');

    // Helper function to handle fade-in animation cleanup
    const scheduleFadeInCleanup = () => {
      setTimeout(() => {
        setPageAnimationClass('');
      }, ANIMATION_DURATIONS.FADE_IN);
    };

    // Failsafe: reset loading state after maximum expected navigation time
    // This prevents getting stuck if useEffect doesn't fire for any reason
    failsafeTimeoutRef.current = setTimeout(() => {
      // Check the target path (not current pathname) to determine animations
      // path is the destination we're navigating to
      if (path !== '/m') {
        setPageAnimationClass('page-fade-in');
        scheduleFadeInCleanup();
      } else {
        // If navigating to /m, ensure no animation class
        setPageAnimationClass('');
      }
      setIsPageLoading(false);
      failsafeTimeoutRef.current = null;
    }, ANIMATION_DURATIONS.NAVIGATION_TIMEOUT);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (failsafeTimeoutRef.current) {
        clearTimeout(failsafeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ isPageLoading, pageAnimationClass, triggerNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
