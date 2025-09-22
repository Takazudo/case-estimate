'use client';

import { useRouter } from 'next/navigation';
import TopPage from '@/components/top-page';
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
      <TopPage onCaseSelect={handleCaseSelect} />
    </ErrorBoundary>
  );
}
