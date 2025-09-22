import { Suspense } from 'react';
import Configurator from '@/components/configurator';
import ErrorBoundary from '@/components/error-boundary';

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Configurator />
      </Suspense>
    </ErrorBoundary>
  );
}
