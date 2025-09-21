'use client';

import { useRouter } from 'next/navigation';
import TopPage from '@/components/top-page';
import AppHeader from '@/components/app-header';
import ErrorBoundary from '@/components/error-boundary';
import { encodeCase } from '@/utils/url-encoder';

export default function HomePage() {
  const router = useRouter();

  const handleCaseSelect = (caseId: string) => {
    // Navigate to /m/ with the selected case
    const encodedCase = encodeCase(caseId);
    router.push(`/m/?c=${encodedCase}`);
  };

  return (
    <ErrorBoundary>
      <div className="h-screen bg-zd-black flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <TopPage onCaseSelect={handleCaseSelect} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
