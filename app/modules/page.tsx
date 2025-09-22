import AppHeader from '@/components/app-header';
import ErrorBoundary from '@/components/error-boundary';
import ModulesPage from '@/components/modules-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Module Library | Takazudo Modular Case Estimate',
  description:
    'Browse Takazudo Modular UI modules and component patterns preserved for future reference.',
};

export default function ModulesDevPage() {
  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <ModulesPage />
        </ErrorBoundary>
      </main>
    </div>
  );
}
