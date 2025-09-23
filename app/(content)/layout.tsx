'use client';

import ErrorBoundary from '@/components/error-boundary';
import Footer from '@/components/footer';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export default function ContentGroupLayout({ children }: { children: ReactNode }) {
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
      <div ref={scrollContainerRef} className="bg-zd-black pt-[96px]" data-scroll-container>
        <div
          className={`
            box-content mx-auto max-w-[1280px]
            px-hgap-sm md:px-hgap-md
            py-vgap-lg
          `}
        >
          {children}
        </div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
