# URL Format Specification

## Overview

This document describes the URL encoding format used by the Takazudo Modular Case Configurator. The system encodes case configurations (model selection and panel colors) into compact, shareable URLs using short codes.

The encoding uses **color IDs** as the source of truth, ensuring that colors with identical hex values but different properties (like opacity) are correctly preserved through URL sharing and page reloads.

## URL Structure

### Base Format

```
/m?c={case_code}&p={panel_colors}
```

### Parameters

#### `c` - Case Code (Required)

Encoded case model identifier using 1-2 character codes.

**Examples:**

- `2a` → `zudo-block-40-3DP-A`
- `7b` → `zudo-block-60x2-ACR-B`
- `9a` → `10box-shallow-3dp`
- `oa` → `zudo-block-60-open-ACR-A`

#### `p` - Panel Colors (Optional)

Encoded panel color configuration as dot-separated panel-color pairs.

**Format:** `{panel_code}{color_code}.{panel_code}{color_code}...`

**Example:** `1cb.2cr.3cb.4rd`

## Encoding Tables

### Case Model Codes

```typescript
const CASE_CODES = {
  // 40HP Models
  'zudo-block-40-ACR-A': '1a',
  'zudo-block-40-ACR-B': '1b',
  'zudo-block-40-3DP-A': '2a',
  'zudo-block-40-3DP-B': '2b',

  // 60HP Models
  'zudo-block-60-ACR-A': '3a',
  'zudo-block-60-ACR-B': '3b',
  'zudo-block-60-3DP-A': '4a',
  'zudo-block-60-3DP-B': '4b',

  // 80HP (40x2) Models
  'zudo-block-40x2-ACR-A': '5a',
  'zudo-block-40x2-ACR-B': '5b',
  'zudo-block-40x2-3DP-A': '6a',
  'zudo-block-40x2-3DP-B': '6b',

  // 120HP (60x2) Models
  'zudo-block-60x2-ACR-A': '7a',
  'zudo-block-60x2-ACR-B': '7b',
  'zudo-block-60x2-3DP-A': '8a',
  'zudo-block-60x2-3DP-B': '8b',

  // 10BOX Models (104HP)
  '10box-shallow-3dp': '9a',
  '10box-deep-3dp': '9b',

  // 5BOX Models (60HP)
  '5box-shallow-3dp': 'fa',
  '5box-deep-3dp': 'fb',

  // Open Frame Models (60HP)
  'zudo-block-60-open-ACR-A': 'oa',
  'zudo-block-60-open-ACR-B': 'ob',
  'zudo-block-60-open-upgrade-ACR': 'ou',
  'zudo-block-60-open-3DP-A': 'pa',
  'zudo-block-60-open-3DP-B': 'pb',
  'zudo-block-60-open-upgrade-3DP': 'pu',

  // Stand Models (3DP only)
  'zudo-stand-40': 's4',    // 40HP stand
  'zudo-stand-40x2': 's8',  // 80HP stand
  'zudo-stand-60': 's6',    // 60HP stand
  'zudo-stand-60x2': 'sc',  // 120HP stand
};
```

### Panel Codes

Panel codes vary by model type. The encoding uses 1-2 character codes depending on the model.

#### Standard Models (8 panels)

Applies to: 40HP, 60HP, 40x2, 60x2 models

```typescript
const PANEL_CODES_STANDARD = {
  side1: '1',
  side2: '2',
  front1: '3',
  front2: '4',
  bottom1: '5',
  bottom2: '6',
  back1: '7',
  back2: '8',
};
```

#### X2 Models (12 panels)

Applies to: 40x2, 60x2 models

```typescript
const PANEL_CODES_X2 = {
  // Standard panels
  side1: '1',
  side2: '2',
  front1: '3',
  front2: '4',
  bottom1: '5',
  bottom2: '6',
  back1: '7',
  back2: '8',
  // Additional x2 panels
  side3: '9',
  side4: 'a',
  bottom3: 'b',
  bottom4: 'c',
};
```

#### 10BOX Models (16 panels)

Applies to: 10box-shallow-3dp, 10box-deep-3dp

