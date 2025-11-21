import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Takazudo Modular Panels - Builder',
  description: 'Build your custom Takazudo Modular synthesizer case',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'TM Panels',
  },
};

export default function MLayout({ children }: { children: ReactNode }) {
  return children;
}
