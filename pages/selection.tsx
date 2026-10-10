import { getCollection } from '@takazudo/zfb/content';

import DefaultLayout from '../layouts/default';
import { ArticleContent } from '~/components/article-content';
import { contentComponents } from './_mdx-components';

/**
 * Panel selection guide page — renders content/selection.mdx.
 *
 * Static article content with heading/paragraph overrides. No islands.
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/selection',
    },
  };
}

interface SelectionPageProps {
  currentPath?: string;
}

export default function SelectionPage({ currentPath }: SelectionPageProps) {
  const entries = getCollection<{ title: string; description?: string }>('content');
  const entry = entries.find((e) => e.slug === 'selection');

  const title = entry?.data.title ?? 'パネルの選択方法 | Takazudo Modular: Panels';
  const description = entry?.data.description;

  return (
    <DefaultLayout title={title} description={description} currentPath={currentPath}>
      <ArticleContent>
        {entry ? <entry.Content components={contentComponents} /> : <p>Content not found.</p>}
      </ArticleContent>
    </DefaultLayout>
  );
}
