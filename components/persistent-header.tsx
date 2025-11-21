'use client';

import { usePathname } from 'next/navigation';
import AppHeader from './app-header';
import { useIsStandalone } from '@/hooks/use-is-standalone';

export default function PersistentHeader() {
  const pathname = usePathname();
  const isStandalone = useIsStandalone();
  const isFullWidth = pathname === '/m';

  // Hide header only on /m route when in iOS standalone mode
  const shouldHideHeader = pathname === '/m' && isStandalone;

  if (shouldHideHeader) {
    return null;
  }

  return <AppHeader fullWidth={isFullWidth} />;
}
