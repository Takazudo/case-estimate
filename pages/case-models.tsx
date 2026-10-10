import { getCollection } from '@takazudo/zfb/content';

import DefaultLayout from '../layouts/default';
import { ArticleContent } from '~/components/article-content';
import { contentComponents } from './_mdx-components';

/**
 * Case models page — renders content/case-models.mdx.
 *
 * The MDX body references ModelSection, ModelSectionGallery, ModelGallery,
 * CaseModelsToc, BuilderNav, PromoText, and H2 — all wired via contentComponents.
 * ModelGallery and ModelSection are 'use client' islands that emit
 * data-zfb-island markers in built HTML.
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/case-models',
    },
  };
}

interface CaseModelsPageProps {
  currentPath?: string;
}

export default function CaseModelsPage({ currentPath }: CaseModelsPageProps) {
  const entries = getCollection<{ title: string; description?: string }>('content');
  const entry = entries.find((e) => e.slug === 'case-models');

  const title = entry?.data.title ?? 'Case Models - Takazudo Modular: Panels';
  const description = entry?.data.description;

  return (
    <DefaultLayout title={title} description={description} currentPath={currentPath}>
      <ArticleContent>
        {entry ? <entry.Content components={contentComponents} /> : <p>Content not found.</p>}
      </ArticleContent>
    </DefaultLayout>
  );
}
