import Configurator from '@/components/configurator';
import ErrorBoundary from '@/components/error-boundary';

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Configurator />
    </ErrorBoundary>
  );
}
