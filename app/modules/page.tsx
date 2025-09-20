'use client';

import AppHeader from '@/components/app-header';
import ErrorBoundary from '@/components/error-boundary';
import ModulesPage from '@/components/modules-page';

export default function ModulesDevPage() {
  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader selectedCase={null} onCaseSelect={() => {}} />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <ModulesPage />
        </ErrorBoundary>
      </main>
    </div>
  );
}
