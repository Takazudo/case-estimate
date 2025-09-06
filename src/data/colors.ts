import type { Colors } from '../types';

export const colors: Colors = {
  acrylic: [
    { id: 'clear', name: 'クリア', value: '#f8f9fa', material: 'Transparent' },
    { id: 'frost-clear', name: 'フロストクリア', value: '#e3f2fd', material: 'Glass Cyan' },
    { id: 'ocean-blue', name: 'オーシャンブルー', value: '#0d47a1', material: 'Deep Blue' },
    { id: 'sky-blue', name: 'スカイブルー', value: '#42a5f5', material: 'Light Blue' },
    { id: 'forest', name: 'フォレスト', value: '#1b5e20', material: 'Deep Green' },
    { id: 'lime', name: 'ライム', value: '#8bc34a', material: 'Light Green' },
    { id: 'yellow', name: 'イエロー', value: '#ffeb3b', material: 'Yellow' },
    { id: 'red', name: 'レッド', value: '#f44336', material: 'Red' },
    { id: 'orange', name: 'オレンジ', value: '#ff9800', material: 'Orange' },
    { id: 'shadow', name: 'シャドー', value: '#616161', material: 'Gray' },
    { id: 'pink', name: 'ピンク', value: '#e91e63', material: 'Pink' },
  ],
  '3dp': [
    { id: 'carbon-black', name: 'カーボンブラック', value: '#212121', material: 'PLA-CF' },
    { id: 'matte-black', name: 'マットブラック', value: '#424242', material: 'PLA' },
    { id: 'crimson-red', name: 'クリムゾンレッド', value: '#b71c1c', material: 'PLA' },
    { id: 'dark-orange', name: 'ダークオレンジ', value: '#e65100', material: 'PLA' },
    { id: 'light-orange', name: 'ライトオレンジ', value: '#ff8a50', material: 'PLA' },
    { id: 'deep-yellow', name: 'ディープイエロー', value: '#d4a017', material: 'PLA' },
    { id: 'gold-yellow', name: 'ゴールドイエロー', value: '#f1c40f', material: 'PLA' },
    { id: 'clear-blue', name: 'クリアブルー', value: '#81d4fa', material: 'PETG' },
    { id: 'clear-red', name: 'クリアレッド', value: '#ff8a80', material: 'PETG' },
    { id: 'bone-white', name: 'ボーンホワイト', value: '#f5f5dc', material: 'PLA' },
  ],
  presets: {
    '3dp': [
      { id: 'yamikage', name: 'YamiKage (All Black)', colors: { all: 'matte-black' } },
      {
        id: 'kurobeni',
        name: 'KuroBeni (Black & Red)',
        colors: { primary: 'matte-black', secondary: 'crimson-red' },
      },
      {
        id: 'akatsuki',
        name: 'Akatsuki (Black & Dark Orange)',
        colors: { primary: 'matte-black', secondary: 'dark-orange' },
      },
      {
        id: 'shibugaki',
        name: 'ShibuGaki (Black & Light Orange)',
        colors: { primary: 'matte-black', secondary: 'light-orange' },
      },
    ],
  },
};
