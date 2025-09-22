'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppHeader from './app-header';

export default function PersistentHeader() {
  const pathname = usePathname();
  const [layout, setLayout] = useState<'fixed' | 'auto'>('fixed');

  useEffect(() => {
    // Determine layout based on pathname
    // /m page uses auto layout, all others use fixed
    const newLayout = pathname === '/m' ? 'auto' : 'fixed';

    // Add a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setLayout(newLayout);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <AppHeader layout={layout} />;
}
