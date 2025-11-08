import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import PersistentHeader from '@/components/persistent-header';
import PageLoadingIndicator from '@/components/page-loading-indicator';
import PageContent from '@/components/page-content';
import { NavigationProvider } from '@/components/navigation-context';
import { Noto_Sans } from 'next/font/google';
import './globals.css';

const notoSans = Noto_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Takazudo Modular: Panels',
  description:
    'Interactive tool for customizing Takazudo Modular synthesizer cases with real-time price estimates',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={notoSans.variable}>
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
