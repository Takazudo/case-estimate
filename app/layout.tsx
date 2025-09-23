import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import PersistentHeader from '@/components/persistent-header';
import PageLoadingIndicator from '@/components/page-loading-indicator';
import PageContent from '@/components/page-content';
import { NavigationProvider } from '@/components/navigation-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Takazudo Modular Case Estimate',
  description:
    'Interactive tool for customizing Takazudo Modular synthesizer cases with real-time price estimates',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <NavigationProvider>
            <PageLoadingIndicator />
            <div className="h-screen bg-zd-black flex flex-col">
              <PersistentHeader />
              <PageContent>{children}</PageContent>
            </div>
          </NavigationProvider>
        </Suspense>
      </body>
    </html>
  );
}
