'use client';

import { useRouter } from 'next/navigation';
import TopPage from '@/components/top-page';
import ErrorBoundary from '@/components/error-boundary';
import { encodeCase } from '@/utils/url-encoder';
import { useNavigation } from '@/components/navigation-context';

export default function HomePage() {
  const router = useRouter();
  const { triggerLayoutChange } = useNavigation();

  const handleCaseSelect = (caseId: string) => {
    // Trigger layout change immediately
    triggerLayoutChange('/m');

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
