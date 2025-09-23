'use client';

import { useRouter } from 'next/navigation';
import { encodeCase } from '@/utils/url-encoder';
import { useNavigation } from '@/components/navigation-context';
import GridImages from '@/components/article/grid-images';

interface CaseGridProps {
  items: Array<{
    id: string;
    caseId: string;
    caption: string;
    imgSrc: string;
  }>;
  className?: string;
}

export default function CaseGrid({ items, className }: CaseGridProps) {
  const router = useRouter();
  const { triggerNavigation } = useNavigation();

  const handleCaseSelect = (caseId: string) => {
    // Trigger navigation immediately
    triggerNavigation('/m');

    // Navigate to /m/ with the selected case
    const encodedCase = encodeCase(caseId);
    router.push(`/m/?c=${encodedCase}`);
  };

  return <GridImages items={items} onItemClick={handleCaseSelect} className={className} />;
}
