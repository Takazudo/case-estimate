import ErrorBoundary from '@/components/error-boundary';
import type { ReactNode } from 'react';

interface ContentLayoutProps {
  children: ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="h-full overflow-y-auto bg-zd-black">
        <div className="container mx-auto px-hgap-md py-vgap-lg max-w-[1400px]">{children}</div>
      </div>
    </ErrorBoundary>
  );
}
