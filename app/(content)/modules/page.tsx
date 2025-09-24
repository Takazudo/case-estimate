import ErrorBoundary from '@/components/error-boundary';
import ModulesPage from '@/components/modules-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Module Library | Takazudo Modular: Panels',
  description:
    'Browse Takazudo Modular UI modules and component patterns preserved for future reference.',
};

export default function ModulesDevPage() {
  return (
    <ErrorBoundary>
      <ModulesPage />
    </ErrorBoundary>
  );
}
