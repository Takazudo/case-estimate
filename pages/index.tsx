import { getCollection } from '@takazudo/zfb/content';

import DefaultLayout from '../layouts/default';
import { ArticleContent } from '~/components/article-content';
import { contentComponents } from './_mdx-components';

/**
 * Home page — renders the "index" content collection entry (zfb-app/content/index.mdx).
 *
 * The MDX body references TopNavGrid (a 'use client' island) so the page emits
 * a data-zfb-island marker in built HTML and hydrates on the client.
 *
 * getStaticProps passes the build-time route to the layout so the active nav
 * highlight renders correctly in the static HTML (no client flash).
 */
export async function getStaticProps() {
  return {
    props: {
      currentPath: '/',
    },
  };
}

interface HomePageProps {
  currentPath?: string;
}

export default function HomePage({ currentPath }: HomePageProps) {
  const entries = getCollection<{ title: string; description?: string }>('content');
  const entry = entries.find((e) => e.slug === 'index');

  const title = entry?.data.title ?? 'Takazudo Modular: Panels';
  const description = entry?.data.description;

  return (
    <DefaultLayout title={title} description={description} currentPath={currentPath}>
      <ArticleContent>
        {entry ? <entry.Content components={contentComponents} /> : <p>Content not found.</p>}
      </ArticleContent>
    </DefaultLayout>
  );
}
