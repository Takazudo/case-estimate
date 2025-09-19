import ArticleH2 from './article/article-h2';
import ArticleText from './article/article-text';
import { GridImagesAndNotes } from './article/grid-images-and-notes';
import type { GridItem } from './article/grid-images-and-notes';

export default function ModulesPage() {
  // Sample data for GridImagesAndNotes component
  const sampleItems: GridItem[] = [
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/2000w.webp',
      imageAlt: 'サンプル1',
      heading: 'カーボンブラック',
      subHeading: 'PLA-CF',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex ea commodo consequat. Duis
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/2000w.webp',
      imageAlt: 'サンプル2',
      heading: 'クリムゾンレッド',
      subHeading: 'PLA',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex ea commodo consequat. Duis
          </p>
        </>
      ),
    },
    {
      thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/900w.webp',
      enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/2000w.webp',
      imageAlt: 'サンプル3',
      heading: 'ダークオレンジ',
      subHeading: 'PLA',
      content: (
        <>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore vip ex ea commodo consequat. Duis
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-zd-black">
      <div className="container mx-auto px-hgap-md py-vgap-lg max-w-[1400px]">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-vgap-md">
          Module List / コンポーネントリスト
        </h1>

        <ArticleText className="mb-vgap-lg">
          <p>
            This page is a component list for development purposes. Below you can see various UI
            components used throughout the application.
          </p>
        </ArticleText>

        {/* GridImagesAndNotes Component Demo */}
        <ArticleH2>GridImagesAndNotes Component</ArticleH2>

        <ArticleText className="mb-vgap-lg">
          <p>
            This component displays a grid of items with images, headings, subheadings, and content.
            Each image is enlargeable when clicked. This component is currently preserved for
            potential future use.
          </p>
        </ArticleText>

        <GridImagesAndNotes items={sampleItems} className="mb-vgap-xl" />
      </div>
    </div>
  );
}
