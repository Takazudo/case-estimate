import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import PersistentHeader from '@/components/persistent-header';
import PageLoadingIndicator from '@/components/page-loading-indicator';
import PageContent from '@/components/page-content';
import { NavigationProvider } from '@/components/navigation-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'Takazudo Modular: Panels',
  description:
    'Interactive tool for customizing Takazudo Modular synthesizer cases with real-time price estimates',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Suspense fallback={null}>
          <NavigationProvider>
            <PageLoadingIndicator />
            <PageContent>
              <PersistentHeader />
              {children}
            </PageContent>
          </NavigationProvider>
        </Suspense>
      </body>
    </html>
  );
}
