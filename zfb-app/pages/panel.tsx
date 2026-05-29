import { getCollection } from '@takazudo/zfb/content';

import DefaultLayout from '../layouts/default';
import { ArticleContent } from '~/components/article-content';
import { contentComponents } from './_mdx-components';

/**
 * Panel materials page — renders content/panel.mdx.
 *
 * The MDX body references ImgFloatRight (client island), AcrylicPanelList,
 * and PrintedPanelList (both client islands wrapping ArticleGridImageList).
 * These emit data-zfb-island markers in built HTML.
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/panel',
    },
  };
}

interface PanelPageProps {
  currentPath?: string;
}

export default function PanelPage({ currentPath }: PanelPageProps) {
  const entries = getCollection<{ title: string; description?: string }>('content');
  const entry = entries.find((e) => e.slug === 'panel');

  const title = entry?.data.title ?? 'Panel Materials | Takazudo Modular: Panels';
  const description = entry?.data.description;

  return (
    <DefaultLayout title={title} description={description} currentPath={currentPath}>
      <ArticleContent>
        {entry ? <entry.Content components={contentComponents} /> : <p>Content not found.</p>}
      </ArticleContent>
    </DefaultLayout>
  );
}
