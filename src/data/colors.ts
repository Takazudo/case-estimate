import type { Colors } from '../types';

// Helper function to get color opacity by hex value
export const getColorOpacityByValue = (hexValue: string, material: 'acrylic' | '3dp'): number => {
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
export const getColorOpacityById = (colorId: string, material: 'acrylic' | '3dp'): number => {
  const colorList = colors[material];
  const color = colorList.find((c) => c.id === colorId);
  const opacity = color?.opacity ?? 1; // Default to 1 (fully opaque) if not specified
  return opacity;
};

export const colors: Colors = {
  acrylic: [
    { id: 'red', name: 'レッド', value: '#b71c1c', material: 'Red', opacity: 0.8 },
    { id: 'orange', name: 'オレンジ', value: '#ff9800', material: 'Orange', opacity: 0.8 },
    { id: 'yellow', name: 'イエロー', value: '#ffeb3b', material: 'Yellow', opacity: 0.8 },
    { id: 'clear', name: 'クリア', value: '#f8f9fa', material: 'Transparent', opacity: 1 },
    {
      id: 'frost-clear',
      name: 'ガラスシアン',
      value: '#4a9b9b',
      material: 'Glass Cyan',
      opacity: 1,
    },
    {
      id: 'ocean-blue',
      name: 'オーシャンブルー',
      value: '#0d47a1',
      material: 'Deep Blue',
      opacity: 0.8,
    },
    {
      id: 'sky-blue',
      name: 'スカイブルー',
      value: '#42a5f5',
      material: 'Light Blue',
      opacity: 0.8,
    },
    { id: 'forest', name: 'フォレスト', value: '#1b5e20', material: 'Deep Green', opacity: 0.8 },
    { id: 'lime', name: 'ライム', value: '#8bc34a', material: 'Light Green', opacity: 0.8 },
    { id: 'shadow', name: 'シャドー', value: '#616161', material: 'Gray', opacity: 0.8 },
    { id: 'pink', name: 'ピンク', value: '#e91e63', material: 'Pink', opacity: 0.8 },
  ],
  '3dp': [
    {
      id: 'carbon-black',
      name: 'カーボンブラック',
      value: '#212121',
      material: 'PLA-CF',
      opacity: 1,
    },
    { id: 'crimson-red', name: 'クリムゾンレッド', value: '#b71c1c', material: 'PLA', opacity: 1 },
    { id: 'dark-orange', name: 'ダークオレンジ', value: '#e65100', material: 'PLA', opacity: 1 },
    { id: 'light-orange', name: 'ライトオレンジ', value: '#ff8a50', material: 'PLA', opacity: 1 },
    { id: 'deep-yellow', name: 'ディープイエロー', value: '#d4a017', material: 'PLA', opacity: 1 },
    { id: 'gold-yellow', name: 'ゴールドイエロー', value: '#f1c40f', material: 'PLA', opacity: 1 },
    { id: 'clear-blue', name: 'クリアブルー', value: '#0d47a1', material: 'PETG', opacity: 0.6 },
    { id: 'clear-red', name: 'クリアレッド', value: '#b71c1c', material: 'PETG', opacity: 0.6 },
    { id: 'bone-white', name: 'ボーンホワイト', value: '#a59d88', material: 'PLA', opacity: 1 },
  ],
  series: {
    acrylic: [
      { id: 'red', name: 'レッド', description: 'All Red', colors: { all: 'red' } },
      { id: 'orange', name: 'オレンジ', description: 'All Orange', colors: { all: 'orange' } },
      { id: 'yellow', name: 'イエロー', description: 'All Yellow', colors: { all: 'yellow' } },
      { id: 'clear', name: 'クリア', description: 'All Clear', colors: { all: 'clear' } },
      {
        id: 'frost-clear',
        name: 'ガラスシアン',
        description: 'All Glass Cyan',
        colors: { all: 'frost-clear' },
      },
      {
        id: 'ocean-blue',
        name: 'オーシャンブルー',
        description: 'All Ocean Blue',
        colors: { all: 'ocean-blue' },
      },
      {
        id: 'sky-blue',
        name: 'スカイブルー',
        description: 'All Sky Blue',
        colors: { all: 'sky-blue' },
      },
      { id: 'forest', name: 'フォレスト', description: 'All Forest', colors: { all: 'forest' } },
      { id: 'lime', name: 'ライム', description: 'All Lime', colors: { all: 'lime' } },
      { id: 'pink', name: 'ピンク', description: 'All Pink', colors: { all: 'pink' } },
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
