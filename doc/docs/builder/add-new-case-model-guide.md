# Adding New Case Models: Complete Implementation Guide

A comprehensive guide for adding synthesizer case models to the Takazudo Modular Panels application, with real-world examples and solutions.

## Quick Start Checklist

For experienced developers, here's the essential checklist:

- [ ] Place SVG file in `/public/svg/` with kebab-case naming
- [ ] Add case configuration to `/data/cases.ts`
- [ ] Set up panel mapping in `/components/case-visualizer.tsx`
- [ ] Add URL encoding in `/utils/url-encoder.ts`
- [ ] Test all panels are clickable and colors apply correctly
- [ ] Verify URL persistence works

## Table of Contents

- [Overview](#overview)
- [Understanding Panel Identification Methods](#understanding-panel-identification-methods)
- [Step 1: Prepare Your SVG](#step-1-prepare-your-svg)
- [Step 2: Configure Case Data](#step-2-configure-case-data)
- [Step 3: Implement Panel Mapping](#step-3-implement-panel-mapping)
- [Step 4: Handle Edge Cases](#step-4-handle-edge-cases)
- [Step 5: Add URL Encoding](#step-5-add-url-encoding)
- [Step 6: Test Your Implementation](#step-6-test-your-implementation)
- [Real Example: 10BOX Deep Model](#real-example-10box-deep-model)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Best Practices](#best-practices)

## Overview

Adding a new case model involves five core components:

- **SVG diagram**: Visual representation with clickable panels
- **Case configuration**: Panel definitions and metadata
- **Panel mapping**: Connecting SVG elements to panel IDs
- **URL encoding**: Enabling configuration sharing
- **Testing**: Ensuring all features work correctly

Time estimate: 1-2 hours for a standard model, 2-3 hours for complex models with special cases.

## Understanding Panel Identification Methods

The application supports two methods for identifying panels in SVG files, chosen based on the number of panels and SVG structure.

### Method 1: Class-Based (8-12 panels)

Used for simpler models like Zudo Block preset.

```xml
<svg>
  <g id="layer1">
    <path class="a" d="..." />
    <path class="b" d="..." />
    <path class="c" d="..." />
  </g>
</svg>
```

**Mapping configuration:**

```typescript
const CLASS_TO_PANEL_8: { [key: string]: string } = {
  a: 'side1',
  b: 'side2',
  c: 'back1',
  // ...up to h
};
```

### Method 2: Color-Based (16+ panels)

Used for complex models like 10BOX preset.

```xml
<svg>
  <g id="layer1">
    <path style="fill:#00a99d" d="..." />
    <path style="fill:#ef4136" d="..." />
    <path style="fill:#ed1c24" d="..." />
  </g>
</svg>
```

**Mapping configuration:**

```typescript
const COLOR_TO_PANEL_10BOX: { [key: string]: string } = {
  '#00a99d': 'main-side1',
  '#ef4136': 'main-side2',
  '#ed1c24': 'main-back1',
  // ...more colors
};
```

**Why two methods?** Class-based is cleaner but limited to 26 panels (a-z). Color-based scales better for complex models.

## Step 1: Prepare Your SVG

### 1.1 File Naming and Location

Place your SVG file in:

```
/public/svg/
```

Use descriptive kebab-case naming:

```
{model}-{variant}.svg

Examples:
- 10box-shallow-3dp.svg
- 10box-deep-3dp.svg
- zudo-block-40-lite-A.svg
```

### 1.2 SVG Structure Requirements

#### For Class-Based Models

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1926 2358">
  <g id="layer1">
    <path class="a" d="M100,100..." />
    <path class="b" d="M200,100..." />
    <!-- Each path needs a unique class (a-z) -->
  </g>
</svg>
```

#### For Color-Based Models

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1926 2358">
  <g id="layer1">
    <path style="fill:#00a99d" d="M100,100..." />
    <path style="fill:#ef4136" d="M200,100..." />
    <!-- Each path needs a unique fill color -->
  </g>
</svg>
```

### 1.3 Optimize ViewBox

Ensure the viewBox tightly fits your content:

```xml
<!-- Poor: Generic large viewBox with whitespace -->
<svg viewBox="0 0 2834 2834">

<!-- Good: Tight fit to actual content -->
<svg viewBox="0 0 1926.153 2358.23">
```

**How to find optimal viewBox:**

1. Open SVG in browser
2. Use DevTools to select all paths
3. Check computed bounding box
4. Update viewBox to match

## Step 2: Configure Case Data

### 2.1 Add Case Definition

Edit `/data/cases.ts`:

```typescript
export const cases: { [key: string]: CaseConfig } = {
  // ...existing cases...

  'your-model-name': {
    name: 'Display Name', // Shows in dropdown
    hp: 104, // HP rating
    material: '3dp', // '3dp' or 'acrylic'
    panels: [
      { id: 'panel-1', name: 'パネル1' },
      { id: 'panel-2', name: 'パネル2' },
      // List all panels in order
    ],
  },
};
```

### 2.2 Panel Naming Conventions

#### For models with main/lid separation:

```typescript
panels: [
  // Main case panels
  { id: 'main-side1', name: 'メイン: サイド1' },
  { id: 'main-side2', name: 'メイン: サイド2' },
  { id: 'main-back1', name: 'メイン: バック1' },

  // Lid panels
  { id: 'lid-top1', name: 'フタ: トップ1' },
  { id: 'lid-front', name: 'フタ: フロント' },
];
```

#### For unified models:

```typescript
panels: [
  { id: 'side1', name: 'サイド1' },
  { id: 'side2', name: 'サイド2' },
  { id: 'back1', name: 'バック1' },
];
```

## Step 3: Implement Panel Mapping

### 3.1 For Class-Based Models

If your model uses 8 or 12 panels with class attributes, the existing mappings may work without modification:

```typescript
// In case-visualizer.tsx
// These constants already exist:
const CLASS_TO_PANEL_8 = {
  /* ... */
};
const CLASS_TO_PANEL_12 = {
  /* ... */
};
```

### 3.2 For Color-Based Models

Add a new color mapping constant in `/components/case-visualizer.tsx`:

```typescript
const COLOR_TO_PANEL_YOUR_MODEL: { [key: string]: string } = {
  '#00a99d': 'panel-1',
  '#ef4136': 'panel-2',
  '#ed1c24': 'panel-3',
  // Map each color to its panel ID
};
```

### 3.3 Update the Mapping Logic

Find the `loadSVG` function and add your model:

```typescript
// Better approach: Use a lookup object
const COLOR_MAPS: { [key: string]: { [key: string]: string } } = {
  '10box-shallow-3dp': COLOR_TO_PANEL_10BOX_SHALLOW,
  '10box-deep-3dp': COLOR_TO_PANEL_10BOX_DEEP,
  'your-model-name': COLOR_TO_PANEL_YOUR_MODEL,
};

const colorToPanelMap = COLOR_MAPS[caseType] || {};
```

## Step 4: Handle Edge Cases

### 4.1 Panels Without Fill Style

Some SVG tools create paths without fill styles. Here's how to handle them:

```typescript
// In the path processing loop
const styleAttr = pathElement.getAttribute('style');
const fillMatch = styleAttr?.match(/fill:\s*([^;]+)/);

if (!fillMatch) {
  // Handle by index position
  if (index === 2) {
    panelId = 'main-side2'; // Known panel at this index
  }
  // Could check multiple indices for robustness
  else if (index === 3) {
    panelId = 'alternate-panel';
  }
} else {
  const originalColor = fillMatch[1].trim();
  panelId = colorToPanelMap[originalColor];
}
```

**Finding the right index:**

1. Open your SVG in browser
2. Use console: `document.querySelectorAll('path').forEach((p, i) => console.log(i, p.getAttribute('style')))`
3. Note which index has no style attribute

### 4.2 Handling Unmapped Panels

When your SVG has more panels than your case offers (e.g., reusing diagrams for variants):

```typescript
if (!panelId) {
  // Remove unmapped panels completely
  pathElement.remove();
  continue;
}
```

**Why remove instead of hide?**

- Prevents accidental clicks on unavailable panels
- Cleaner DOM for debugging
- Better performance
- Clear visual feedback (panels simply don't exist)

### 4.3 Model Variants with Same SVG

When multiple model variants share the same SVG file:

```typescript
// Both shallow and deep variants use the same SVG, but may have different panel sets
// IMPORTANT: Always map ALL colors in the SVG to avoid invisible panels

// Shallow variant - includes all 16 panels
const COLOR_TO_PANEL_10BOX_SHALLOW: { [key: string]: string } = {
  '#00a99d': 'main-side1',
  '#ef4136': 'main-back1',
  '#939598': 'lid-top2',
  '#a7a9ac': 'lid-top1',
  // ... map all 15 colors (plus 1 path without fill)
};

// Deep variant - same SVG, same 16 panels
const COLOR_TO_PANEL_10BOX_DEEP: { [key: string]: string } = {
  '#00a99d': 'main-side1',
  '#ef4136': 'main-back1',
  '#939598': 'lid-top2',
  '#a7a9ac': 'lid-top1',
  // ... map all 15 colors (plus 1 path without fill)
};
```

**Key Point:** Even if model variants seem different, if they share the same SVG, they likely have the same panels. Always verify by checking the actual SVG structure.

## Step 5: Add URL Encoding

### 5.1 Update URL Encoder

Edit `/utils/url-encoder.ts`:

```typescript
const CASE_MAPPING: { [key: string]: string } = {
  // ...existing mappings...
  'your-model-name': 'xy', // Choose unique 2-char code
};
```

### 5.2 Choosing a Code

Format: 2 characters (alphanumeric)

Strategy:

- First character: model preset number or letter
- Second character: variant identifier (a, b, c)

Examples:

- `8a` = Zudo Block 40 ACR variant A
- `9b` = 10BOX deep 3D printed
- `1a` = 10BOX shallow 3D printed

### 5.3 Verify It Works

Test in browser console:

```javascript
// After implementing
const encoded = encodeCase('your-model-name');
console.log(encoded); // Should output 'xy'

const decoded = decodeCase('xy');
console.log(decoded); // Should output 'your-model-name'
```

## Step 6: Test Your Implementation

### 6.1 Development Server

```bash
npm run dev
# Opens at http://localhost:3200
```

### 6.2 Manual Testing Checklist

#### Basic Functionality

- [ ] Model appears in dropdown selector
- [ ] SVG loads without console errors
- [ ] All panels are visible in the diagram
- [ ] Correct HP rating displays

#### Panel Interactions

- [ ] Click each panel - verify selection
- [ ] Check panel list shows correct names
- [ ] Test color changes apply to correct panels
- [ ] Verify unmapped panels cannot be clicked

#### URL Persistence

1. Configure several panels with colors
2. Copy URL from address bar
3. Open in new tab
4. Verify exact configuration loads

Example URL:

```
http://localhost:3200/m?c=xy&p=panel-1:w|panel-2:r|panel-3:b
```

#### Special Cases

- [ ] Panel without fill style works (if applicable)
- [ ] Removed panels don't show gray rectangles
- [ ] 3DP preset appears for 3D printed models

### 6.3 Automated Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:smoke

# Debug mode
npm run test:debug
```

### 6.4 Add Model-Specific Tests

Create tests in `/utils/url-encoder.test.ts`:

```typescript
describe('your-model-name encoding', () => {
  it('should encode case correctly', () => {
    const result = encodeCase('your-model-name');
    expect(result).toBe('xy');
  });

  it('should decode case correctly', () => {
    const result = decodeCase('xy');
    expect(result).toBe('your-model-name');
  });
});
```

## Real Example: Zudo Stand Model

Let's walk through a simple 4-panel model implementation.

### The Model

- **Name**: zudo-stand-40 (40HP case stand)
- **Panels**: 4 panels with color-based identification
- **Material**: 3D printed only
- **Preset**: YamiKage (all black)

### SVG Analysis

The SVG has 4 paths with different fill colors:

```xml
<svg viewBox="0 0 1872.788 711.231">
  <path style="fill:#fbb040" d="..." />  <!-- Orange - Left angle -->
  <path style="fill:#ed1e79" d="..." />  <!-- Pink - Right angle -->
  <path style="fill:#be1e2d" d="..." />  <!-- Red - Top support -->
  <path style="fill:#ff7bac" d="..." />  <!-- Light pink - Bottom support -->
</svg>
```

### Implementation Steps

#### 1. Case Configuration

```typescript
// /data/cases.ts
'zudo-stand-40': {
  name: 'zudo-stand-40',
  hp: 40,
  material: '3dp',
  panels: [
    { id: 'angle1', name: 'アングル1' },      // Left angle
    { id: 'support1', name: 'サポート1' },    // Top support
    { id: 'support2', name: 'サポート2' },    // Bottom support
    { id: 'angle2', name: 'アングル2' },      // Right angle
  ],
}
```

#### 2. Color Mapping

```typescript
// /components/case-visualizer.tsx
const COLOR_TO_PANEL_ZUDO_STAND: { [key: string]: string } = {
  '#fbb040': 'angle1',     // Orange (left)
  '#ed1e79': 'angle2',     // Pink (right)
  '#be1e2d': 'support1',   // Red (top)
  '#ff7bac': 'support2',   // Light pink (bottom)
};

// Add to COLOR_MAPS lookup
const COLOR_MAPS: { [key: string]: { [key: string]: string } } = {
  // ...existing mappings...
  'zudo-stand-40': COLOR_TO_PANEL_ZUDO_STAND,
  'zudo-stand-40x2': COLOR_TO_PANEL_ZUDO_STAND,
  'zudo-stand-60': COLOR_TO_PANEL_ZUDO_STAND,
  'zudo-stand-60x2': COLOR_TO_PANEL_ZUDO_STAND,
};
```

**Note:** All 4 zudo-stand models use the same 4-panel structure and color mapping.

#### 3. URL Encoding

```typescript
// /utils/url-encoder.ts
const CASE_MAPPING: { [key: string]: string } = {
  // ...existing mappings...
  'zudo-stand-40': 's4',
  'zudo-stand-40x2': 's8',
  'zudo-stand-60': 's6',
  'zudo-stand-60x2': 'sc',
};

// Panel codes for stand models
const PANEL_CODES_STAND = {
  'angle1': 'a1',
  'support1': 's1',
  'support2': 's2',
  'angle2': 'a2',
};
```

#### 4. Testing Results

All panels work correctly:
- Each panel is clickable and selectable
- YamiKage preset applies black to all 4 panels
- URL sharing preserves configuration
- No unmapped colors or missing panels

### Key Takeaways

1. **Simple models** with 4 panels are straightforward to implement
2. **Reusable mappings**: Same color mapping works across all stand variants
3. **Consistent naming**: Japanese panel names follow the same pattern
4. **Quick implementation**: ~30 minutes for 4 similar models

---

## Real Example: 10BOX Deep Model

Let's walk through the actual implementation of a complex model with special cases.

### The Challenge

- SVG has 16 paths total (15 with fill colors + 1 without)
- One panel (`main-side2`) has no fill style
- Model includes all 16 panels (10 main + 6 lid panels)
- Uses the same SVG as the shallow variant

### Implementation

#### 1. Case Configuration

```typescript
// /data/cases.ts
'10box-deep-3dp': {
  name: '10BOX-deep-3DP',
  hp: 104,
  material: '3dp',
  panels: [
    // 10 main panels
    { id: 'main-side1', name: 'メイン: サイド1' },
    { id: 'main-side2', name: 'メイン: サイド2' },
    { id: 'main-back1', name: 'メイン: バック1' },
    { id: 'main-bottom1', name: 'メイン: ボトム1' },
    { id: 'main-bottom2', name: 'メイン: ボトム2' },
    { id: 'main-front', name: 'メイン: フロント' },
    { id: 'main-side3', name: 'メイン: サイド3' },
    { id: 'main-side4', name: 'メイン: サイド4' },
    { id: 'main-stand1', name: 'メイン: スタンド1' },
    { id: 'main-stand2', name: 'メイン: スタンド2' },
    // 6 lid panels
    { id: 'lid-side1', name: 'フタ: サイド1' },
    { id: 'lid-back', name: 'フタ: バック' },
    { id: 'lid-top1', name: 'フタ: トップ1' },
    { id: 'lid-top2', name: 'フタ: トップ2' },
    { id: 'lid-front', name: 'フタ: フロント' },
    { id: 'lid-side2', name: 'フタ: サイド2' },
  ],
}
```

#### 2. Complete Color Mapping

```typescript
// /components/case-visualizer.tsx
// SVG path order (0-indexed):
// Path 0: #00aeef (cyan) -> main-side3
// Path 1: #00a99d (teal) -> main-side1
// Path 2: #2e3192 (dark blue) -> main-side4
// Path 3: No fill style -> main-side2 (handled by index)
// Path 4: #ef4136 (red) -> main-back1
// Path 5: #00a651 (green) -> main-front
// Path 6: #fff200 (yellow) -> main-bottom2
// Path 7: #ed1c24 (darker red) -> main-bottom1
// Path 8: #939598 (gray) -> lid-top2
// Path 9: #a7a9ac (light gray) -> lid-top1
// Path 10: #808285 (gray) -> lid-side2
// Path 11: #662d91 (purple) -> lid-side1
// Path 12: #58595b (dark gray) -> lid-front
// Path 13: #a97c50 (brown) -> lid-back
// Path 14: #ec008c (magenta) -> main-stand1
// Path 15: #9e1f63 (dark purple) -> main-stand2

const COLOR_TO_PANEL_10BOX_DEEP: { [key: string]: string } = {
  '#00aeef': 'main-side3', // Path 0
  '#00a99d': 'main-side1', // Path 1
  '#2e3192': 'main-side4', // Path 2
  // Path 3 (main-side2) has no fill style, handled by position
  '#ef4136': 'main-back1', // Path 4
  '#00a651': 'main-front', // Path 5
  '#fff200': 'main-bottom2', // Path 6
  '#ed1c24': 'main-bottom1', // Path 7
  '#939598': 'lid-top2', // Path 8
  '#a7a9ac': 'lid-top1', // Path 9
  '#808285': 'lid-side2', // Path 10
  '#662d91': 'lid-side1', // Path 11
  '#58595b': 'lid-front', // Path 12
  '#a97c50': 'lid-back', // Path 13
  '#ec008c': 'main-stand1', // Path 14
  '#9e1f63': 'main-stand2', // Path 15
};
```

#### 3. Special Case Handling

```typescript
// In loadSVG function
paths.forEach((pathElement, index) => {
  const styleAttr = pathElement.getAttribute('style');
  const fillMatch = styleAttr?.match(/fill:\s*([^;]+)/);

  let panelId: string | undefined;

  // Check if this is Panel 2 (main-side2) - has no fill style
  // Position varies between models: shallow (index 2) vs deep (index 3)
  const isSide2NoFill =
    !fillMatch &&
    ((caseType === '10box-shallow-3dp' && index === 2) ||
      (caseType === '10box-deep-3dp' && index === 3));

  if (isSide2NoFill) {
    panelId = 'main-side2';
  } else if (fillMatch) {
    const originalColor = fillMatch[1].trim();
    panelId = colorToPanelMap[originalColor];
  }

  if (panelId) {
    // Store the panel ID for later use
    pathElement.setAttribute('data-panel-id', panelId);
    // Set up click handler and hover effects
    // ...
  } else if (fillMatch) {
    // This path has a fill color but no mapped panel ID
    // This shouldn't happen if our mappings are complete
    console.warn(`Unmapped color in 10BOX model: ${fillMatch[1]} at index ${index}`);
  }
});
```

### Results

- All 16 panels are clickable and interactive
- Lid panels (middle section) are fully visible and functional
- Panel without style attribute (main-side2) works correctly
- URL sharing preserves configuration for all 16 panels
- 3DP preset applies successfully

## Troubleshooting Common Issues

### Panel Not Clickable

**Symptoms:** Clicking a panel does nothing

**Debug steps:**

```typescript
// Add to case-visualizer.tsx
console.log('Panel setup:', {
  index,
  panelId,
  style: pathElement.getAttribute('style'),
  class: pathElement.getAttribute('class'),
});
```

**Solutions:**

| Cause                 | Fix                             |
| --------------------- | ------------------------------- |
| Missing color mapping | Add color to `COLOR_TO_PANEL_*` |
| No fill style         | Add index-based detection       |
| Panel removed         | Ensure panel ID in cases.ts     |
| Wrong mapping type    | Check if using class vs color   |

### Wrong Panel Highlights

**Symptoms:** Clicking panel A highlights panel B

**Fix:** Verify exact ID match between:

- Color/class mapping in case-visualizer.tsx
- Panel ID in cases.ts

### Gray Rectangles Appear

**Symptoms:** Unmapped panels show as gray boxes

**Fix:** Use `pathElement.remove()` instead of `display: none`

### Model Missing from Dropdown

**Symptoms:** New model doesn't appear

**Checklist:**

- [ ] Added to cases.ts with valid key
- [ ] Key has no spaces or special characters
- [ ] Browser hard refreshed (Ctrl+Shift+R)

### URL Sharing Broken

**Symptoms:** Shared URL loads wrong model or config

**Debug:**

```typescript
console.log('Encode test:', encodeCase('your-model'));
console.log('Decode test:', decodeCase('xy'));
```

**Fix:** Ensure unique 2-char code in CASE_MAPPING

## Best Practices

### Code Organization

- Group related constants together
- Use descriptive variable names
- Add comments for non-obvious logic
- Keep consistent formatting

### Naming Conventions

| Type      | Convention  | Example                |
| --------- | ----------- | ---------------------- |
| Files     | kebab-case  | `10box-deep-3dp.svg`   |
| Case IDs  | kebab-case  | `'10box-deep-3dp'`     |
| Panel IDs | kebab-case  | `'main-side1'`         |
| Constants | UPPER_SNAKE | `COLOR_TO_PANEL_10BOX` |

### Testing Strategy

1. Test each panel individually
2. Test edge cases (first/last panels)
3. Test URL persistence
4. Cross-browser testing (Chrome, Firefox, Safari)
5. Test with real users before release

### Documentation

- Update this guide with new patterns
- Add inline comments for workarounds
- Document SVG quirks
- Keep a changelog

### Performance

- Remove unmapped panels (don't hide)
- Optimize SVG viewBox
- Keep color mappings efficient
- Test with browser DevTools Performance tab

## Quick Reference

### File Locations

```
/public/svg/                    # SVG diagrams
/data/cases.ts                  # Case configurations
/components/case-visualizer.tsx # Panel mappings
/utils/url-encoder.ts           # URL encoding
/utils/*.test.ts                # Tests
```

### Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run test       # Run all tests
npm run test:smoke # Quick smoke tests
npm run typecheck  # TypeScript checking
npm run lint       # Code quality check
```

### Debugging Tips

```javascript
// Check available cases
console.log(Object.keys(cases));

// Inspect SVG paths
document.querySelectorAll('path').forEach((p, i) => {
  console.log(i, p.getAttribute('class'), p.getAttribute('style'));
});

// Test URL encoding
console.log(encodeCase('model-name'));
console.log(decodeCase('xy'));
```

---

**Version:** 3.0
**Last Updated:** 2025-10-10
**Maintainer:** Takazudo

For additional help, refer to:

- Reference project: `/Users/takazudo/repos/personal/takazudomodular`
- React docs: [react.dev](https://react.dev)
- TypeScript docs: [typescriptlang.org](https://www.typescriptlang.org)
