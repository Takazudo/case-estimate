/**
 * Navigation data for the application
 * Single source of truth for all navigation items
 */

/**
 * Main header navigation item
 */
export interface NavItem {
  href: string;
  label: string;
}

/**
 * Top page navigation card with image and description
 */
export interface TopNavItem {
  id: string;
  href: string;
  title: string;
  titleEn: string;
  description: string;
  imageSlug: string;
  /**
   * Blurhash string for image placeholder
   * Generated using blurhash algorithm from the actual images
   * @see https://blurha.sh/
   */
  blurhash: string;
}

/**
 * Main navigation items used in header and mobile menu
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  { href: '/gallery', label: 'ギャラリー' },
  { href: '/case-models', label: 'ケースの種類' },
  { href: '/panel', label: 'パネル素材' },
  { href: '/price', label: '価格' },
  { href: '/faq', label: 'FAQ' },
  { href: '/m', label: 'ケースを作る' },
];

/**
 * Top page navigation grid items
 * Images are served from takazudomodular.com CDN
 * Blurhash values were generated from the actual images for progressive loading
 */
export const TOP_NAV_ITEMS: TopNavItem[] = [
  {
    id: 'gallery',
    href: '/gallery',
    title: 'ギャラリー',
    titleEn: 'Gallery',
    description:
      'どのようなケースなのか、ギャラリーページに写真をまとめています。 ケースの雰囲気を知りたい場合にご覧頂ければと。',
    imageSlug: 'panels-top-thumb-1',
    blurhash: 'UBDb1ppI}?xDtk$#s:bEtQ10,pNcw3F{FLag',
  },
  {
    id: 'case-models',
    href: '/case-models',
    title: 'ケースの種類',
    titleEn: 'Case Models',
    description:
      'このケースで使えるパネルはアクリルボード、3Dプリンタ製パネルの二種類。全種類を写真付きで紹介しています。',
    imageSlug: 'panels-top-thumb-2',
    blurhash: 'UAE-Ku}*5kF_7cW;wgM#M#ER11M|$%FJi{=^',
  },
  {
    id: 'panel-materials',
    href: '/panel',
    title: 'パネル素材',
    titleEn: 'Panel Materials',
    description:
      'このケースで使えるパネルはアクリルボード、3Dプリンタ製パネルの二種類。全種類を以下で紹介しています。',
    imageSlug: 'panels-top-thumb-3',
    blurhash: 'UxHcs3|{+|X3]~#Sw0XRS~NeR.kCbuj]s8wc',
  },
  {
    id: 'case-builder',
    href: '/m',
    title: 'ケースビルダー',
    titleEn: 'Case Builder',
    description: '展開図を元に、各パネルへの色反映をシミュレート。そのままご注文も可能です。',
    imageSlug: 'panels-top-thumb-4',
    blurhash: 'UXGHrMD%k=xH~Cxun*kWrr?aRjbbR*%fs:NH',
  },
  {
    id: 'pricing',
    href: '/price',
    title: '価格',
    titleEn: 'Pricing',
    description:
      'ケースの価格を表にまとめています。価格は、モデル毎／レールの種類毎に異なります。パネルはアクリルか3Dプリンタ製かで異なり、パネルカラーによる価格差はありません。',
    imageSlug: 'panels-top-thumb-5',
    blurhash: 'UNC$[zDi~paJ%Mivt7nixFRjayWCs:WXWBof',
  },
  {
    id: 'faq',
    href: '/faq',
    title: 'よくあるご質問',
    titleEn: 'FAQ',
    description: 'よくあるご質問をまとめています。',
    imageSlug: 'panels-top-thumb-6',
    blurhash: 'UEJ$WsNd=s^iAHAGr?-U9_R+ays.}q-AW;R+',
  },
];
