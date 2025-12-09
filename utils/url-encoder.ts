// URL parameter encoding/decoding with short codes
import { colorService } from './color-service';

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
  '10box-shallow-3dp': '9a',
  '10box-deep-3dp': '9b',
  '5box-shallow-3dp': 'fa',
  '5box-deep-3dp': 'fb',
  'zudo-block-60-open-ACR-A': 'oa',
  'zudo-block-60-open-ACR-B': 'ob',
  'zudo-block-60-open-upgrade-ACR': 'ou',
  'zudo-block-60-open-3DP-A': 'pa',
  'zudo-block-60-open-3DP-B': 'pb',
  'zudo-block-60-open-upgrade-3DP': 'pu',
  'zudo-stand-40': 's4',
  'zudo-stand-40x2': 's8',
  'zudo-stand-60': 's6',
  'zudo-stand-60x2': 'sc',
};

// Build reverse map
const CASE_REVERSE_MAP: { [key: string]: string } = Object.entries(CASE_MAP).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {} as { [key: string]: string },
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
  'main-stand1': 'm9', // DEPRECATED: kept for backward compatibility
  'main-stand2': 'ma', // DEPRECATED: kept for backward compatibility
  // 10BOX stand panels (use 's' prefix for stand)
  'stand-angle1': 'sa1',
  'stand-angle2': 'sa2',
  'stand-support1': 'ss1',
  'stand-support2': 'ss2',
  // 10BOX lid panels (use 'l' prefix)
  'lid-side1': 'l1',
  'lid-side2': 'l2',
  'lid-back': 'l3',
  'lid-top1': 'l4',
  'lid-top2': 'l5',
  'lid-front': 'l6',
  // 5BOX additional lid panels (lid-back1, lid-back2)
  'lid-back1': 'l7',
  'lid-back2': 'l8',
  // zudo-block-60-open upgrade panels (use 't' prefix for top)
  top1: 't1',
  top2: 't2',
  // zudo-stand panels
  angle1: 'n1',
  angle2: 'n2',
  support1: 'p1',
  support2: 'p2',
};

const PANEL_REVERSE_MAP: { [key: string]: string } = Object.entries(PANEL_MAP).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {} as { [key: string]: string },
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
  'bone-white': 'bw',
  'clear-blue': 'bl',
  'clear-red': 'rd',
  'crimson-red': 'cr',
  'dark-orange': 'do',
  'light-orange': 'lo',
  'deep-yellow': 'dy',
  'bright-gold': 'bg',
  'deep-gold': 'dg',
  'indigo-blue': 'ib',
  'red-green-silk': 'rg',
  green: 'g',
  'silver-gray': 'sg',
  'silver-white': 'sw',
  '3dp-pink': 'pk',
  caramel: 'ca',
};

const COLOR_REVERSE_MAP: { [key: string]: string } = Object.entries(COLOR_MAP).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {} as { [key: string]: string },
);

// Encode panel colors to a compact string (now accepts color IDs directly)
export function encodePanelColors(
  panelColorIds: { [key: string]: string }, // Now accepts color IDs instead of hex values
): string {
  const encoded: string[] = [];

  Object.entries(panelColorIds).forEach(([panelId, colorId]) => {
    const panelCode = PANEL_MAP[panelId];
    const colorCode = COLOR_MAP[colorId];

    if (panelCode && colorCode) {
      encoded.push(`${panelCode}${colorCode}`);
    }
  });

  return encoded.join('.');
}

// Decode panel colors from compact string (now returns color IDs directly)
export function decodePanelColors(encoded: string): { [key: string]: string } {
  if (!encoded) return {};

  const panelColorIds: { [key: string]: string } = {};
  const parts = encoded.split('.');

  parts.forEach((part) => {
    // Determine panel code length based on first character(s)
    // 10BOX stand panels start with 'sa' or 'ss' and use 3-char codes
    // 10BOX panels start with 'm' or 'l' and use 2-char codes
    // Open upgrade panels start with 't' and use 2-char codes
    // Stand panels start with 'n' or 'p' and use 2-char codes
    // x2 model panels can use 'a', 'b', 'c' single chars
    // Regular panels use single digit chars
    let panelCodeLength = 1;
    if (part.startsWith('sa') || part.startsWith('ss')) {
      panelCodeLength = 3; // 10BOX stand panels (stand-angle1, stand-support1, etc.)
    } else if (
      part[0] === 'm' ||
      part[0] === 'l' ||
      part[0] === 't' ||
      part[0] === 'n' ||
      part[0] === 'p'
    ) {
      panelCodeLength = 2; // 10BOX, open upgrade, or stand panels
    }

    const panelCode = part.slice(0, panelCodeLength);
    const panelId = PANEL_REVERSE_MAP[panelCode];

    if (panelId) {
      // Extract color code (remaining chars after panel code)
      const colorCode = part.slice(panelCodeLength);
      const colorId = COLOR_REVERSE_MAP[colorCode];

      if (colorId) {
        panelColorIds[panelId] = colorId;
      }
    }
  });

  return panelColorIds;
}

// Encode case type
export function encodeCase(caseType: string): string {
  return CASE_MAP[caseType] || caseType;
}

// Decode case type
export function decodeCase(encoded: string): string | null {
  return CASE_REVERSE_MAP[encoded] || null;
}

// Re-export color service functions for backward compatibility
// These are now handled by the centralized color service
/**
 * @deprecated Use colorService.createColorIdMap() instead
 */
export function createColorIdMap(): { [colorValue: string]: string } {
  return colorService.createColorIdMap();
}

/**
 * @deprecated Use colorService.createColorValueMap() instead
 */
export function createColorValueMap(): { [colorId: string]: string } {
  return colorService.createColorValueMap();
}
