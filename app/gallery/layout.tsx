'use client';

import ErrorBoundary from '@/components/error-boundary';
import Footer from '@/components/footer';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

export default function GalleryLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset scroll position when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ErrorBoundary>
      <div className="bg-black pt-[96px]">
        {children}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
