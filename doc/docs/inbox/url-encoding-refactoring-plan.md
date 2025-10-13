# URL Encoding Refactoring Plan

## Current Problem

The current URL encoding system has a critical flaw: it encodes panel colors using their hex values rather than unique color IDs. This causes issues when multiple colors share the same hex value (e.g., `crimson-red` and `clear-red` both use `#b71c1c`).

### Example Problem Cases

#### Problem 1: Series Detection Bug

- URL: `/m?c=2a&p=1cb.2cb.7cb.8rd.5cb.6rd.3cb.4rd`
- Color codes: `cb` = carbon-black, `rd` = clear-red
- Issue: KuroBeni series expects `crimson-red` but URL has `clear-red` (both #b71c1c)
- Result: Series detection incorrectly highlights KuroBeni as active

#### Problem 2: Opacity Loss on Reload (Critical)

- User selects `clear-red` (semi-transparent, #b71c1c)
- URL saves hex value #b71c1c
- On reload, hydration finds first matching color: `crimson-red` (opaque, #b71c1c)
- CaseVisualizer uses `getColorOpacityById('crimson-red')` → returns 1.0 (opaque)
- Result: Transparent panels become opaque after reload, visual regression

## Current Implementation Analysis

### 1. Panel Selection → URL (Encoding)

**Flow:**
1. User selects colors in the configurator
2. `configurator.tsx` maintains state:
- `panelColors`: `{ [panelId]: hexValue }` (e.g., `{ "side1": "#b71c1c" }`)
- `panelColorIds`: `{ [panelId]: colorId }` (e.g., `{ "side1": "crimson-red" }`)
3. `useUrlPersistence` hook updates URL when state changes
4. `encodePanelColors()` converts to URL:
- Takes `panelColors` (hex values)
- Uses `colorIdMap` to find color ID from hex value
- Maps to short codes (e.g., `crimson-red` → `cr`)
- Creates compact string like `1cb.2cr.3cb`

**Problem:** When multiple colors have same hex value, `colorIdMap[hexValue]` returns the first matching color ID, not necessarily the correct one.

### 2. URL → Panel Selection (Decoding)

**Flow:**
1. Page loads with URL parameters
2. `getInitialStateFromUrl()` in `configurator.tsx`:
- Decodes case: `2a` → `zudo-block-40-3DP-A`
- Decodes colors: `1cb.2rd` → panel colors
3. `decodePanelColors()`:
- Parses compact string
- Maps short codes back to color IDs (e.g., `cr` → `crimson-red`)
- Uses `colorValueMap` to get hex values
- Returns `{ [panelId]: hexValue }`
4. Component reconstructs `panelColorIds` by searching for colors with matching hex values:
   ```typescript
   // configurator.tsx:119-126
   const matchingColor = availableColors?.find((c) => c.value === colorValue);
   ```
- **Critical Bug**: This always returns the first match
- For #b71c1c, returns `crimson-red` even if user selected `clear-red`
- Opacity information is lost, causing visual regression

## Proposed Solution

### Core Change: Encode Color IDs, Not Hex Values

Instead of storing hex values in component state and trying to reverse-engineer color IDs, we should:
1. Always maintain color IDs as the source of truth
2. Derive hex values from IDs when needed for rendering
3. Encode/decode using color IDs directly

### New Data Flow

#### Panel Selection → URL

```typescript
// State structure
interface ConfiguratorState {
  selectedCase: string;
  panelColorIds: { [panelId]: colorId };  // Primary state
  // panelColors derived from panelColorIds when needed
}

// Encoding
encodePanelColors(panelColorIds) → "1cb.2cr.3cb"
// Direct ID to short code mapping
```

#### URL → Panel Selection

```typescript
// Decoding
decodePanelColors("1cb.2cr.3cb") → { "side1": "carbon-black", "side2": "crimson-red", ... }
// Returns color IDs, not hex values

// Component derives hex values for rendering
const panelColors = derivePanelColors(panelColorIds, material);
```

## Implementation Plan

### Phase 1: Refactor Internal State Management

1. **Update `configurator.tsx`**:
- Make `panelColorIds` the primary state
- Derive `panelColors` from `panelColorIds`
- Remove redundant color value lookups

2. **Update color selection handlers**:
- `handleColorSelect()` should work with color IDs
- `handleSeriesSelect()` already returns IDs (good!)

### Phase 2: Update URL Encoding/Decoding

1. **Modify `url-encoder.ts`**:
- `encodePanelColors()`: Accept color IDs instead of values
- `decodePanelColors()`: Return color IDs instead of values
- Remove `colorIdMap` and `colorValueMap` dependencies

2. **Update `use-url-persistence.ts`**:
- Pass `panelColorIds` instead of `panelColors`
- Remove color ID lookup logic

### Phase 3: Clean Deployment

1. **Remove legacy code**:
- Delete old hex-value based logic
- Remove color value lookups
- Clean up temporary workarounds

2. **Simplify URL format**:
- No version parameter needed
- Single, clean implementation

## Benefits

1. **Correctness**: No ambiguity when colors share hex values
2. **Simplicity**: Single source of truth (color IDs)
3. **Performance**: No need to search for matching colors
4. **Maintainability**: Clearer data flow, less conversion logic
5. **Future-proof**: Easy to add new colors without conflicts
6. **Clean codebase**: No legacy compatibility code

## Deployment Strategy

### Direct Cutover (Breaking Change)

1. **Deploy new version**: All URLs use new format immediately
2. **Old URLs will break**: Users need to reconfigure
3. **Communicate change**: Update documentation, notify users if needed

## Testing Requirements

### Unit Test Plan

#### 1. URL Encoder Tests (`url-encoder.test.ts`)

```typescript
describe('URL Encoder', () => {
  describe('encodePanelColors', () => {
    it('should encode color IDs to short codes', () => {
      const input = { 'side1': 'carbon-black', 'side2': 'crimson-red' };
      expect(encodePanelColors(input)).toBe('1cb.2cr');
    });

    it('should handle clear-red vs crimson-red distinctly', () => {
      const clearRed = { 'side1': 'clear-red' };
      const crimsonRed = { 'side1': 'crimson-red' };
      expect(encodePanelColors(clearRed)).toBe('1rd');
      expect(encodePanelColors(crimsonRed)).toBe('1cr');
    });

    it('should handle all 3DP colors correctly', () => {
      const colors = ['carbon-black', 'matte-black', 'crimson-red', 'clear-red',
                     'dark-orange', 'light-orange', 'deep-yellow', 'gold-yellow',
                     'clear-blue', 'bone-white', 'wood-white', 'indigo-blue'];
      // Test each color encodes to unique short code
    });

    it('should handle x2 models with 12 panels', () => {
      const x2Panels = {
        'side1': 'carbon-black', 'side2': 'carbon-black',
        'side3': 'carbon-black', 'side4': 'carbon-black',
        'back1': 'crimson-red', 'back2': 'crimson-red',
        'bottom1': 'carbon-black', 'bottom2': 'crimson-red',
        'bottom3': 'carbon-black', 'bottom4': 'crimson-red',
        'front1': 'carbon-black', 'front2': 'crimson-red'
      };
      expect(encodePanelColors(x2Panels)).toBe('1cb.2cb.3cb.4cb.5cr.6cr.7cb.8cr.9cb.acr.bcb.ccr');
    });
  });

  describe('decodePanelColors', () => {
    it('should decode short codes to color IDs', () => {
      const input = '1cb.2cr';
      expect(decodePanelColors(input)).toEqual({
        'side1': 'carbon-black',
        'side2': 'crimson-red'
      });
    });

    it('should preserve clear-red vs crimson-red distinction', () => {
      expect(decodePanelColors('1rd')).toEqual({ 'side1': 'clear-red' });
      expect(decodePanelColors('1cr')).toEqual({ 'side1': 'crimson-red' });
    });

    it('should handle malformed input gracefully', () => {
      expect(decodePanelColors('')).toEqual({});
      expect(decodePanelColors('invalid')).toEqual({});
      expect(decodePanelColors('1zz.2qq')).toEqual({}); // Invalid codes
    });
  });
});
```

#### 2. Configurator State Tests (`configurator.test.tsx`)

```typescript
describe('Configurator State Management', () => {
  describe('Color ID as Primary State', () => {
    it('should maintain color IDs as source of truth', () => {
      const { result } = renderHook(() => useConfiguratorState());

      act(() => {
        result.current.selectColor('panel1', 'clear-red');
      });

      expect(result.current.panelColorIds['panel1']).toBe('clear-red');
      expect(result.current.panelColors['panel1']).toBe('#b71c1c');
    });

    it('should derive hex values from color IDs', () => {
      const panelColorIds = { 'side1': 'clear-red' };
      const derived = derivePanelColors(panelColorIds, '3dp');
      expect(derived['side1']).toBe('#b71c1c');
    });

    it('should preserve opacity through save/reload cycle', async () => {
      // Select clear-red (semi-transparent)
      const { rerender } = render(<Configurator />);
      fireEvent.click(screen.getByTestId('color-clear-red'));

      // Get URL
      const url = window.location.search;

      // Simulate page reload
      window.history.pushState({}, '', url);
      rerender(<Configurator />);

      // Verify opacity is preserved
      const visualizer = screen.getByTestId('case-visualizer');
      const panel = within(visualizer).getByTestId('panel-side1');
      expect(panel).toHaveStyle('opacity: 0.8'); // clear-red opacity
    });
  });
});
```

#### 3. Series Detection Tests (`panel-colors.test.ts`)

```typescript
describe('Series Detection', () => {
  it('should detect KuroBeni with crimson-red correctly', () => {
    const panelColorIds = {
      'side1': 'carbon-black', 'side2': 'carbon-black',
      'back1': 'carbon-black', 'back2': 'crimson-red',
      'bottom1': 'carbon-black', 'bottom2': 'crimson-red',
      'front1': 'carbon-black', 'front2': 'crimson-red'
    };

    expect(isSeriesActive('kurobeni', panelColorIds)).toBe(true);
  });

  it('should NOT detect KuroBeni with clear-red', () => {
    const panelColorIds = {
      'side1': 'carbon-black', 'side2': 'carbon-black',
      'back1': 'carbon-black', 'back2': 'clear-red', // Wrong color
      'bottom1': 'carbon-black', 'bottom2': 'clear-red',
      'front1': 'carbon-black', 'front2': 'clear-red'
    };

    expect(isSeriesActive('kurobeni', panelColorIds)).toBe(false);
  });

  it('should handle x2 models series detection', () => {
    const x2PanelColorIds = {
      'side1': 'carbon-black', 'side2': 'carbon-black',
      'side3': 'carbon-black', 'side4': 'carbon-black',
      'back1': 'carbon-black', 'back2': 'crimson-red',
      'bottom1': 'carbon-black', 'bottom2': 'crimson-red',
      'bottom3': 'carbon-black', 'bottom4': 'crimson-red',
      'front1': 'carbon-black', 'front2': 'crimson-red'
    };

    expect(isSeriesActive('kurobeni', x2PanelColorIds, 'x2-model')).toBe(true);
  });
});
```

#### 4. End-to-End Tests (`e2e.test.ts`)

```typescript
describe('URL Persistence E2E', () => {
  it('should preserve exact color selections through URL', async () => {
    // Select specific colors
    await page.click('[data-color="clear-red"]');
    await page.click('[data-panel="side1"]');

    // Get URL
    const url = await page.url();

    // Open new tab with same URL
    const newPage = await browser.newPage();
    await newPage.goto(url);

    // Verify exact color is preserved
    const colorId = await newPage.getAttribute('[data-panel="side1"]', 'data-color-id');
    expect(colorId).toBe('clear-red'); // NOT crimson-red
  });
});
```

### Integration Test Requirements

1. **Full flow**: select → URL → reload → correct selection
2. **Series switching**: preserves correct colors
3. **URL sharing**: between users maintains exact configuration
4. **Opacity preservation**: transparent colors stay transparent

### Edge Case Testing

1. **Invalid color IDs in URL**: Fallback to defaults
2. **Missing panels in URL**: Use default colors for missing panels
3. **Malformed URL parameters**: Graceful degradation
4. **Case changes**: Preserve compatible colors when switching models
5. **Mixed material types**: Handle invalid color/material combinations

## Risk Assessment

### Risks

1. **Breaking existing shared URLs**: Accepted as necessary for clean implementation
2. **Performance impact**: None, actually improves by removing lookups
3. **User disruption**: One-time reconfiguration needed

### Rollback Plan

If critical issues arise:
1. Revert to previous version
2. Users recreate configurations
3. Fix issues and redeploy

## Timeline Estimate

- **Phase 1**: 2-3 days (internal refactoring)
- **Phase 2**: 2-3 days (URL encoding/decoding)
- **Phase 3**: 1 day (cleanup and deployment)
- **Testing**: 2 days
- **Total**: ~7-8 days of development

## Next Steps

1. Review and approve this plan
2. Create detailed technical tasks
3. Set up test cases
4. Begin Phase 1 implementation
5. Deploy with feature flag for testing