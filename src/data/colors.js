export const colors = {
  acrylic: [
    { id: 'red', name: 'Red', value: '#dc2626' },
    { id: 'orange', name: 'Orange', value: '#ea580c' },
    { id: 'green', name: 'Green', value: '#16a34a' },
  ],
  '3d-printed': [
    { id: 'black', name: 'Black', value: '#1f2937' },
    { id: 'red', name: 'Red', value: '#dc2626' },
    { id: 'dark-orange', name: 'Dark Orange', value: '#c2410c' },
    { id: 'bright-orange', name: 'Bright Orange', value: '#fb923c' },
  ],
  presets: {
    '3d-printed': [
      { id: 'yamikage', name: 'YamiKage (All Black)', colors: { all: 'black' } },
      {
        id: 'kurobeni',
        name: 'KuroBeni (Black & Red)',
        colors: { primary: 'black', secondary: 'red' },
      },
      {
        id: 'akatsuki',
        name: 'Akatsuki (Black & Dark Orange)',
        colors: { primary: 'black', secondary: 'dark-orange' },
      },
      {
        id: 'shibugaki',
        name: 'ShibuGaki (Black & Bright Orange)',
        colors: { primary: 'black', secondary: 'bright-orange' },
      },
    ],
  },
};
