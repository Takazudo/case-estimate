'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface NavigationContextType {
  currentLayout: 'fixed' | 'auto';
  isPageLoading: boolean;
  pageAnimationClass: string;
  triggerLayoutChange: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentLayout, setCurrentLayout] = useState<'fixed' | 'auto'>('fixed');
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageAnimationClass, setPageAnimationClass] = useState('page-fade-in');

  // Update layout and reset loading state when URL changes (pathname or search params)
  useEffect(() => {
    const newLayout = pathname === '/m' ? 'auto' : 'fixed';
    setCurrentLayout(newLayout);
    setIsPageLoading(false);

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
    }, 400); // Match animation duration

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const triggerLayoutChange = (path: string) => {
    const newLayout = path === '/m' ? 'auto' : 'fixed';
    setCurrentLayout(newLayout);

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

    // Failsafe: reset loading state after maximum expected navigation time
    // This prevents getting stuck if useEffect doesn't fire for any reason
    setTimeout(() => {
      setIsPageLoading(false);
      setPageAnimationClass('page-fade-in');
      // Clear animation class after fade-in completes
      setTimeout(() => {
        setPageAnimationClass('');
      }, 400);
    }, 2000); // 2 second maximum loading time
  };

  return (
    <NavigationContext.Provider
      value={{ currentLayout, isPageLoading, pageAnimationClass, triggerLayoutChange }}
    >
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
