import type { Colors, Material } from '@/types';

// Default panel color constant
export const DEFAULT_PANEL_COLOR = '#1f2937';

// Helper function to get color opacity by hex value
export const getColorOpacityByValue = (hexValue: string, material: Material): number => {
  // Handle pattern values
  if (hexValue.startsWith('pattern-')) {
    return 1; // Patterns are always fully opaque
  }

  const colorList = colors[material];

  // For 3dp materials, check if this is a semi-transparent color
  // クリアレッド (#b71c1c) and クリアブルー (#0d47a1) should have 0.8 opacity
  if (material === '3dp') {
    // Find colors with explicit opacity < 1 (prefer semi-transparent versions)
    const semiTransparentColor = colorList.find(
      (c) => c.value === hexValue && c.opacity !== undefined && c.opacity < 1,
    );
    if (semiTransparentColor && semiTransparentColor.opacity !== undefined) {
      return semiTransparentColor.opacity;
    }
  }

  // Default lookup
  const color = colorList.find((c) => c.value === hexValue);
  const opacity = color?.opacity ?? 1; // Default to 1 (fully opaque) if not specified
  return opacity;
};

// Helper function to get color opacity by color ID
export const getColorOpacityById = (colorId: string, material: Material): number => {
  const colorList = colors[material];
  const color = colorList.find((c) => c.id === colorId);
  const opacity = color?.opacity ?? 1; // Default to 1 (fully opaque) if not specified
  return opacity;
};

