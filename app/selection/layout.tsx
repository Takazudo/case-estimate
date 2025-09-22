import ErrorBoundary from '@/components/error-boundary';
import type { ReactNode } from 'react';

export default function SelectionLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <div className="h-full overflow-y-auto bg-zd-black">
        <div className="container mx-auto px-hgap-md py-vgap-lg max-w-[1400px]">{children}</div>
      </div>
    </ErrorBoundary>
  );
}
