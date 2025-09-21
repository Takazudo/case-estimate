import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Takazudo Modular Case Estimate',
  description:
    'Interactive tool for customizing Takazudo Modular synthesizer cases with real-time price estimates',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
