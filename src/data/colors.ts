import type { Colors } from '../types';

export const colors: Colors = {
  acrylic: [
    { id: 'red', name: 'レッド', value: '#b71c1c', material: 'Red' },
    { id: 'orange', name: 'オレンジ', value: '#ff9800', material: 'Orange' },
    { id: 'yellow', name: 'イエロー', value: '#ffeb3b', material: 'Yellow' },
    { id: 'clear', name: 'クリア', value: '#f8f9fa', material: 'Transparent' },
    { id: 'frost-clear', name: 'ガラスシアン', value: '#4a9b9b', material: 'Glass Cyan' },
    { id: 'ocean-blue', name: 'オーシャンブルー', value: '#0d47a1', material: 'Deep Blue' },
    { id: 'sky-blue', name: 'スカイブルー', value: '#42a5f5', material: 'Light Blue' },
    { id: 'forest', name: 'フォレスト', value: '#1b5e20', material: 'Deep Green' },
    { id: 'lime', name: 'ライム', value: '#8bc34a', material: 'Light Green' },
    { id: 'shadow', name: 'シャドー', value: '#616161', material: 'Gray' },
    { id: 'pink', name: 'ピンク', value: '#e91e63', material: 'Pink' },
  ],
  '3dp': [
    { id: 'carbon-black', name: 'カーボンブラック', value: '#212121', material: 'PLA-CF' },
    { id: 'crimson-red', name: 'クリムゾンレッド', value: '#b71c1c', material: 'PLA' },
    { id: 'dark-orange', name: 'ダークオレンジ', value: '#e65100', material: 'PLA' },
    { id: 'light-orange', name: 'ライトオレンジ', value: '#ff8a50', material: 'PLA' },
    { id: 'deep-yellow', name: 'ディープイエロー', value: '#d4a017', material: 'PLA' },
    { id: 'gold-yellow', name: 'ゴールドイエロー', value: '#f1c40f', material: 'PLA' },
    //{ id: 'clear-blue', name: 'クリアブルー', value: '#87ceeb', material: 'PETG' }, // sold out
    { id: 'clear-red', name: 'クリアレッド', value: '#ff6b6b', material: 'PETG' },
    { id: 'bone-white', name: 'ボーンホワイト', value: '#a59d88', material: 'PLA' },
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
