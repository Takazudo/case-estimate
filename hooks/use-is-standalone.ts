'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the app is running in iOS standalone mode
 * (added to home screen and opened as a web app)
 *
 * @returns boolean - true if running in iOS standalone mode, false otherwise
 */
export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in iOS standalone mode
    // window.navigator.standalone is iOS-specific API
    const standalone = 'standalone' in window.navigator && window.navigator.standalone === true;
    setIsStandalone(standalone);
  }, []);

  return isStandalone;
}