export const colors: Colors = {
  acrylic: [
    {
      id: 'red',
      name: 'レッド',
      value: '#5e0007',
      material: 'Red',
      opacity: 0.6,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-red/900w.webp',
    },
    {
      id: 'orange',
      name: 'オレンジ',
      value: '#d14600',
      material: 'Orange',
      opacity: 0.6,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-orange/900w.webp',
    },
    {
      id: 'yellow',
      name: 'イエロー',
      value: '#dda300',
      material: 'Yellow',
      opacity: 0.45,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-yellow/900w.webp',
    },
    {
      id: 'clear',
      name: 'クリア',
      value: '#f8f9fa',
      material: 'Transparent',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-clear/900w.webp',
    },
    {
      id: 'frost-clear',
      name: 'ガラスシアン',
      value: '#4a9b9b',
      material: 'Glass Cyan',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-glass/900w.webp',
    },
    {
      id: 'ocean-blue',
      name: 'オーシャンブルー',
      value: '#0d47a1',
      material: 'Deep Blue',
      opacity: 0.8,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-ocean-blue/900w.webp',
    },
    {
      id: 'sky-blue',
      name: 'スカイブルー',
      value: '#4497aa',
      material: 'Light Blue',
      opacity: 0.45,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-sky-blue/900w.webp',
    },
    {
      id: 'forest',
      name: 'フォレスト',
      value: '#1b5e20',
      material: 'Deep Green',
      opacity: 0.7,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-forest/900w.webp',
    },
    {
      id: 'lime',
      name: 'ライム',
      value: '#8bc34a',
      material: 'Light Green',
      opacity: 0.7,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-lime/900w.webp',
    },
    {
      id: 'shadow',
      name: 'シャドー',
      value: '#616161',
      material: 'Gray',
      opacity: 0.8,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-shadow/900w.webp',
    },
    {
      id: 'pink',
      name: 'ピンク',
      value: '#e91e63',
      material: 'Pink',
      opacity: 0.6,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-ac-pink/900w.webp',
    },
  ],
  '3dp': [
    {
      id: 'carbon-black',
      name: 'カーボンブラック',
      value: '#212121',
      material: 'PLA-CF',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-black/900w.webp',
    },
    {
      id: 'bone-white',
      name: 'ボーンホワイト',
      value: '#a59d88',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-bone-white/900w.webp',
    },
    {
      id: 'clear-blue',
      name: 'クリアブルー',
      value: '#0d47a1',
      material: 'PETG',
      opacity: 0.6,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-blue/900w.webp',
    },
    {
      id: 'clear-red',
      name: 'クリアレッド',
      value: '#b71c1c',
      material: 'PETG',
      opacity: 0.6,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-clear-red/900w.webp',
    },
    {
      id: 'crimson-red',
      name: 'クリムゾンレッド',
      value: '#b71c1c',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-crymson-red/900w.webp',
    },
    {
      id: 'dark-orange',
      name: 'ダークオレンジ',
      value: '#e65100',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-dark-orange/900w.webp',
    },
    {
      id: 'light-orange',
      name: 'ライトオレンジ',
      value: '#ff8a50',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-light-orange/900w.webp',
    },
    {
      id: 'deep-yellow',
      name: 'ディープイエロー',
      value: '#d4a017',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-yellow/900w.webp',
    },
    {
      id: 'bright-gold',
      name: 'ブライトゴールド',
      value: '#f1c40f',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-gold-yellow/900w.webp',
    },
    {
      id: 'deep-gold',
      name: 'ディープゴールド',
      value: '#ff9900',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-deep-gold/900w.webp',
    },
    {
      id: 'indigo-blue',
      name: 'インディゴブルー',
      value: '#172854',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-indigo-blue/900w.webp',
    },
    {
      id: 'red-green-silk',
      name: 'レッドグリーンシルク',
      value: 'pattern-red-green-stripe',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-red-green-silk/900w.webp',
    },
    {
      id: 'green',
      name: 'グリーン',
      value: '#2d5d2d',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-green/900w.webp',
    },
    {
      id: 'silver-gray',
      name: 'シルバーグレー',
      value: '#9ca3af',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-silver/900w.webp',
    },
    {
      id: 'silver-white',
      name: 'シルバーホワイト',
      value: '#dfe0dd',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-silver-white/900w.webp',
    },
    {
      id: '3dp-pink',
      name: 'ピンク',
      value: '#d4a5b0',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-pink/900w.webp',
    },
    {
      id: 'caramel',
      name: 'キャラメル',
      value: '#ab461e',
      material: 'PLA',
      opacity: 1,
      imageUrl: 'https://takazudomodular.com/images/p/panel-sample-3dp-caramel/900w.webp',
    },
  ],
  presets: {
    acrylic: [
      { id: 'red', name: 'フルレッド', description: 'All Red', colors: { all: 'red' } },
      { id: 'orange', name: 'フルオレンジ', description: 'All Orange', colors: { all: 'orange' } },
      { id: 'yellow', name: 'フルイエロー', description: 'All Yellow', colors: { all: 'yellow' } },
      { id: 'clear', name: 'フルクリア', description: 'All Clear', colors: { all: 'clear' } },
      {
        id: 'frost-clear',
        name: 'フルガラスシアン',
        description: 'All Glass Cyan',
        colors: { all: 'frost-clear' },
      },
      {
        id: 'ocean-blue',
        name: 'フルオーシャンブルー',
        description: 'All Ocean Blue',
        colors: { all: 'ocean-blue' },
      },
      {
        id: 'sky-blue',
        name: 'フルスカイブルー',
        description: 'All Sky Blue',
        colors: { all: 'sky-blue' },
      },
      {
        id: 'forest',
        name: 'フルフォレスト',
        description: 'All Forest',
        colors: { all: 'forest' },
      },
      { id: 'lime', name: 'フルライム', description: 'All Lime', colors: { all: 'lime' } },
      { id: 'pink', name: 'フルピンク', description: 'All Pink', colors: { all: 'pink' } },
    ],
    '3dp': [
      {
        id: 'yamikage',
        name: 'YamiKage',
        description: 'All Black',
        colors: { all: 'carbon-black' },
      },
      {
        id: 'kurobeni',
        name: 'KuroBeni',
        description: 'Black & Red',
        colors: { primary: 'carbon-black', secondary: 'crimson-red' },
      },
      {
        id: 'akatsuki',
        name: 'Akatsuki',
        description: 'Black & Dark Orange',
        colors: { primary: 'carbon-black', secondary: 'dark-orange' },
      },
      {
        id: 'shibugaki',
        name: 'ShibuGaki',
        description: 'Black & Light Orange',
        colors: { primary: 'carbon-black', secondary: 'light-orange' },
      },
    ],
  },
};
