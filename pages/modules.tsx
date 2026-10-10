import { Island } from '@takazudo/zfb';

import DefaultLayout from '../layouts/default';
import ModulesPage from '@/components/modules-page';

/**
 * Module library / component showcase page.
 *
 * This page has no MDX content — it renders the ModulesPage component
 * directly (ported from app/(content)/modules/page.tsx which imports
 * the ModulesPage client component).
 *
 * ModulesPage is a 'use client' island so it hydrates with react-dom/client
 * and emits a data-zfb-island marker in built HTML.
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/modules',
    },
  };
}

interface ModulesPageProps {
  currentPath?: string;
}

export default function ModulesRoutePage({ currentPath }: ModulesPageProps) {
  return (
    <DefaultLayout
      title="Module Library | Takazudo Modular: Panels"
      description="Browse Takazudo Modular UI modules and component patterns preserved for future reference."
      currentPath={currentPath}
    >
      <Island when="load">
        <ModulesPage />
      </Island>
    </DefaultLayout>
  );
}
