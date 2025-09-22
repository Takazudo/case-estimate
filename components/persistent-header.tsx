'use client';

import { usePathname } from 'next/navigation';
import AppHeader from './app-header';

export default function PersistentHeader() {
  const pathname = usePathname();

  // Determine layout based on pathname
  // /m page uses auto layout, all others use fixed
  const layout = pathname === '/m' ? 'auto' : 'fixed';

  return <AppHeader layout={layout} />;
}
