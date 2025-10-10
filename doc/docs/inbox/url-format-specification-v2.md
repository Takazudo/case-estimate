# URL Format Specification (New Format)

## Overview

This document specifies the new URL encoding format for the Takazudo Modular Case Configurator that uses color IDs instead of hex values to avoid ambiguity. This is a breaking change from the previous format.

## URL Structure

### Base Format

```
/m?c={case_code}&p={panel_colors}
```

### Parameters

#### `c` - Case Code (Required)

- Encoded case model identifier
- Format: 1-2 character code
- Examples:
  - `2a` = `zudo-block-40-3DP-A`
  - `7b` = `zudo-block-60x2-ACR-B`
  - `9a` = `10box-shallow-3dp`
  - `9b` = `10box-deep-3dp`

#### `p` - Panel Colors (Optional)

- Encoded panel color configuration
- Format: Dot-separated panel-color pairs
- Structure: `{panel_code}{color_code}.{panel_code}{color_code}...`
- Example: `1cb.2cr.3cb.4rd`

## Encoding Tables

### Case Model Codes

```typescript
const CASE_CODES = {
  'zudo-block-40-3DP-A': '2a',
  'zudo-block-40-3DP-B': '2b',
  'zudo-block-40-ACR-A': '1a',
  'zudo-block-40-ACR-B': '1b',
  'zudo-block-40x2-3DP-A': '6a',
  'zudo-block-40x2-3DP-B': '6b',
  'zudo-block-40x2-ACR-A': '5a',
  'zudo-block-40x2-ACR-B': '5b',
  'zudo-block-60-3DP-A': '4a',
  'zudo-block-60-3DP-B': '4b',
  'zudo-block-60-ACR-A': '3a',
  'zudo-block-60-ACR-B': '3b',
  'zudo-block-60x2-3DP-A': '8a',
  'zudo-block-60x2-3DP-B': '8b',
  'zudo-block-60x2-ACR-A': '7a',
  'zudo-block-60x2-ACR-B': '7b',
  '10box-shallow-3dp': '9a',
  '10box-deep-3dp': '9b'
};
```

### Panel Codes

#### Standard Models (8 panels)

```typescript
const PANEL_CODES_STANDARD = {
  'side1': '1',
  'side2': '2',
  'back1': '3',
  'back2': '4',
  'bottom1': '5',
  'bottom2': '6',
  'front1': '7',
  'front2': '8'
};
```

#### X2 Models (12 panels)

```typescript
const PANEL_CODES_X2 = {
  'side1': '1',
  'side2': '2',
  'side3': '3',
  'side4': '4',
  'back1': '5',
  'back2': '6',
  'bottom1': '7',
  'bottom2': '8',
  'bottom3': '9',
  'bottom4': 'a',
  'front1': 'b',
  'front2': 'c'
};
```

#### 10BOX Model (16 panels)

```typescript
const PANEL_CODES_10BOX = {
  // Main body
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
  // Lid
  'lid-side1': 'l1',
  'lid-side2': 'l2',
  'lid-back': 'l3',
  'lid-top1': 'l4',
  'lid-top2': 'l5',
  'lid-front': 'l6'
};
```

### Color ID Codes

#### Acrylic Colors

```typescript
const COLOR_CODES_ACRYLIC = {
  'clear': 'c',
  'red': 'r',
  'orange': 'o',
  'yellow': 'y',
  'frost-clear': 'fc',
  'ocean-blue': 'ob',
  'sky-blue': 'sb',
  'forest': 'f',
  'lime': 'l',
  'shadow': 's',
  'pink': 'p'
};
```

#### 3D Print Colors

```typescript
const COLOR_CODES_3DP = {
  'carbon-black': 'cb',
  'matte-black': 'mb',
  'crimson-red': 'cr',  // ← Unique code, not 'rd'
  'clear-red': 'rd',    // ← Different from crimson-red
  'dark-orange': 'do',
  'light-orange': 'lo',
  'deep-yellow': 'dy',
  'gold-yellow': 'gy',
  'clear-blue': 'bl',
  'bone-white': 'bw',
  'wood-white': 'ww',
  'indigo-blue': 'ib',
  'red-green-silk': 'rg',
  'green': 'g',
  'silver': 'sv',
  '3dp-pink': 'pk'
};
```

## Examples

### Example 1: Simple Configuration

**URL**: `/m?c=2a&p=1cb.2cb.3cr.4cr.5cb.6cr.7cb.8cr`

