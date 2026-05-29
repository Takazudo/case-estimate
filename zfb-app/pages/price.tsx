import { getCollection } from '@takazudo/zfb/content';

import DefaultLayout from '../layouts/default';
import { ArticleContent } from '~/components/article-content';
import { contentComponents } from './_mdx-components';

/**
 * Price page — renders content/price.mdx.
 *
 * The MDX body references PriceTable (static component — no 'use client').
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/price',
    },
  };
}

interface PricePageProps {
  currentPath?: string;
}

export default function PricePage({ currentPath }: PricePageProps) {
  const entries = getCollection<{ title: string; description?: string }>('content');
  const entry = entries.find((e) => e.slug === 'price');

  const title = entry?.data.title ?? '価格 | Takazudo Modular Case Estimate';
  const description = entry?.data.description;

  return (
    <DefaultLayout title={title} description={description} currentPath={currentPath}>
      <ArticleContent>
        {entry ? <entry.Content components={contentComponents} /> : <p>Content not found.</p>}
      </ArticleContent>
    </DefaultLayout>
  );
}
