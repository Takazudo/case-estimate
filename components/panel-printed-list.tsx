'use client';

import { ArticleGridImageList } from '@/components/article/article-grid-image-list';

// 3D printed panel data - baked into this component so it can be used from MDX
// without needing to export JS data from content collection files.
// Source: app/(content)/panel/page.mdx printedPanels array.
const printedPanels = [
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-black/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-black/2000w.webp',
    imageAlt: 'ブラック',
    heading: 'カーボンブラック',
    subHeading: 'PLA-CF',
    blurhash: 'UhG+N|%2-:of~qRkR*WV%Mt7M{j[RjWBRks:',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-bone-white/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-bone-white/2000w.webp',
    imageAlt: 'ボーンホワイト',
    heading: 'ボーンホワイト',
    subHeading: 'PLA',
    blurhash: 'URH2i;D*N1xu.Axtayayp0t8s,f6x]a#adRk',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-blue/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-blue/2000w.webp',
    imageAlt: 'クリアブルー',
    heading: 'クリアブルー',
    subHeading: 'PETG',
    blurhash: 'UfFsGQ,-$xkD~TSiR-WV=_kDNIayo#ayR*sl',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-red/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-red/2000w.webp',
    imageAlt: 'クリアレッド',
    heading: 'クリアレッド',
    subHeading: 'PETG',
    blurhash: 'UlKcU}ODTcoy.lnPnioLyDtQa1bHw{fkaKWB',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-crymson-red/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-crymson-red/2000w.webp',
    imageAlt: 'クリムゾンレッド',
    heading: 'クリムゾンレッド',
    subHeading: 'PLA',
    blurhash: 'UmM5tlS}K$t7uir?r?jZtlozn5bHwJayV@WU',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-dark-orange/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-dark-orange/2000w.webp',
    imageAlt: 'ダークオレンジ',
    heading: 'ダークオレンジ',
    subHeading: 'PLA',
    blurhash: 'UdM;:mBT7es:Ly+^wJn%g$XS#SWp,sj[WBS2',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-light-orange/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-light-orange/2000w.webp',
    imageAlt: 'ライトオレンジ',
    heading: 'ライトオレンジ',
    subHeading: 'PLA',
    blurhash: 'UUM}8eBU3Bbv4S;gwco0L2Or+vn%=eoLnONb',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-yellow/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-yellow/2000w.webp',
    imageAlt: 'ディープイエロー',
    heading: 'ディープイエロー',
    subHeading: 'PLA',
    blurhash: 'UWK][LEl5Zt6Gw-QxCoJX.X9$eWW-TjZadR+',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-gold-yellow/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-gold-yellow/2000w.webp',
    imageAlt: 'ブライトゴールド',
    heading: 'ブライトゴールド',
    subHeading: 'PLA',
    blurhash: 'UUHd:85a9*%0BH-PoIWVJZof$wWB%1WBWANL',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-gold/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-gold/2000w.webp',
    imageAlt: 'ディープゴールド',
    heading: 'ディープゴールド',
    subHeading: 'PLA',
    blurhash: 'UZMG6HXUKkxuLN$enOjZb_S$rqWC$fn$WVf+',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-indigo-blue/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-indigo-blue/2000w.webp',
    imageAlt: 'インディゴブルー',
    heading: 'インディゴブルー',
    subHeading: 'Indigo Blue',
    blurhash: 'UVIOU-?F~V%L^$4oRjoJ?ZxaD*M|o#aeR+oz',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-red-green-silk/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-red-green-silk/2000w.webp',
    imageAlt: 'レッドグリーンシルク',
    heading: 'レッドグリーンシルク',
    subHeading: 'PLA',
    blurhash: 'UQI4;N.8pJ%M.TxaWVkCO?j]n3RPxGXSjYso',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-green/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-green/2000w.webp',
    imageAlt: 'グリーン',
    heading: 'グリーン',
    subHeading: 'PLA',
    blurhash: 'UzI5}8xG-poe~WS2bIR*-ps:NGjukCazNGs:',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-silver/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-silver/2000w.webp',
    imageAlt: 'シルバーグレー',
    heading: 'シルバーグレー',
    subHeading: 'PLA',
    blurhash: 'UeJkcTR5xYju~VtRofWV-oj[Rkj@tQWVR*s:',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-silver-white/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-silver-white/2000w.webp',
    imageAlt: 'シルバーホワイト',
    heading: 'シルバーホワイト',
    subHeading: 'PLA',
    blurhash: 'U8NAxC~B$%_3~qXTbHf+%MayNHjs?vodNGoe',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-pink/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-pink/2000w.webp',
    imageAlt: 'ピンク',
    heading: 'ピンク',
    subHeading: 'PLA',
    blurhash: 'U9J?s*0_0_-p2,}[sp$*1YR*=Mr@^kw|,[Ee',
  },
  {
    thumbUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-caramel/900w.webp',
    enlargeUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-caramel/2000w.webp',
    imageAlt: 'キャラメル',
    heading: 'キャラメル',
    subHeading: 'PLA',
    blurhash: 'UaMF,xyDu4xuy?iwV@jZpckqVYWBr?WCenoz',
  },
];

/**
 * 3D printed panel grid for the /panel page.
 * Wraps ArticleGridImageList with the 3D printed panel data baked in,
 * so the MDX content file does not need to export JS data.
 */
export function PrintedPanelList() {
  return <ArticleGridImageList items={printedPanels} />;
}
