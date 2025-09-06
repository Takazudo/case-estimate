// URL parameter encoding/decoding with short codes

// Case model mappings (1-2 chars)
const CASE_MAP: { [key: string]: string } = {
  'zudo-block-40': '1',
  'zudo-block-40-lite': '2',
  'zudo-block-60': '3',
  'zudo-block-60-lite': '4',
};

const CASE_REVERSE_MAP: { [key: string]: string } = Object.entries(CASE_MAP).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {},
);

// Panel ID mappings (single char)
const PANEL_MAP: { [key: string]: string } = {
  side1: '1',
  side2: '2',
  front1: '3',
  front2: '4',
  bottom1: '5',
  bottom2: '6',
  back1: '7',
  back2: '8',
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
    // Extract panel code (first char)
    const panelCode = part[0];
    const panelId = PANEL_REVERSE_MAP[panelCode];

    if (panelId) {
      // Extract color code (remaining chars)
      const colorCode = part.slice(1);
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
export function createColorIdMap(colors: any): { [colorValue: string]: string } {
  const map: { [colorValue: string]: string } = {};

  ['acrylic', '3dp'].forEach((material) => {
    if (colors[material]) {
      colors[material].forEach((color: any) => {
        map[color.value] = color.id;
      });
    }
  });

  return map;
}

// Create color ID to value reverse mapping
export function createColorValueMap(colors: any): { [colorId: string]: string } {
  const map: { [colorId: string]: string } = {};

  ['acrylic', '3dp'].forEach((material) => {
    if (colors[material]) {
      colors[material].forEach((color: any) => {
        map[color.id] = color.value;
      });
    }
  });

  return map;
}