**Decoded**:
- Case: `zudo-block-40-3DP-A`
- Colors:
  - side1: carbon-black
  - side2: carbon-black
  - back1: crimson-red
  - back2: crimson-red
  - bottom1: carbon-black
  - bottom2: crimson-red
  - front1: carbon-black
  - front2: crimson-red

### Example 2: X2 Model

**URL**: `/m?c=6a&p=1cb.2cb.3cb.4cb.5cr.6cr.7cb.8cr.9cb.acr.bcb.ccr`

**Decoded**:
- Case: `zudo-block-40x2-3DP-A`
- 12 panels with alternating colors

### Example 3: Series Preset (YamiKage)

**URL**: `/m?c=2a&p=1cb.2cb.3cb.4cb.5cb.6cb.7cb.8cb`

**Decoded**:
- All panels: carbon-black (YamiKage series)

## Encoding Algorithm

```typescript
function encodeUrlV2(state: ConfiguratorState): string {
  const params = new URLSearchParams();

  // Version
  params.set('v', '2');

  // Case
  params.set('c', CASE_CODES[state.selectedCase]);

  // Panel colors (using IDs, not hex values)
  const colorPairs = Object.entries(state.panelColorIds)
    .map(([panelId, colorId]) => {
      const panelCode = getPanelCode(panelId, state.selectedCase);
      const colorCode = COLOR_CODES[colorId];
      return `${panelCode}${colorCode}`;
    })
    .join('.');

  if (colorPairs) {
    params.set('p', colorPairs);
  }

  return `/m?${params.toString()}`;
}
```

## Decoding Algorithm

```typescript
function decodeUrlV2(urlString: string): ConfiguratorState {
  const url = new URL(urlString, window.location.origin);
  const params = url.searchParams;

  // Check version
  const version = params.get('v');
  if (version !== '2') {
    return decodeLegacyUrl(urlString);
  }

  // Decode case
  const caseCode = params.get('c');
  const selectedCase = CASE_CODES_REVERSE[caseCode];

  // Decode panel colors
  const panelColorIds = {};
  const colorString = params.get('p');

  if (colorString) {
    const pairs = colorString.split('.');
    for (const pair of pairs) {
      const { panelCode, colorCode } = parsePair(pair);
      const panelId = PANEL_CODES_REVERSE[panelCode];
      const colorId = COLOR_CODES_REVERSE[colorCode];
      panelColorIds[panelId] = colorId;
    }
  }

  return {
    selectedCase,
    panelColorIds
  };
}
```

## Validation Rules

1. **Version**: Must be "2" for this format
2. **Case Code**: Must be valid code from CASE_CODES
3. **Panel Codes**: Must match the selected case's panel structure
4. **Color Codes**: Must be valid for the case material (acrylic/3dp)
5. **Completeness**: Not required - missing panels use defaults

## Error Handling

### Invalid Version

- Fall back to legacy decoder for v1 or missing version
- Log warning for unknown versions

### Invalid Case

- Default to first available case
- Show error message to user

### Invalid Panel/Color

- Skip invalid pairs
- Use default color for panel
- Log warning in console

### Malformed URL

- Gracefully degrade to default configuration
- Preserve any valid parameters

## Migration from v1

### Detection

```typescript
function isV1Url(params: URLSearchParams): boolean {
  return !params.has('v') || params.get('v') === '1';
}
```

### Conversion

```typescript
function migrateV1ToV2(v1State): v2State {
  // Convert hex values to color IDs
  // Handle ambiguous cases with user prompt if needed
  // Return v2 compatible state
}
```

## Benefits Over v1

1. **Unambiguous**: Each color has unique ID regardless of hex value
2. **Opacity Preservation**: Semi-transparent colors (clear-red) maintain their opacity after reload
3. **Compact**: Same or better compression than v1
4. **Extensible**: Easy to add new colors without conflicts
5. **Clear Intent**: URL represents user's actual selection, not derived values
6. **Debuggable**: Easy to read and understand the URL

### Critical Issue Resolved

The v1 format had a critical bug where colors with identical hex values but different opacity would lose their transparency on reload:

- **v1 Problem**: `clear-red` (semi-transparent, #b71c1c) → URL → reload → `crimson-red` (opaque, #b71c1c)
- **v2 Solution**: `clear-red` → `rd` in URL → reload → `clear-red` (opacity preserved)

## Implementation Checklist

- [ ] Update URL encoder to use color IDs
- [ ] Update URL decoder to return color IDs
- [ ] Add version parameter handling
- [ ] Implement v1 migration logic
- [ ] Update configurator state management
- [ ] Add comprehensive tests
- [ ] Document breaking changes
- [ ] Plan rollout strategy