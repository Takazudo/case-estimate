'use client';

import React from 'react';
import { useNavigation } from './navigation-context';
import { useCurrentPath } from '@/hooks/use-current-path';

interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  const currentPath = useCurrentPath();
  const { pageAnimationClass } = useNavigation();

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
