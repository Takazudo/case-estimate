'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from './navigation-context';

interface PageContentProps {
  children: React.ReactNode;
}

export default function PageContent({ children }: PageContentProps) {
  const pathname = usePathname();
  const { pageAnimationClass } = useNavigation();

  const isConfiguratorRoute = pathname === '/m';

  // For /m route: fixed viewport height layout
  // For other routes: min-height layout with normal scrolling
  const containerClassName = isConfiguratorRoute
    ? 'h-screen bg-zd-black flex flex-col'
    : 'min-h-screen bg-zd-black flex flex-col';

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
