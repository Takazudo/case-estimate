'use client';

import AppHeader from '@/components/app-header';
import ErrorBoundary from '@/components/error-boundary';
import PanelMaterialPage from '@/components/panel-material-page';

export default function PanelPage() {
  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader selectedCase={null} onCaseSelect={() => {}} />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <PanelMaterialPage />
        </ErrorBoundary>
      </main>
    </div>
  );
}