```typescript
const PANEL_CODES_10BOX = {
  // Main body (use 'm' prefix)
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

  // Lid (use 'l' prefix)
  'lid-side1': 'l1',
  'lid-side2': 'l2',
  'lid-back': 'l3',
  'lid-top1': 'l4',
  'lid-top2': 'l5',
  'lid-front': 'l6',
};
```

#### 5BOX Models (11 panels)

Applies to: 5box-shallow-3dp, 5box-deep-3dp

```typescript
const PANEL_CODES_5BOX = {
  // Main body (use 'm' prefix)
  'main-side1': 'm1',     // メイン: サイド1
  'main-side2': 'm2',     // メイン: バック
  'main-back1': 'm5',     // メイン: ボトム
  'main-bottom1': 'm6',   // メイン: フロント
  'main-bottom2': 'm7',   // メイン: サイド2
  'main-front': 'm8',     // フタ: サイド1

  // Lid (use 'l' prefix)
  'lid-side1': 'l1',      // フタ: バック
  'lid-side2': 'l2',      // フタ: トップ1
  'lid-back1': 'l7',      // フタ: トップ2
  'lid-back2': 'l8',      // フタ: フロント
  'lid-front': 'l6',      // フタ: サイド2
};
```

**Note:** The 5BOX models have 5 main body panels and 6 lid panels, for a total of 11 panels. Panel codes reuse some of the same encodings as the 10BOX models (m1, m2, m5-m8, l1, l2, l6-l8) for consistency.

#### Open Frame Models

**Basic Open (2 panels):**
Applies to: zudo-block-60-open-ACR-A/B, zudo-block-60-open-3DP-A/B

```typescript
const PANEL_CODES_OPEN_BASIC = {
  side1: '1',
  side2: '2',
};
```

**Upgrade Open (6 panels):**
Applies to: zudo-block-60-open-upgrade-ACR, zudo-block-60-open-upgrade-3DP

```typescript
const PANEL_CODES_OPEN_UPGRADE = {
  back1: '7',
  back2: '8',
  bottom1: '5',
  bottom2: '6',
  top1: 't1', // use 't' prefix for top panels
  top2: 't2',
};
```

#### Stand Models (4 panels)

Applies to: zudo-stand-40, zudo-stand-40x2, zudo-stand-60, zudo-stand-60x2

```typescript
const PANEL_CODES_STAND = {
  angle1: 'n1',    // Left angle panel (use 'n' prefix)
  angle2: 'n2',    // Right angle panel
  support1: 'p1',  // Top support panel (use 'p' prefix)
  support2: 'p2',  // Bottom support panel
};
```

### Color ID Codes

Color codes are 1-2 characters and differ by material type.

#### Acrylic Colors

```typescript
const COLOR_CODES_ACRYLIC = {
  clear: 'c',
  red: 'r',
  orange: 'o',
  yellow: 'y',
  'frost-clear': 'fc',
  'ocean-blue': 'ob',
  'sky-blue': 'sb',
  forest: 'f',
  lime: 'l',
  shadow: 's',
  pink: 'p',
};
```

#### 3D Print Colors

```typescript
const COLOR_CODES_3DP = {
  'carbon-black': 'cb',
  'bone-white': 'bw',
  'clear-blue': 'bl', // Semi-transparent blue (PETG)
  'clear-red': 'rd', // Semi-transparent red (PETG) - distinct from crimson-red
  'crimson-red': 'cr', // Opaque red (PLA)
  'dark-orange': 'do',
  'light-orange': 'lo',
  'deep-yellow': 'dy',
  'bright-gold': 'bg', // Renamed from 'gold-yellow'
  'deep-gold': 'dg', // New color
  'indigo-blue': 'ib',
  'red-green-silk': 'rg',
  green: 'g',
  'silver-gray': 'sg', // Renamed from 'silver'
  'silver-white': 'sw', // New color
  '3dp-pink': 'pk',
  caramel: 'ca', // New color
};
```

