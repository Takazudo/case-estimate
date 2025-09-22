'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  currentLayout: 'fixed' | 'auto';
  isPageLoading: boolean;
  pageAnimationClass: string;
  triggerLayoutChange: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentLayout, setCurrentLayout] = useState<'fixed' | 'auto'>('fixed');
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [pageAnimationClass, setPageAnimationClass] = useState('page-fade-in');

  // Update layout based on current pathname on mount
  useEffect(() => {
    const newLayout = pathname === '/m' ? 'auto' : 'fixed';
    setCurrentLayout(newLayout);
    setIsPageLoading(false);
    // Trigger fade-in animation when page loads
    setPageAnimationClass('page-fade-in');

    // Reset animation class after animation completes
    const timer = setTimeout(() => {
      setPageAnimationClass('');
    }, 400); // Match animation duration

    return () => clearTimeout(timer);
  }, [pathname]);

  const triggerLayoutChange = (path: string) => {
    const newLayout = path === '/m' ? 'auto' : 'fixed';
    setCurrentLayout(newLayout);
    setIsPageLoading(true);
    // Set loading state for page content
    setPageAnimationClass('page-loading');
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
