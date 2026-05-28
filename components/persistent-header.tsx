'use client';

import { useState, useEffect } from 'react';
import AppHeader from './app-header';
import { useIsStandalone } from '@/hooks/use-is-standalone';

export default function PersistentHeader() {
  const [currentPath, setCurrentPath] = useState('');
  const isStandalone = useIsStandalone();

  // Read pathname from browser (SSR-safe)
  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isFullWidth = currentPath === '/m';

  // Hide header only on /m route when in iOS standalone mode
  const shouldHideHeader = currentPath === '/m' && isStandalone;

  if (shouldHideHeader) {
    return null;
  }

  return <AppHeader fullWidth={isFullWidth} />;
}
