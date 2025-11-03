'use client';

import { H2 } from './article/h2';
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
      blurhash: 'UIHed*RiM|oe~qkCayofofxuWBfP%LV@ofWB',
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
      blurhash: 'UcFsbssW-qt7~XR%WCof-XxuNFagW.jcRja_',
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
      blurhash: 'UfF?3IxY--t7~oRnWCa}-mxtM}fOR.axRkj[',
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
        <h1 className="text-3xl font-bold text-white text-center mb-vgap-md font-futura">
          Module List / コンポーネントリスト
        </h1>

        <p className="mb-vgap-lg text-white">
          This page is a component list for development purposes. Below you can see various UI
          components used throughout the application.
        </p>

        {/* GridImagesAndNotes Component Demo */}
        <H2>GridImagesAndNotes Component</H2>

        <p className="mb-vgap-lg text-white">
          This component displays a grid of items with images, headings, subheadings, and content.
          Each image is enlargeable when clicked. This component is currently preserved for
          potential future use.
        </p>

        <GridImagesAndNotes items={sampleItems} className="mb-vgap-xl" />
      </div>
    </div>
  );
}
