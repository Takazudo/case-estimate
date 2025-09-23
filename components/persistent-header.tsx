'use client';

import { usePathname } from 'next/navigation';
import AppHeader from './app-header';

export default function PersistentHeader() {
  const pathname = usePathname();
  const isFullWidth = pathname === '/m';

  return <AppHeader fullWidth={isFullWidth} />;
}
