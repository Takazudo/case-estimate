import { getCollection } from '@takazudo/zfb/content';

import DefaultLayout from '../layouts/default';
import { ArticleContent } from '~/components/article-content';
import { contentComponents } from './_mdx-components';

/**
 * FAQ page — renders content/faq.mdx.
 *
 * Currently a stub ("Coming soon"). No islands — static HTML only.
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/faq',
    },
  };
}

interface FaqPageProps {
  currentPath?: string;
}

export default function FaqPage({ currentPath }: FaqPageProps) {
  const entries = getCollection<{ title: string; description?: string }>('content');
  const entry = entries.find((e) => e.slug === 'faq');

  const title = entry?.data.title ?? 'よくあるご質問 / FAQ - Takazudo Modular: Panels';
  const description = entry?.data.description;

  return (
    <DefaultLayout title={title} description={description} currentPath={currentPath}>
      <ArticleContent>
        {entry ? <entry.Content components={contentComponents} /> : <p>Content not found.</p>}
      </ArticleContent>
    </DefaultLayout>
  );
}
