'use client';

import React, { useState, useEffect } from 'react';
import { useNavigation } from './navigation-context';

interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  const [currentPath, setCurrentPath] = useState('');
  const { pageAnimationClass } = useNavigation();

  // Read pathname from browser (SSR-safe)
  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isConfiguratorRoute = currentPath === '/m';

  // For /m route: fixed viewport height layout
  // For other routes: min-height layout with normal scrolling
  const containerClassName = isConfiguratorRoute
    ? 'h-screen flex flex-col'
    : 'min-h-screen flex flex-col';

  return (
    <div className={containerClassName}>
      {React.Children.map(children, (child, index) => {
        // First child is PersistentHeader
        if (index === 0) return child;

        // Second child is the page content
        if (index === 1) {
          const mainClassName = isConfiguratorRoute
            ? `flex-1 overflow-hidden ${pageAnimationClass}`
            : pageAnimationClass;

          return <main className={mainClassName}>{child}</main>;
        }

        return child;
      })}
    </div>
  );
}
