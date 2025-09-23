'use client';

import { useNavigation } from './navigation-context';

export default function PageLoadingIndicator() {
  const { isPageLoading } = useNavigation();

  return (
    <div className="h-[2px] w-full bg-zd-link/30 fixed top-0 left-0 z-50">
      {isPageLoading && (
        <div
          className="bg-zd-link h-full absolute left-0 w-0"
          style={{ animation: 'loading-bar 2s ease-in-out infinite' }}
        />
      )}
    </div>
  );
}
