'use client';

import ErrorBoundary from '@/components/error-boundary';
import Footer from '@/components/footer';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ContentLayoutProps {
  children: ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset scroll position when pathname changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <ErrorBoundary>
      <div ref={scrollContainerRef} className="h-full overflow-y-auto bg-zd-black">
        <div className="container mx-auto px-hgap-md py-vgap-lg max-w-[1400px]">
          {children}
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}
