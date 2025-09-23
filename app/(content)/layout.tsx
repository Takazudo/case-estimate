import ContentLayout from '@/components/content-layout';
import type { ReactNode } from 'react';

export default function ContentGroupLayout({ children }: { children: ReactNode }) {
  return <ContentLayout>{children}</ContentLayout>;
}
