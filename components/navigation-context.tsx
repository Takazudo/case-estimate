'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  currentLayout: 'fixed' | 'auto';
  triggerLayoutChange: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentLayout, setCurrentLayout] = useState<'fixed' | 'auto'>('fixed');

  // Update layout based on current pathname on mount
  useEffect(() => {
    const newLayout = pathname === '/m' ? 'auto' : 'fixed';
    setCurrentLayout(newLayout);
  }, [pathname]);

  const triggerLayoutChange = (path: string) => {
    const newLayout = path === '/m' ? 'auto' : 'fixed';
    setCurrentLayout(newLayout);
  };

  return (
    <NavigationContext.Provider value={{ currentLayout, triggerLayoutChange }}>
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