**Important:** `crimson-red` (cr) and `clear-red` (rd) have the same hex value (#b71c1c) but different opacity. Using color IDs ensures the correct opacity is preserved.

#### Migration Notes

**Color Renames:**

- `gold-yellow` (code: `gy`) was renamed to `bright-gold` (code: `bg`)
- `silver` (code: `sv`) was renamed to `silver-gray` (code: `sg`)

⚠️ **Breaking Change:** Old URLs containing the deprecated color codes (`gy`, `sv`) will no longer decode properly. These URLs need to be manually updated to use the new color codes (`bg`, `sg`).

## URL Examples

### Example 1: Simple 40HP Configuration

**URL:** `/m?c=2a&p=1cb.2cb.7cr.8cr.5cb.6cr.3cb.4cr`

**Decoded:**

- Case: `zudo-block-40-3DP-A` (40HP, 3D printed, Type A)
- Panel Colors:
  - side1 (1): carbon-black (cb)
  - side2 (2): carbon-black (cb)
  - front1 (3): carbon-black (cb)
  - front2 (4): crimson-red (cr)
  - bottom1 (5): carbon-black (cb)
  - bottom2 (6): crimson-red (cr)
  - back1 (7): crimson-red (cr)
  - back2 (8): crimson-red (cr)

This is the **KuroBeni** preset pattern (black primary, crimson-red secondary).

### Example 2: X2 Model (12 panels)

**URL:** `/m?c=6a&p=1cb.2cb.9cb.acb.7cr.8cr.5cb.6cr.bcb.ccr.3cb.4cr`

**Decoded:**

- Case: `zudo-block-40x2-3DP-A` (80HP, 3D printed, Type A)
- 12 panels with KuroBeni pattern (carbon-black + crimson-red)

### Example 3: 10BOX Model

**URL:** `/m?c=9a&p=m1cb.m2cb.m3cb.m4cb.m5cb.m6cb.m7cb.m8cb.m9cb.macb.l1cb.l2cb.l3cb.l4cb.l5cb.l6cb`

**Decoded:**

- Case: `10box-shallow-3dp` (104HP, 3D printed)
- All panels: carbon-black (YamiKage/All Black preset)

### Example 4: 5BOX Model

**URL:** `/m?c=fa&p=m1cb.m2cb.m5cb.m6cb.m7cb.m8cb.l1cb.l2cb.l7cb.l8cb.l6cb`

**Decoded:**

- Case: `5box-shallow-3dp` (60HP, 3D printed)
- All panels: carbon-black (YamiKage/All Black preset)
- 11 panels total: 5 main body + 6 lid panels

**Alternative with mixed colors:**

**URL:** `/m?c=fb&p=m1cb.m2cb.m5cb.m6cb.m7cb.m8sw.l1sw.l2sw.l7sw.l8sw.l6sw`

**Decoded:**

- Case: `5box-deep-3dp` (60HP, 3D printed, deep variant)
- Main panels: carbon-black (cb)
- Lid panels: silver-white (sw)

### Example 5: Open Frame Upgrade

**URL:** `/m?c=ou&p=7cb.8cr.5cb.6cr.t1cb.t2cr`

**Decoded:**

- Case: `zudo-block-60-open-upgrade-ACR` (60HP open frame with upgrade panels)
- Panel Colors:
  - back1 (7): carbon-black
  - back2 (8): crimson-red
  - bottom1 (5): carbon-black
  - bottom2 (6): crimson-red
  - top1 (t1): carbon-black
  - top2 (t2): crimson-red

### Example 6: Demonstrating Color ID Distinction

**URL with clear-red:** `/m?c=2a&p=1rd.2rd.3rd.4rd.5rd.6rd.7rd.8rd`

**URL with crimson-red:** `/m?c=2a&p=1cr.2cr.3cr.4cr.5cr.6cr.7cr.8cr`

Both use the same hex value (#b71c1c), but:

- `rd` (clear-red) renders with 0.6 opacity (semi-transparent PETG)
- `cr` (crimson-red) renders with 1.0 opacity (opaque PLA)

### Example 7: New Color Demonstration

**URL with deep-gold:** `/m?c=2a&p=1cb.2cb.3dg.4dg.5cb.6cb.7dg.8dg`

**URL with silver-white:** `/m?c=2a&p=1sw.2sw.3sw.4sw.5sw.6sw.7sw.8sw`

**URL with caramel:** `/m?c=2a&p=1cb.2cb.3ca.4ca.5cb.6cb.7ca.8ca`

These demonstrate the new color options:

- `dg` (deep-gold) - #ff9900 (PLA)
- `sw` (silver-white) - #dfe0dd (PLA)
- `ca` (caramel) - #ab461e (PLA)

### Example 8: Stand Model

**URL:** `/m?c=s4&p=n1cb.p1cb.p2cb.n2cb`

**Decoded:**

- Case: `zudo-stand-40` (40HP stand, 3D printed)
- Panel Colors:
  - angle1 (n1): carbon-black (cb)
  - support1 (p1): carbon-black (cb)
  - support2 (p2): carbon-black (cb)
  - angle2 (n2): carbon-black (cb)

This is the **YamiKage** preset (all black) - the only preset available for stand models.

**Other stand model URLs:**

- `zudo-stand-40x2` (80HP): `/m?c=s8&p=n1cb.p1cb.p2cb.n2cb`
- `zudo-stand-60` (60HP): `/m?c=s6&p=n1cb.p1cb.p2cb.n2cb`
- `zudo-stand-60x2` (120HP): `/m?c=sc&p=n1cb.p1cb.p2cb.n2cb`

## Implementation Details

### Encoding Algorithm

```typescript
function encodePanelColors(panelColorIds: { [key: string]: string }): string {
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
```

**Key Points:**

- Accepts color IDs directly (not hex values)
- Maps panel IDs to short codes (e.g., 'side1' → '1')
- Maps color IDs to short codes (e.g., 'crimson-red' → 'cr')
- Joins with dots for compactness

### Decoding Algorithm

```typescript
function decodePanelColors(encoded: string): { [key: string]: string } {
  if (!encoded) return {};

  const panelColorIds: { [key: string]: string } = {};
  const parts = encoded.split('.');

  parts.forEach((part) => {
    // Determine panel code length based on first character
    let panelCodeLength = 1;
    if (part[0] === 'm' || part[0] === 'l' || part[0] === 't' || part[0] === 'n' || part[0] === 'p') {
      panelCodeLength = 2; // 10BOX, open upgrade, or stand panels
    }

    const panelCode = part.slice(0, panelCodeLength);
    const panelId = PANEL_REVERSE_MAP[panelCode];

    if (panelId) {
      const colorCode = part.slice(panelCodeLength);
      const colorId = COLOR_REVERSE_MAP[colorCode];

      if (colorId) {
        panelColorIds[panelId] = colorId;
      }
    }
  });

  return panelColorIds;
}
```

**Key Points:**

- Returns color IDs directly (not hex values)
- Handles variable-length panel codes (1-2 chars)
- Automatically detects 10BOX (`m`, `l`) and open upgrade (`t`) prefixes
- Skips invalid codes gracefully

### Why Color IDs Instead of Hex Values?

The system uses color IDs as the primary encoding mechanism to solve critical issues:

**Problem with hex-based encoding:**

```typescript
// These two colors have the same hex value but different properties
'crimson-red': { value: '#b71c1c', opacity: 1.0, material: 'PLA' }
'clear-red':   { value: '#b71c1c', opacity: 0.6, material: 'PETG' }

// If URL stores hex value #b71c1c:
// - On reload, system finds first match → always returns 'crimson-red'
// - Result: Semi-transparent panels become opaque (visual regression)
```

**Solution with color ID encoding:**

```typescript
// URL stores color ID 'rd' or 'cr'
// - 'rd' always decodes to 'clear-red' (semi-transparent)
// - 'cr' always decodes to 'crimson-red' (opaque)
// - No ambiguity, opacity is preserved through reload
```

## Validation Rules

1. **Case Code:** Must be a valid code from the case mapping table
2. **Panel Codes:** Must match the selected case's panel structure
3. **Color Codes:** Must be valid for the case material (acrylic or 3dp)
4. **Completeness:** Not required - missing panels use default colors

## Error Handling

### Invalid Case Code

- Default to the first available case
- Log warning in console

### Invalid Panel/Color Codes

- Skip invalid pairs
- Use default color for that panel
- Log warning in console

### Malformed URL

- Gracefully degrade to default configuration
- Preserve any valid parameters found

## Related Files

Implementation can be found in:

- `/utils/url-encoder.ts` - Core encoding/decoding functions
- `/utils/url-encoder.test.ts` - Comprehensive test suite
- `/data/cases.ts` - Case model definitions
- `/data/colors.ts` - Color definitions with opacity values
