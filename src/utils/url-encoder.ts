// URL parameter encoding/decoding with short codes
import type { Colors, Color } from '../types';

// Case model mappings (1-2 chars)
const CASE_MAP: { [key: string]: string } = {
  'zudo-block-40-ACR-A': '1a',
  'zudo-block-40-ACR-B': '1b',
  'zudo-block-40-3DP-A': '2a',
  'zudo-block-40-3DP-B': '2b',
  'zudo-block-60-ACR-A': '3a',
  'zudo-block-60-ACR-B': '3b',
  'zudo-block-60-3DP-A': '4a',
  'zudo-block-60-3DP-B': '4b',
  'zudo-block-40x2-ACR-A': '5a',
  'zudo-block-40x2-ACR-B': '5b',
  'zudo-block-40x2-3DP-A': '6a',
  'zudo-block-40x2-3DP-B': '6b',
  'zudo-block-60x2-ACR-A': '7a',
  'zudo-block-60x2-ACR-B': '7b',
  'zudo-block-60x2-3DP-A': '8a',
  'zudo-block-60x2-3DP-B': '8b',
  '10box-lite': '9',
  // Legacy mappings for backward compatibility
  'zudo-block-40-type-a': '1a',
  'zudo-block-40-type-b': '1b',
  'zudo-block-40-lite-type-a': '2a',
  'zudo-block-40-lite-type-b': '2b',
  'zudo-block-60-type-a': '3a',
  'zudo-block-60-type-b': '3b',
  'zudo-block-60-lite-type-a': '4a',
  'zudo-block-60-lite-type-b': '4b',
  'zudo-block-40x2-type-a': '5a',
  'zudo-block-40x2-type-b': '5b',
  'zudo-block-40x2-lite-type-a': '6a',
  'zudo-block-40x2-lite-type-b': '6b',
  'zudo-block-60x2-type-a': '7a',
  'zudo-block-60x2-type-b': '7b',
  'zudo-block-60x2-lite-type-a': '8a',
  'zudo-block-60x2-lite-type-b': '8b',
  'zudo-block-40': '1',
  'zudo-block-40-lite': '2',
  'zudo-block-60': '3',
  'zudo-block-60-lite': '4',
};

const CASE_REVERSE_MAP: { [key: string]: string } = Object.entries(CASE_MAP).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {},
);

// Panel ID mappings (1-2 chars for compactness)
const PANEL_MAP: { [key: string]: string } = {
  // Standard panel IDs (single char)
  side1: '1',
  side2: '2',
  front1: '3',
  front2: '4',
  bottom1: '5',
  bottom2: '6',
  back1: '7',
  back2: '8',
  // x2 model additional panels
  side3: '9',
  side4: 'a',
  bottom3: 'b',
  bottom4: 'c',
  // 10BOX main panels (use 'm' prefix)
  'main-side1': 'm1',
  'main-side2': 'm2',
  'main-side3': 'm3',
  'main-side4': 'm4',
  'main-back1': 'm5',
  'main-bottom1': 'm6',
  'main-bottom2': 'm7',
  'main-front': 'm8',
  'main-stand1': 'm9',
  'main-stand2': 'ma',
  // 10BOX lid panels (use 'l' prefix)
  'lid-side1': 'l1',
  'lid-side2': 'l2',
  'lid-back': 'l3',
  'lid-top1': 'l4',
  'lid-top2': 'l5',
  'lid-front': 'l6',
};

const PANEL_REVERSE_MAP: { [key: string]: string } = Object.entries(PANEL_MAP).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {},
);

// Color ID mappings (single char for common colors, 2 chars for others)
const COLOR_MAP: { [key: string]: string } = {
  // Acrylic colors
  red: 'r',
  orange: 'o',
  yellow: 'y',
  clear: 'c',
  'frost-clear': 'fc',
  'ocean-blue': 'ob',
  'sky-blue': 'sb',
  forest: 'f',
  lime: 'l',
  shadow: 's',
  pink: 'p',

  // 3DP colors
  'carbon-black': 'cb',
  'matte-black': 'mb',
  'crimson-red': 'cr',
  'dark-orange': 'do',
  'light-orange': 'lo',
  'deep-yellow': 'dy',
  'gold-yellow': 'gy',
  'clear-blue': 'bl',
  'clear-red': 'rd',
  'bone-white': 'bw',
};

const COLOR_REVERSE_MAP: { [key: string]: string } = Object.entries(COLOR_MAP).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {},
);

// Encode panel colors to a compact string
export function encodePanelColors(
  panelColors: { [key: string]: string },
  colorIdMap: { [colorValue: string]: string },
): string {
  const encoded: string[] = [];

  Object.entries(panelColors).forEach(([panelId, colorValue]) => {
    const panelCode = PANEL_MAP[panelId];
    const colorId = colorIdMap[colorValue];
    const colorCode = COLOR_MAP[colorId];

    if (panelCode && colorCode) {
      encoded.push(`${panelCode}${colorCode}`);
    }
  });

  return encoded.join('.');
}

// Decode panel colors from compact string
export function decodePanelColors(
  encoded: string,
  colorValueMap: { [colorId: string]: string },
): { [key: string]: string } {
  if (!encoded) return {};

  const panelColors: { [key: string]: string } = {};
  const parts = encoded.split('.');

  parts.forEach((part) => {
    // Determine panel code length based on first character
    // 10BOX panels start with 'm' or 'l' and use 2-char codes
    // x2 model panels can use 'a', 'b', 'c' single chars
    // Regular panels use single digit chars
    let panelCodeLength = 1;
    if (part[0] === 'm' || part[0] === 'l') {
      panelCodeLength = 2; // 10BOX panels
    }

    const panelCode = part.slice(0, panelCodeLength);
    const panelId = PANEL_REVERSE_MAP[panelCode];

    if (panelId) {
      // Extract color code (remaining chars after panel code)
      const colorCode = part.slice(panelCodeLength);
      const colorId = COLOR_REVERSE_MAP[colorCode];
      const colorValue = colorValueMap[colorId];

      if (colorValue) {
        panelColors[panelId] = colorValue;
      }
    }
  });

  return panelColors;
}

// Encode case type
export function encodeCase(caseType: string): string {
  return CASE_MAP[caseType] || caseType;
}

// Decode case type
export function decodeCase(encoded: string): string | null {
  return CASE_REVERSE_MAP[encoded] || null;
}

// Create color ID to value mapping from color data
export function createColorIdMap(colors: Colors): { [colorValue: string]: string } {
  const map: { [colorValue: string]: string } = {};

  const materials: Array<'acrylic' | '3dp'> = ['acrylic', '3dp'];
  materials.forEach((material) => {
    if (colors[material]) {
      colors[material].forEach((color: Color) => {
        map[color.value] = color.id;
      });
    }
  });

  return map;
}

// Create color ID to value reverse mapping
export function createColorValueMap(colors: Colors): { [colorId: string]: string } {
  const map: { [colorId: string]: string } = {};

  const materials: Array<'acrylic' | '3dp'> = ['acrylic', '3dp'];
  materials.forEach((material) => {
    if (colors[material]) {
      colors[material].forEach((color: Color) => {
        map[color.id] = color.value;
      });
    }
  });

  return map;
}
