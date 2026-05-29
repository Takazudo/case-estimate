'use client';

import { ArticleGridImageList } from '@/components/article/article-grid-image-list';

// Acrylic panel data - baked into this component so it can be used from MDX
// without needing to export JS data from content collection files.
// Source: app/(content)/panel/page.mdx acrylicPanels array.
const acrylicPanels = [
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/2000w.webp',
    imageAlt: 'クリア（透明）',
    heading: 'クリア',
    subHeading: 'Transparent',
    blurhash: 'UIHed*RiM|oe~qkCayofofxuWBfP%LV@ofWB',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-glass/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-glass/2000w.webp',
    imageAlt: 'グラス',
    heading: 'ガラスシアン',
    subHeading: 'Glass Cyan',
    blurhash: 'UPGu?wV@jGs:~qbHWBkC%Mt7Rjayx[WBbHf6',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/2000w.webp',
    imageAlt: 'フォレスト',
    heading: 'フォレスト',
    subHeading: 'Deep Green',
    blurhash: 'UcFsbssW-qt7~XR%WCof-XxuNFagW.jcRja_',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-lime/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-lime/2000w.webp',
    imageAlt: 'ライム',
    heading: 'ライム',
    subHeading: 'Light Green',
    blurhash: 'UKE:Lvv.REkV?1o[jYkAw8ozX3jH%KV]bpaM',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/2000w.webp',
    imageAlt: 'オーシャンブルー',
    heading: 'オーシャンブルー',
    subHeading: 'Deep Blue',
    blurhash: 'UfF?3IxY--t7~oRnWCa}-mxtM}fOR.axRkj[',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-orange/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-orange/2000w.webp',
    imageAlt: 'オレンジ',
    heading: 'オレンジ',
    subHeading: 'Orange',
    blurhash: 'UPH^V9NdGGozuiwcnibHPUkqv~WC$%S4r?ni',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-pink/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-pink/2000w.webp',
    imageAlt: 'ピンク',
    heading: 'ピンク',
    subHeading: 'Pink',
    blurhash: 'UJH,SGO?7foyUa#,nisALKozv~WU-BS1v~Nw',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-red/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-red/2000w.webp',
    imageAlt: 'レッド',
    heading: 'レッド',
    subHeading: 'Red',
    blurhash: 'UiKckctRyCs:?]aKWBWBpIozRPbbniWBV@oy',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-shadow/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-shadow/2000w.webp',
    imageAlt: 'シャドウ',
    heading: 'シャドー',
    subHeading: 'Gray',
    blurhash: 'UpH2cmxa%Mj[~qRjWBay-:t7M{j[WCayV[of',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-sky-blue/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-sky-blue/2000w.webp',
    imageAlt: 'スカイブルー',
    heading: 'スカイブルー',
    subHeading: 'Light Blue',
    blurhash: 'UxL4Tns.-Tt6~BR+R+j[%0xaNHWCW=WBR*oL',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-yellow/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-yellow/2000w.webp',
    imageAlt: 'イエロー',
    heading: 'イエロー',
    subHeading: 'Yellow',
    blurhash: 'UWH-@~WCSkof.TjXayj[byt8aca#xYa$jXay',
  },
];

/**
 * Acrylic panel grid for the /panel page.
 * Wraps ArticleGridImageList with the acrylic panel data baked in,
 * so the MDX content file does not need to export JS data.
 */
export function AcrylicPanelList() {
  return <ArticleGridImageList items={acrylicPanels} />;
}
