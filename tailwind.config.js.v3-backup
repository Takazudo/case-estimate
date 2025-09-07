/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

// prepare spacing values for Tailwind
const spacingConfig = {
  0: '0',
  '1px': 'var(--zd-spacing-1px)',

  'hgap-2xs': 'var(--zd-spacing-hgap-2xs)',
  'hgap-xs': 'var(--zd-spacing-hgap-xs)',
  'hgap-sm': 'var(--zd-spacing-hgap-sm)',
  'hgap-md': 'var(--zd-spacing-hgap-md)',
  'hgap-md-x2': 'var(--zd-spacing-hgap-md-x2)',
  'hgap-lg': 'var(--zd-spacing-hgap-lg)',
  'hgap-lg-x2': 'var(--zd-spacing-hgap-lg-x2)',
  'hgap-xl': 'var(--zd-spacing-hgap-xl)',
  'hgap-2xl': 'var(--zd-spacing-hgap-2xl)',

  'vgap-2xs': 'var(--zd-spacing-vgap-2xs)',
  'vgap-xs': 'var(--zd-spacing-vgap-xs)',
  'vgap-sm': 'var(--zd-spacing-vgap-sm)',
  'vgap-md': 'var(--zd-spacing-vgap-md)',
  'vgap-lg': 'var(--zd-spacing-vgap-lg)',
  'vgap-xl': 'var(--zd-spacing-vgap-xl)',
  'vgap-2xl': 'var(--zd-spacing-vgap-2xl)',
};

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx,mjs}', './*.js', './index.html'],
  theme: {
    spacing: spacingConfig,
    extend: {
      colors: {
        //debug: "transparent",
        debug: '#ff0000',
        'zd-black': 'var(--zd-color-black)',
        'zd-white': 'var(--zd-color-white)',
        'zd-link': 'var(--zd-color-link)',
        'zd-active': 'var(--zd-color-active)',
        'zd-gray': 'var(--zd-color-gray)',
        'zd-gray2': 'var(--zd-color-gray2)',
        'zd-notify': 'var(--zd-color-notify)',
        'zd-error': 'var(--zd-color-error)',
        'zd-price': 'var(--zd-color-price)',
      },
      screens: {
        sm: '580px',
        md: '740px',
        lg: '980px',
        xl: '1280px',
        '2xl': '1630px',
        '3xl': '1800px',
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0px',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        5: '5px',
        10: '10px',
      },
      fontFamily: {
        futura: ['Futura', 'Century Gothic', 'sans-serif'],
        sans: ['Helvetica', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        xs: ['var(--zd-font-xs-size)', { lineHeight: 'var(--zd-font-xs-lineHeight)' }],
        sm: ['var(--zd-font-sm-size)', { lineHeight: 'var(--zd-font-sm-lineHeight)' }],
        base: ['var(--zd-font-base-size)', { lineHeight: 'var(--zd-font-base-lineHeight)' }],
        lg: ['var(--zd-font-lg-size)', { lineHeight: 'var(--zd-font-lg-lineHeight)' }],
        xl: ['var(--zd-font-xl-size)', { lineHeight: 'var(--zd-font-xl-lineHeight)' }],
        '2xl': ['var(--zd-font-2xl-size)', { lineHeight: 'var(--zd-font-2xl-lineHeight)' }],
        '3xl': ['var(--zd-font-3xl-size)', { lineHeight: 'var(--zd-font-3xl-lineHeight)' }],
        '4xl': ['var(--zd-font-4xl-size)', { lineHeight: 'var(--zd-font-4xl-lineHeight)' }],
        '5xl': ['var(--zd-font-5xl-size)', { lineHeight: 'var(--zd-font-5xl-lineHeight)' }],
      },
      lineHeight: {
        none: 'var(--zd-lineHeight-none)',
        tight: 'var(--zd-lineHeight-tight)',
        snug: 'var(--zd-lineHeight-snug)',
        normal: 'var(--zd-lineHeight-normal)',
        relaxed: 'var(--zd-lineHeight-relaxed)',
        loose: 'var(--zd-lineHeight-loose)',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.clearfix': {
          '::after': {
            content: '""',
            clear: 'both',
            display: 'table',
          },
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
