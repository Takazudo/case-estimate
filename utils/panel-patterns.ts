export const PANEL_PATTERN_DEFINITIONS = {
  'pattern-red-green-stripe': {
    baseColor: '#a4534a',
    accentColor: '#7bc97d',
    patternSize: 8,
    stripeWidth: 4,
    rotation: 45,
    svgId: 'red-green-stripe-pattern',
  },
} as const;

export type PanelPatternKey = keyof typeof PANEL_PATTERN_DEFINITIONS;

export const isPanelPattern = (value?: string): value is PanelPatternKey =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(PANEL_PATTERN_DEFINITIONS, value);

export const getPanelPatternDefinition = (pattern: PanelPatternKey) =>
  PANEL_PATTERN_DEFINITIONS[pattern];

export const getPanelPatternFallbackColor = (pattern: PanelPatternKey) =>
  PANEL_PATTERN_DEFINITIONS[pattern].baseColor;
