/**
 * Test helper: Color code to hex value mappings
 * Used for e2e tests to verify panel colors match URL parameters
 */

/**
 * Maps color IDs to their expected hex values
 * These should match the definitions in data/colors.ts
 */
export const COLOR_ID_TO_HEX: { [key: string]: string } = {
  // Acrylic colors
  red: '#5e0007',
  orange: '#d14600',
  yellow: '#dda300',
  clear: '#f8f9fa',
  'frost-clear': '#4a9b9b',
  'ocean-blue': '#0d47a1',
  'sky-blue': '#4497aa',
  forest: '#1b5e20',
  lime: '#8bc34a',
  shadow: '#616161',
  pink: '#e91e63',

  // 3DP colors
  'carbon-black': '#212121',
  'bone-white': '#a59d88',
  'clear-blue': '#0d47a1',
  'clear-red': '#b71c1c',
  'crimson-red': '#b71c1c',
  'dark-orange': '#e65100',
  'light-orange': '#ff8a50',
  'deep-yellow': '#d4a017',
  'bright-gold': '#f1c40f',
  'deep-gold': '#ff9900',
  'indigo-blue': '#172854',
  'red-green-silk': 'pattern-red-green-stripe', // Special pattern fill
  green: '#2d5d2d',
  'silver-gray': '#9ca3af',
  'silver-white': '#dfe0dd',
  '3dp-pink': '#d4a5b0',
  caramel: '#ab461e',
};

/**
 * Maps color codes (from URL) to color IDs
 * These should match the definitions in utils/url-encoder.ts
 */
export const COLOR_CODE_TO_ID: { [key: string]: string } = {
  // Acrylic colors
  r: 'red',
  o: 'orange',
  y: 'yellow',
  c: 'clear',
  fc: 'frost-clear',
  ob: 'ocean-blue',
  sb: 'sky-blue',
  f: 'forest',
  l: 'lime',
  s: 'shadow',
  p: 'pink',

  // 3DP colors
  cb: 'carbon-black',
  bw: 'bone-white',
  bl: 'clear-blue',
  rd: 'clear-red',
  cr: 'crimson-red',
  do: 'dark-orange',
  lo: 'light-orange',
  dy: 'deep-yellow',
  bg: 'bright-gold',
  dg: 'deep-gold',
  ib: 'indigo-blue',
  rg: 'red-green-silk',
  g: 'green',
  sg: 'silver-gray',
  sw: 'silver-white',
  pk: '3dp-pink',
  ca: 'caramel',
};

/**
 * Get the expected hex value for a color code
 * @param colorCode - The 1-2 character color code from URL (e.g., 'cb', 'cr')
 * @returns The expected hex value or pattern name
 */
export function getExpectedColorValue(colorCode: string): string | null {
  const colorId = COLOR_CODE_TO_ID[colorCode];
  if (!colorId) return null;
  return COLOR_ID_TO_HEX[colorId] || null;
}

/**
 * Convert RGB string to hex format for comparison
 * Handles both rgb() and rgba() formats
 * @param rgb - RGB string like 'rgb(33, 33, 33)' or 'rgba(33, 33, 33, 1)'
 * @returns Hex string like '#212121'
 */
export function rgbToHex(rgb: string): string {
  // Handle pattern fills
  if (rgb.includes('url(') || rgb === 'pattern-red-green-stripe') {
    return 'pattern-red-green-stripe';
  }

  // Extract RGB values
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  // Convert to hex
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Compare two color values, accounting for different formats
 * @param actual - Actual color value (hex or rgb)
 * @param expected - Expected color value (hex or pattern)
 * @returns true if colors match
 */
export function colorsMatch(actual: string, expected: string): boolean {
  // Handle pattern fills
  if (expected === 'pattern-red-green-stripe') {
    return actual.includes('url(#red-green-stripe-pattern)') || actual === expected;
  }

  // Convert RGB to hex if needed
  const actualHex = actual.startsWith('rgb') ? rgbToHex(actual) : actual.toLowerCase();
  const expectedHex = expected.toLowerCase();

  return actualHex === expectedHex;
}
