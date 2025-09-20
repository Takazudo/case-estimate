import AppHeader from '@/components/app-header';
import ErrorBoundary from '@/components/error-boundary';
import PanelMaterialPage from '@/components/panel-material-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Materials | Takazudo Modular Case Estimate',
  description:
    'Explore Takazudo Modular panel materials with detailed imagery and descriptions for acrylic and 3D printed options.',
};

export default function PanelPage() {
  return (
    <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
      <AppHeader selectedCase={null} />
      <main className="flex-1 overflow-hidden">
        <ErrorBoundary>
          <PanelMaterialPage />
        </ErrorBoundary>
      </main>
    </div>
  );
}
